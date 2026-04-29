import { Queue, Worker, Job } from 'bullmq';
import { redisConnection, DEFAULT_JOB_OPTIONS } from './queue.config';
import prisma from '../lib/db';
import axios from 'axios';
import crypto from 'crypto';

export interface WebhookQueueJob {
  webhookEndpointId: string;
  deliveryId: string;
  url: string;
  secret: string;
  event: string;
  payload: Record<string, unknown>;
  attemptNumber: number;
}

// ─── Queue Instance ───────────────────────────────────────────────────────────

export const webhookQueue = new Queue<WebhookQueueJob>('webhook_delivery', {
  connection: redisConnection,
  defaultJobOptions: {
    ...DEFAULT_JOB_OPTIONS,
    attempts: 4,
    backoff: { type: 'exponential', delay: 60_000 }, // 1m, 2m, 4m, 8m
  },
});

// ─── Worker ───────────────────────────────────────────────────────────────────

export const webhookWorker = new Worker<WebhookQueueJob>(
  'webhook_delivery',
  async (job: Job<WebhookQueueJob>) => {
    const { url, secret, event, payload, deliveryId } = job.data;

    const payloadStr = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadStr)
      .digest('hex');

    const startTime = Date.now();
    let statusCode = 0;
    let responseBody = '';
    let success = false;

    try {
      const res = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-GoSIM-Signature': `sha256=${signature}`,
          'X-GoSIM-Event': event,
          'X-GoSIM-Delivery': deliveryId,
        },
        timeout: 10_000,
      });
      statusCode = res.status;
      responseBody = JSON.stringify(res.data).slice(0, 500);
      success = res.status >= 200 && res.status < 300;
    } catch (err: any) {
      statusCode = err.response?.status || 0;
      responseBody = err.message;
      throw err; // BullMQ will handle retry
    } finally {
      const duration = Date.now() - startTime;
      // Update delivery record
      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: success ? 'SUCCESS' : 'FAILED',
          attempts: { increment: 1 },
          response: { statusCode, body: responseBody, duration },
          updatedAt: new Date(),
        },
      });
    }
  },
  { connection: redisConnection, concurrency: 10 }
);

webhookWorker.on('failed', (job, err) => {
  console.error(`[webhookQueue] Delivery ${job?.data.deliveryId} failed:`, err.message);
});

// ─── Helper ───────────────────────────────────────────────────────────────────

export const enqueueWebhookDelivery = (data: WebhookQueueJob, delayMs = 0) =>
  webhookQueue.add('deliver', data, { ...DEFAULT_JOB_OPTIONS, delay: delayMs });
