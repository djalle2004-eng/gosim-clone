import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length
  }),
  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    return { 
      notifications: updated, 
      unreadCount: updated.filter(n => !n.isRead).length 
    };
  }),
  markAllRead: () => set((state) => {
    const updated = state.notifications.map(n => ({ ...n, isRead: true }));
    return { notifications: updated, unreadCount: 0 };
  })
}));
