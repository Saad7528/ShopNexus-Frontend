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
      items: [],
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
