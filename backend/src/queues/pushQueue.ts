import { Queue, Worker, Job } from 'bullmq';
import { redisConnection, DEFAULT_JOB_OPTIONS } from './queue.config';
import webpush from 'web-push';
import prisma from '../lib/db';

// ─── VAPID Setup ──────────────────────────────────────────────────────────────

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.SUPPORT_EMAIL || 'support@gosim.dz'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// ─── Job Payload Types ───────────────────────────────────────────────────────

export interface PushNotificationJob {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

// ─── Queue Instance ───────────────────────────────────────────────────────────

export const pushQueue = new Queue<PushNotificationJob>('push_notifications', {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

// ─── Worker ───────────────────────────────────────────────────────────────────

export const pushWorker = new Worker<PushNotificationJob>(
  'push_notifications',
  async (job: Job<PushNotificationJob>) => {
    const { userId, title, body, icon, url, tag } = job.data;

    // Get all push subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/icon-192x192.png',
      url: url || '/',
      tag,
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSub = sub.subscription as any;
        await webpush.sendNotification(pushSub, payload);
      })
    );

    const failed = results.filter((r) => r.status === 'rejected').length;
    console.log(`[pushQueue] Sent ${subscriptions.length - failed}/${subscriptions.length} notifications to user ${userId}`);
  },
  { connection: redisConnection, concurrency: 5 }
);

pushWorker.on('failed', (job, err) => {
  console.error(`[pushQueue] Job ${job?.id} failed:`, err.message);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const enqueuePush = (data: PushNotificationJob) =>
  pushQueue.add('push', data, DEFAULT_JOB_OPTIONS);

// ─── Common Push Notifications ────────────────────────────────────────────────

export const pushOrderConfirmed = (userId: string, orderId: string) =>
  enqueuePush({
    userId,
    title: '✅ Order Confirmed!',
    body: 'Your eSIM is being activated. You\'ll receive it shortly.',
    url: `/dashboard/orders`,
    tag: `order-${orderId}`,
  });

export const pushDataLow = (userId: string, remaining: number) =>
  enqueuePush({
    userId,
    title: '⚠️ Low Data Warning',
    body: `Only ${remaining}MB left on your eSIM. Top up now!`,
    url: `/dashboard/esims`,
    tag: 'data-low',
  });

export const pushESimExpiring = (userId: string, daysLeft: number) =>
  enqueuePush({
    userId,
    title: '⏳ eSIM Expiring Soon',
    body: `Your eSIM expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Renew now!`,
    url: `/plans`,
    tag: 'esim-expiring',
  });
