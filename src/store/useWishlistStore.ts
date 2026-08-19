import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IWishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
}

interface WishlistState {
  items: IWishlistItem[];
  toggleWishlist: (item: IWishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'prod-001',
          name: 'Nexus Pro Wireless ANC Headphones',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          category: 'Audio',
          inStock: true,
        },
        {
          id: 'prod-002',
          name: 'Ultra Titanium Smartwatch Series 9',
          price: 399.00,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          category: 'Wearables',
          inStock: true,
        },
      ],
      toggleWishlist: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      isInWishlist: (id) => get().items.some((item) => item.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'shopnexus-wishlist-storage',
    }
  )
);
