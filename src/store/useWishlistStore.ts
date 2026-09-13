import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IWishlistItem {
  id: string;
  productId?: string;
  slug?: string;
  name: string;
  title?: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
  stock?: number;
}

interface WishlistState {
  items: IWishlistItem[];
  toggleWishlist: (item: IWishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateStock: (queryId: string, newStock: number) => void;
  isInWishlist: (queryId: string) => boolean;
  clearWishlist: () => void;
}

const normalize = (str?: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const matchesItem = (item: IWishlistItem, query: string): boolean => {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  const normQ = normalize(query);

  if (!normQ) return false;

  // 1. Direct exact or substring matches
  if (
    (item.id && item.id.toLowerCase() === q) ||
    (item.productId && item.productId.toLowerCase() === q) ||
    (item.slug && item.slug.toLowerCase() === q) ||
    (item.name && item.name.toLowerCase() === q) ||
    (item.title && item.title.toLowerCase() === q)
  ) {
    return true;
  }

  // 2. Normalized alphanumeric matches (resolves slug vs title vs ObjectId differences)
  const normId = normalize(item.id);
  const normProductId = normalize(item.productId);
  const normSlug = normalize(item.slug);
  const normName = normalize(item.name);
  const normTitle = normalize(item.title);

  return Boolean(
    (normId && (normId === normQ || normId.includes(normQ) || normQ.includes(normId))) ||
    (normProductId && (normProductId === normQ || normProductId.includes(normQ) || normQ.includes(normProductId))) ||
    (normSlug && (normSlug === normQ || normSlug.includes(normQ) || normQ.includes(normSlug))) ||
    (normName && (normName === normQ || normName.includes(normQ) || normQ.includes(normName))) ||
    (normTitle && (normTitle === normQ || normTitle.includes(normQ) || normQ.includes(normTitle)))
  );
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'prod-001',
          productId: 'prod-001',
          slug: 'sony-wh-1000xm5-wireless-anc',
          name: 'Nexus Pro Wireless ANC Headphones',
          title: 'Nexus Pro Wireless ANC Headphones',
          price: 34500,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          category: 'Audio',
          inStock: true,
          stock: 12,
        },
        {
          id: 'prod-002',
          productId: 'prod-002',
          slug: 'apple-watch-ultra-2-49mm-titanium',
          name: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
          title: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
          price: 79900,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          category: 'Wearables',
          inStock: true,
          stock: 4,
        },
      ],
      toggleWishlist: (item) => {
        const { items } = get();
        const exists = items.some(
          (i) =>
            i.id === item.id ||
            matchesItem(i, item.id) ||
            (item.productId && matchesItem(i, item.productId)) ||
            (item.slug && matchesItem(i, item.slug)) ||
            (item.name && matchesItem(i, item.name)) ||
            (item.title && matchesItem(i, item.title))
        );
        if (exists) {
          set({
            items: items.filter(
              (i) =>
                !(
                  i.id === item.id ||
                  matchesItem(i, item.id) ||
                  (item.productId && matchesItem(i, item.productId)) ||
                  (item.slug && matchesItem(i, item.slug)) ||
                  (item.name && matchesItem(i, item.name)) ||
                  (item.title && matchesItem(i, item.title))
                )
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                productId: item.productId || item.id,
                slug: item.slug || item.id,
                name: item.name || item.title || '',
                title: item.title || item.name || '',
              },
            ],
          });
        }
      },
      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter((item) => !matchesItem(item, id)),
        })),
      updateStock: (queryId, newStock) => {
        if (!queryId) return;
        set((state) => ({
          items: state.items.map((item) => {
            if (matchesItem(item, queryId)) {
              return {
                ...item,
                stock: newStock,
                inStock: newStock > 0,
              };
            }
            return item;
          }),
        }));
      },
      isInWishlist: (queryId) => {
        if (!queryId) return false;
        return get().items.some((item) => matchesItem(item, queryId));
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'shopnexus-wishlist-storage',
    }
  )
);
