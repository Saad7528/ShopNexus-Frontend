import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'stock_alert' | 'order_update' | 'promo';
  productId?: string;
  oldPrice?: number;
  newPrice?: number;
  discountPercent?: number;
  imageUrl?: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  isOpen: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, '_id' | 'createdAt' | 'isRead'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      notifications: [
        {
          _id: 'notif-1',
          title: '🔥 15% Price Drop Alert!',
          message: 'Sony WH-1000XM5 Noise-Canceling Headphones just dropped from $399.99 to $339.99!',
          type: 'price_drop',
          productId: 'prod-101',
          oldPrice: 399.99,
          newPrice: 339.99,
          discountPercent: 15,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150',
          linkUrl: '/products/prod-101',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          _id: 'notif-2',
          title: '⚡ Flash Deal Live!',
          message: 'Exclusive weekend tech discount code "NEXUS20" is now active for extra 20% off.',
          type: 'promo',
          imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150',
          linkUrl: '/flash-sales',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
      ],
      unreadCount: 2,
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      markAsRead: (id: string) => {
        const updated = get().notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        );
        const unread = updated.filter((n) => !n.isRead).length;
        set({ notifications: updated, unreadCount: unread });
      },
      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
        set({ notifications: updated, unreadCount: 0 });
      },
      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          _id: `notif-${Date.now()}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        const updated = [newNotif, ...get().notifications];
        set({ notifications: updated, unreadCount: get().unreadCount + 1 });
      },
    }),
    {
      name: 'shopnexus-notifications-storage',
    }
  )
);
