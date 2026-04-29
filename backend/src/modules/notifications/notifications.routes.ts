import { Router, Request, Response } from 'express';
import { verifyToken } from '../auth/auth.middleware';
import prisma from '../../lib/db';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../../services/notification.service';

const router = Router();

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/notifications
 * Get paginated notifications for the current user.
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  const [notifications, unreadCount, total] = await Promise.all([
    getUserNotifications(userId, page, limit),
    getUnreadCount(userId),
    prisma.inAppNotification.count({ where: { userId } }),
  ]);

  res.json({
    success: true,
    data: notifications,
    meta: { page, limit, total, unreadCount },
  });
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a specific notification as read.
 */
router.patch('/:id/read', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await markAsRead(req.params.id, userId);
  res.json({ success: true });
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
router.patch('/read-all', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { count } = await markAllAsRead(userId);
  res.json({ success: true, updated: count });
});

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification.
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.inAppNotification.deleteMany({
    where: { id: req.params.id, userId },
  });
  res.json({ success: true });
});

// ─── Push Subscriptions ───────────────────────────────────────────────────────

/**
 * POST /api/notifications/push/subscribe
 * Save a browser PushSubscription object.
 */
router.post('/push/subscribe', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { subscription } = req.body;

  if (!subscription?.endpoint) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid push subscription' });
  }

  await prisma.pushSubscription.create({
    data: {
      userId,
      subscription,
      userAgent: req.headers['user-agent'] ?? null,
    },
  });

  res.json({ success: true, message: 'Push subscription registered.' });
});

/**
 * DELETE /api/notifications/push/unsubscribe
 * Remove a push subscription.
 */
router.delete('/push/unsubscribe', async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { endpoint } = req.body;

  await prisma.pushSubscription.deleteMany({
    where: { userId },
  });

  res.json({ success: true });
});

/**
 * GET /api/notifications/vapid-public-key
 * Return the VAPID public key for the frontend to subscribe.
 */
router.get('/vapid-public-key', (req: Request, res: Response) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return res
      .status(503)
      .json({ success: false, error: 'Push notifications not configured.' });
  }
  res.json({ success: true, publicKey });
});

export default router;
