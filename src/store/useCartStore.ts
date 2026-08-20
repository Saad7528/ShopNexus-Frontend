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
  freeShippingProgress: number; // 0 to 100%
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
  getTotals: () => CartTotals;
}

const generateGuestId = (): string => {
  return 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
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

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.productId === newItem.productId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const currentItem = updated[existingIndex];
            const newQty = currentItem.quantity + newItem.quantity;
            updated[existingIndex] = {
              ...currentItem,
              quantity: Math.min(newQty, currentItem.stock),
            };
            return { items: updated, isOpen: true };
          }
          return { items: [...state.items, newItem], isOpen: true };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
            ),
          };
        }),

      setShippingMethod: (method) => set({ shippingMethod: method }),

      applyCoupon: (code, discountAmount) => set({ appliedCoupon: code, discount: discountAmount }),
      removeCoupon: () => set({ appliedCoupon: null, discount: 0 }),
      clearCart: () => set({ items: [], appliedCoupon: null, discount: 0 }),

      getTotals: (): CartTotals => {
        const { items, discount, shippingMethod } = get();
        const subtotal = parseFloat(
          items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
        );
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

        // Tiered shipping calculations
        let shippingFee = 0;
        if (subtotal > 0) {
          if (shippingMethod === 'express') {
            shippingFee = 25.0;
          } else {
            shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15.0;
          }
        }

        const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% standard tax
        const total = parseFloat(
          Math.max(0, subtotal - discount + shippingFee + tax).toFixed(2)
        );

        const amountUntilFreeShipping = Math.max(0, parseFloat((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));
        const freeShippingProgress = Math.min(
          100,
          Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
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
    }
  )
);
