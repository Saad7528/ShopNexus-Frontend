import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING';
  status: 'PLACED' | 'CONFIRMED' | 'PACKAGING' | 'SHIPPED' | 'DELIVERED';
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  shippingAddress: string;
}

const INITIAL_DEMO_ORDERS: UserOrder[] = [
  {
    id: 'ord_demo_1',
    orderNumber: 'NX-ORD-9021',
    date: 'Aug 24, 2026',
    items: [
      {
        id: 'p1',
        name: 'Sony WH-1000XM5 Wireless ANC Headphones',
        price: 32500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      },
      {
        id: 'p8',
        name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
        price: 17900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      },
    ],
    subtotal: 50400,
    shipping: 60,
    tax: 2520,
    total: 52980,
    paymentMethod: 'bKash Instant (TRX-BK-889021)',
    paymentStatus: 'PAID',
    status: 'SHIPPED',
    trackingNumber: 'TRK-NX-88219',
    carrier: 'Pathao Courier Express',
    estimatedDelivery: 'Today by 6:00 PM',
    shippingAddress: 'House 42, Road 11, Banani Block-D, Dhaka-1213, Bangladesh',
  },
  {
    id: 'ord_demo_2',
    orderNumber: 'NX-ORD-8814',
    date: 'Aug 20, 2026',
    items: [
      {
        id: 'p19',
        name: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
        price: 79900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      },
    ],
    subtotal: 79900,
    shipping: 0,
    tax: 3995,
    total: 83895,
    paymentMethod: 'Nagad Instant (TRX-NG-770142)',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    trackingNumber: 'TRK-NX-77402',
    carrier: 'Steadfast Logistics',
    estimatedDelivery: 'Delivered',
    shippingAddress: 'House 42, Road 11, Banani Block-D, Dhaka-1213, Bangladesh',
  },
];

interface OrderStoreState {
  orders: UserOrder[];
  addOrder: (order: UserOrder) => void;
  getOrderById: (id: string) => UserOrder | undefined;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_DEMO_ORDERS,

      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
        })),

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id || o.orderNumber === id);
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'shopnexus-user-orders-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
