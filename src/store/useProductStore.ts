import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductTrustBadges } from '@/types/product';
import { ALL_PRODUCTS } from '@/data/products';
import { useWishlistStore } from '@/store/useWishlistStore';

export type { Product, ProductTrustBadges };

interface ProductStoreState {
  // --- Cached Products List ---
  products: Product[];
  isInitialized: boolean;
  lastFetched: number;

  // --- Actions & SWR Cache Methods ---
  setProducts: (products: Product[]) => void;
  fetchProducts: (force?: boolean) => Promise<void>;
  updateProductStock: (idOrSlug: string, newStock: number) => void;
  removeProduct: (idOrSlug: string) => void;
  upsertProduct: (product: Product) => void;

  // --- Filter State ---
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
  isFlashSale: boolean;

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setBrand: (brand: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sortBy: string) => void;
  setIsFlashSale: (isFlashSale: boolean) => void;
  resetFilters: () => void;
}

// Fallback safe storage adapter that handles quota limits and SSR gracefully
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn('LocalStorage quota limit reached, trimming cache safely.', e);
      try {
        localStorage.removeItem(name);
      } catch {}
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    } catch {}
  },
};

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      // Initialize immediately with the full 52 products baseline (0ms instant render)
      products: ALL_PRODUCTS,
      isInitialized: true,
      lastFetched: 0,

      setProducts: (products) => set({ products }),

      fetchProducts: async (force = false) => {
        const state = get();
        const now = Date.now();
        // SWR Throttling: If fetched within the last 30 seconds and not forced, skip network call
        if (!force && state.lastFetched > 0 && now - state.lastFetched < 30000 && state.products.length >= 52) {
          return;
        }

        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          let res = await fetch('/api/products?limit=100').catch(() => null);
          if ((!res || !res.ok) && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            res = await fetch(`${API_URL}/products?limit=100`).catch(() => null);
          }

          if (!res || !res.ok) return;
          const data = await res.json().catch(() => null);
          const rawList = data?.data?.products || (Array.isArray(data?.data) ? data.data : null);

          if (rawList && Array.isArray(rawList) && rawList.length > 0) {
            const currentProducts = [...(get().products.length > 0 ? get().products : ALL_PRODUCTS)];

            // Create lookup maps for live updates to preserve list stability
            const dbMapById = new Map<string, Record<string, unknown>>();
            const dbMapBySlug = new Map<string, Record<string, unknown>>();
            const dbMapByName = new Map<string, Record<string, unknown>>();

            rawList.forEach((item: Record<string, unknown>) => {
              if (item._id) dbMapById.set(String(item._id), item);
              if (item.id) dbMapById.set(String(item.id), item);
              if (item.slug) dbMapBySlug.set(String(item.slug).toLowerCase(), item);
              if (item.title || item.name) {
                const normName = String(item.title || item.name).toLowerCase().trim();
                dbMapByName.set(normName, item);
              }
            });

            // In-place merge live DB properties into cache without shifting order
            const updated = currentProducts.map((p) => {
              const live =
                (p._id ? dbMapById.get(String(p._id)) : undefined) ||
                (p.slug ? dbMapBySlug.get(p.slug.toLowerCase()) : undefined) ||
                dbMapByName.get(p.title.toLowerCase().trim());

              if (live) {
                const dbPrice = live.price !== undefined ? Number(live.price) : p.price;
                const dbDiscount = live.discountPrice !== undefined ? Number(live.discountPrice) : p.discountPrice;
                const dbImages = Array.isArray(live.images) && live.images.length > 0 ? (live.images as string[]) : p.images;

                return {
                  ...p,
                  _id: String(live._id || live.id || p._id),
                  slug: String(live.slug || p.slug),
                  stock: live.stock !== undefined ? Number(live.stock) : p.stock,
                  price: dbPrice,
                  discountPrice: dbDiscount,
                  images: dbImages,
                  isFlashSale: live.isFlashSale !== undefined ? Boolean(live.isFlashSale) : p.isFlashSale,
                  vendorName: (live.vendorName as string) || p.vendorName,
                };
              }
              return p;
            });

            // Append any brand new DB products that were not in initial catalog
            const knownIds = new Set(updated.map((p) => p._id).filter(Boolean));
            const knownSlugs = new Set(updated.map((p) => p.slug?.toLowerCase()).filter(Boolean));

            rawList.forEach((raw: Record<string, unknown>) => {
              const rawId = String(raw._id || raw.id || '');
              const rawSlug = String(raw.slug || '').toLowerCase();
              if ((!rawId || !knownIds.has(rawId)) && (!rawSlug || !knownSlugs.has(rawSlug))) {
                const priceNum = Number(raw.price) || 0;
                const discNum = raw.discountPrice !== undefined ? Number(raw.discountPrice) : undefined;
                const rawImages = Array.isArray(raw.images) && raw.images.length > 0
                  ? (raw.images as string[])
                  : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'];

                updated.push({
                  _id: rawId || `db_${Date.now()}_${Math.random()}`,
                  title: String(raw.title || raw.name || 'New Product'),
                  slug: rawSlug || rawId,
                  description: String(raw.description || ''),
                  category: String(raw.category || 'Audio'),
                  brand: String(raw.brand || 'ShopNexus Official'),
                  price: priceNum,
                  discountPrice: discNum,
                  stock: raw.stock !== undefined ? Number(raw.stock) : 20,
                  images: rawImages,
                  vendorName: (raw.vendorName as string) || 'ShopNexus Official',
                  isFlashSale: Boolean(raw.isFlashSale),
                  averageRating: Number(raw.averageRating) || 4.8,
                  totalReviews: Number(raw.totalReviews) || 10,
                  tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : ['popular'],
                });
              }
            });

            set({
              products: updated,
              lastFetched: now,
              isInitialized: true,
            });

            // Automatically sync live stocks with persisted wishlist store
            try {
              const wishlistState = useWishlistStore.getState();
              if (wishlistState.items.length > 0) {
                updated.forEach((p) => {
                  wishlistState.updateStock(p._id || p.slug || p.title, p.stock);
                });
              }
            } catch {}
          }
        } catch (e) {
          console.error('SWR fetchProducts error:', e);
        }
      },

      updateProductStock: (idOrSlug, newStock) => {
        const decoded = decodeURIComponent(idOrSlug).toLowerCase().trim();
        const updated = get().products.map((p) => {
          const match =
            p._id.toLowerCase() === decoded ||
            (p.slug && p.slug.toLowerCase() === decoded) ||
            p.title.toLowerCase().trim() === decoded;
          return match ? { ...p, stock: newStock } : p;
        });
        set({ products: updated });

        // Update wishlist store immediately
        try {
          useWishlistStore.getState().updateStock(idOrSlug, newStock);
        } catch {}
      },

      removeProduct: (idOrSlug) => {
        const decoded = decodeURIComponent(idOrSlug).toLowerCase().trim();
        const filtered = get().products.filter((p) => {
          const match =
            p._id.toLowerCase() === decoded ||
            (p.slug && p.slug.toLowerCase() === decoded) ||
            p.title.toLowerCase().trim() === decoded;
          return !match;
        });
        set({ products: filtered });
      },

      upsertProduct: (product) => {
        const current = get().products;
        const index = current.findIndex(
          (p) =>
            (p._id && product._id && p._id.toLowerCase() === product._id.toLowerCase()) ||
            (p.slug && product.slug && p.slug.toLowerCase() === product.slug.toLowerCase()) ||
            p.title.toLowerCase().trim() === product.title.toLowerCase().trim()
        );

        if (index >= 0) {
          const next = [...current];
          next[index] = { ...next[index], ...product };
          set({ products: next });
        } else {
          set({ products: [product, ...current] });
        }
      },

      // --- Filter State & Actions ---
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 150000,
      minRating: 0,
      sortBy: 'newest',
      isFlashSale: false,
      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      setBrand: (brand) => set({ brand }),
      setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
      setMinRating: (minRating) => set({ minRating }),
      setSortBy: (sortBy) => set({ sortBy }),
      setIsFlashSale: (isFlashSale) => set({ isFlashSale }),
      resetFilters: () =>
        set({
          search: '',
          category: '',
          brand: '',
          minPrice: 0,
          maxPrice: 150000,
          minRating: 0,
          sortBy: 'newest',
          isFlashSale: false,
        }),
    }),
    {
      name: 'shopnexus-products-cache',
      storage: createJSONStorage(() => safeLocalStorage),
      // Persist only lightweight essential fields to guarantee 0% chance of QuotaExceededError
      partialize: (state) => ({
        products: state.products.slice(0, 80).map((p) => ({
          _id: p._id,
          slug: p.slug,
          title: p.title,
          price: p.price,
          discountPrice: p.discountPrice,
          stock: p.stock,
          category: p.category,
          brand: p.brand,
          isFlashSale: p.isFlashSale,
          vendorName: p.vendorName,
          averageRating: p.averageRating,
          totalReviews: p.totalReviews,
          // Exclude base64 strings if any, keep only safe short URLs
          images: (p.images || []).filter((img) => typeof img === 'string' && img.length < 500).slice(0, 2),
        })),
        lastFetched: state.lastFetched,
      }),
    }
  )
);
