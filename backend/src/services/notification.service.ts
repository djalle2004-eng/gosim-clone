import prisma from '../lib/db';
import { NotificationCategory } from '@prisma/client';
import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

/**
 * Register the Socket.io server for real-time in-app notifications.
 */
export const registerSocketServer = (socketServer: SocketServer) => {
  io = socketServer;
  console.log('[NotificationService] Socket.io server registered.');
};

/**
 * Create an in-app notification and push it via WebSocket if the user is online.
 */
export const createNotification = async (params: {
  userId: string;
  title: string;
  body: string;
  category?: NotificationCategory;
  url?: string;
}) => {
  const { userId, title, body, category = 'SYSTEM', url } = params;

  const notification = await prisma.inAppNotification.create({
    data: { userId, title, body, category, url },
  });

  // Push real-time to connected clients
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', {
      id: notification.id,
      title,
      body,
      category,
      url,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

/**
 * Get unread notifications count for a user.
 */
export const getUnreadCount = (userId: string) =>
  prisma.inAppNotification.count({ where: { userId, isRead: false } });

/**
 * Get paginated notifications for a user.
 */
export const getUserNotifications = (userId: string, page = 1, limit = 20) =>
  prisma.inAppNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

/**
 * Mark a single notification as read.
 */
export const markAsRead = (id: string, userId: string) =>
  prisma.inAppNotification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = (userId: string) =>
  prisma.inAppNotification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

// ─── Preset Notification Factories ───────────────────────────────────────────

export const notifyOrderConfirmed = (userId: string, orderId: string, planName: string) =>
  createNotification({
    userId,
    title: '✅ Order Confirmed',
    body: `Your order for ${planName} has been confirmed and is being processed.`,
    category: 'ORDER',
    url: `/dashboard/orders`,
  });

export const notifyESimActivated = (userId: string, country: string) =>
  createNotification({
    userId,
    title: '📱 eSIM Activated',
    body: `Your eSIM for ${country} is now active and ready to use.`,
    category: 'ESIM',
    url: `/dashboard/esims`,
  });

export const notifyDataLow = (userId: string, remainingMb: number) =>
  createNotification({
    userId,
    title: '⚠️ Low Data Warning',
    body: `Only ${remainingMb}MB remaining. Top up to stay connected.`,
    category: 'ESIM',
    url: `/dashboard/esims`,
  });

export const notifyESimExpiring = (userId: string, daysLeft: number, planName: string) =>
  createNotification({
    userId,
    title: '⏳ eSIM Expiring Soon',
    body: `Your ${planName} expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Renew now!`,
    category: 'ESIM',
    url: `/plans`,
  });

export const notifyPaymentFailed = (userId: string) =>
  createNotification({
    userId,
    title: '❌ Payment Failed',
    body: 'Your last payment attempt failed. Please check your payment method.',
    category: 'PAYMENT',
    url: `/dashboard/orders`,
  });
