import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItemType {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  vendorName: string;
  variant?: string;
}

export type ShippingMethod = 'standard' | 'express';

export const FREE_SHIPPING_THRESHOLD = 150;

interface CartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingProgress: number; // 0 - 100
  amountUntilFreeShipping: number;
}

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  appliedCoupon: string | null;
  discount: number;
  shippingMethod: ShippingMethod;
  guestId: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: CartItemType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  applyCoupon: (code: string, discountAmount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
  getTotals: () => CartTotals;
}

const generateGuestId = (): string => {
  return 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

// 🔄 Real-time Background Sync to MongoDB Atlas for Live Abandoned Cart Telemetry
let syncTimeout: NodeJS.Timeout | null = null;
const syncCartWithServer = (
  items: CartItemType[],
  appliedCoupon: string | null,
  discount: number,
  guestId: string
) => {
  if (typeof window === 'undefined') return;

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      let token: string | null = null;
      let customerName = 'Guest Shopper';
      let customerEmail = 'shopper@tempmail.io';
      let customerPhone = '+880 1700-000000';

      try {
        const authRaw = localStorage.getItem('shopnexus-auth-storage');
        if (authRaw) {
          const parsed = JSON.parse(authRaw);
          if (parsed?.state?.token) {
            token = parsed.state.token;
          }
          if (parsed?.state?.user) {
            customerName = parsed.state.user.name || customerName;
            customerEmail = parsed.state.user.email || customerEmail;
            customerPhone = parsed.state.user.phoneNumber || customerPhone;
          }
        }
      } catch (_e) {}

      await fetch(`${apiUrl}/cart/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          guestId,
          items,
          appliedCoupon,
          discount,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });
    } catch (_err) {
      // Graceful offline fallback
    }
  }, 400);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      discount: 0,
      shippingMethod: 'standard',
      guestId: generateGuestId(),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.productId === newItem.productId);
          let newItems: CartItemType[];
          if (existingIndex > -1) {
            const updated = [...state.items];
            const currentItem = updated[existingIndex];
            const newQty = currentItem.quantity + newItem.quantity;
            updated[existingIndex] = {
              ...currentItem,
              quantity: Math.min(newQty, currentItem.stock || 99),
            };
            newItems = updated;
          } else {
            newItems = [...state.items, newItem];
          }
          syncCartWithServer(newItems, state.appliedCoupon, state.discount, state.guestId);
          return { items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          syncCartWithServer(newItems, state.appliedCoupon, state.discount, state.guestId);
          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          let newItems: CartItemType[];
          if (quantity <= 0) {
            newItems = state.items.filter((item) => item.productId !== productId);
          } else {
            newItems = state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: Math.min(quantity, item.stock || 99) } : item
            );
          }
          syncCartWithServer(newItems, state.appliedCoupon, state.discount, state.guestId);
          return { items: newItems };
        });
      },

      setShippingMethod: (method) => set({ shippingMethod: method }),

      applyCoupon: (code, discountAmount) => {
        set((state) => {
          syncCartWithServer(state.items, code, discountAmount, state.guestId);
          return { appliedCoupon: code, discount: discountAmount };
        });
      },

      removeCoupon: () => {
        set((state) => {
          syncCartWithServer(state.items, null, 0, state.guestId);
          return { appliedCoupon: null, discount: 0 };
        });
      },

      clearCart: () => {
        set((state) => {
          syncCartWithServer([], null, 0, state.guestId);
          return { items: [], appliedCoupon: null, discount: 0 };
        });
      },

      syncWithServer: async () => {
        const { items, appliedCoupon, discount, guestId } = get();
        syncCartWithServer(items, appliedCoupon, discount, guestId);
      },

      getTotals: (): CartTotals => {
        const { items, discount, shippingMethod } = get();
        const subtotal = Math.round(
          items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
        );
        const itemCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

        // Tiered shipping in ৳ BDT: Inside Dhaka 60, Outside 120
        let shippingFee = 0;
        if (subtotal > 0) {
          if (shippingMethod === 'express') {
            shippingFee = 120;
          } else {
            shippingFee = subtotal >= 50000 ? 0 : 60;
          }
        }

        const tax = Math.round(subtotal * 0.05); // 5% standard VAT
        const total = Math.max(0, subtotal - (Number(discount) || 0) + shippingFee + tax);

        const amountUntilFreeShipping = Math.max(0, 50000 - subtotal);
        const freeShippingProgress = Math.min(
          100,
          Math.round((subtotal / 50000) * 100)
        );

        return {
          subtotal,
          discount,
          shippingFee,
          tax,
          total,
          itemCount,
          freeShippingProgress,
          amountUntilFreeShipping,
        };
      },
    }),
    {
      name: 'shopnexus-persistent-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        discount: state.discount,
        shippingMethod: state.shippingMethod,
        guestId: state.guestId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.items && state.items.length > 0) {
          syncCartWithServer(state.items, state.appliedCoupon, state.discount, state.guestId);
        }
      },
    }
  )
);

