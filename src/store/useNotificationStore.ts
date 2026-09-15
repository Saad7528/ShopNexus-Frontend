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
  clearAllNotifications: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, '_id' | 'createdAt' | 'isRead'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      notifications: [],
      unreadCount: 0,
      openDrawer: () => {
        // Automatically mark all as read upon opening so badge disappears
        const currentNotifications = get().notifications;
        const updated = currentNotifications.map((n) => ({ ...n, isRead: true }));
        set({ isOpen: true, notifications: updated, unreadCount: 0 });
      },
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => {
        const nextIsOpen = !get().isOpen;
        if (nextIsOpen) {
          const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
          set({ isOpen: true, notifications: updated, unreadCount: 0 });
        } else {
          set({ isOpen: false });
        }
      },
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
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      removeNotification: (id: string) => {
        const updated = get().notifications.filter((n) => n._id !== id);
        const unread = updated.filter((n) => !n.isRead).length;
        set({ notifications: updated, unreadCount: unread });
      },
      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          _id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
