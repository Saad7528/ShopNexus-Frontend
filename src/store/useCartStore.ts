import { create } from 'zustand';

export interface CartItemType {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  vendorName: string;
}

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  appliedCoupon: string | null;
  discount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: CartItemType) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string, discountAmount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; discount: number; tax: number; total: number; itemCount: number };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  appliedCoupon: null,
  discount: 0,

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (newItem) =>
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.productId === newItem.productId);
      if (existingIndex > -1) {
        const updated = [...state.items];
        const newQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex].quantity = Math.min(newQty, updated[existingIndex].stock);
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

  applyCoupon: (code, discountAmount) => set({ appliedCoupon: code, discount: discountAmount }),
  removeCoupon: () => set({ appliedCoupon: null, discount: 0 }),
  clearCart: () => set({ items: [], appliedCoupon: null, discount: 0 }),

  getTotals: () => {
    const { items, discount } = get();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat(Math.max(0, subtotal - discount + tax).toFixed(2));
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return { subtotal, discount, tax, total, itemCount };
  },
}));
