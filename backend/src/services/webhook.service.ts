import crypto from 'crypto';
import prisma from '../lib/db';
import axios from 'axios';

export const triggerWebhook = async (userId: string, event: string, payload: any) => {
  // Find all active webhooks for this user
  const allWebhooks = await prisma.webhookEndpoint.findMany({
    where: {
      userId,
      isActive: true,
    }
  });

  // Filter in memory since events is a Json array
  const webhooks = allWebhooks.filter(wh => {
    if (wh.events && Array.isArray(wh.events)) {
      return (wh.events as string[]).includes(event);
    }
    return false;
  });

  if (webhooks.length === 0) return;

  for (const webhook of webhooks) {
    // Create delivery record
    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event,
        payload,
        status: 'PENDING',
        attempts: 0,
        nextRetry: new Date(),
      }
    });

    // Fire asynchronously
    processDelivery(delivery.id).catch(console.error);
  }
};

const RETRY_INTERVALS = [0, 60 * 1000, 5 * 60 * 1000, 30 * 60 * 1000]; // 0s, 1m, 5m, 30m

export const processDelivery = async (deliveryId: string) => {
  const delivery = await prisma.webhookDelivery.findUnique({
    where: { id: deliveryId },
    include: { webhook: true }
  });

  if (!delivery || delivery.status === 'SUCCESS' || delivery.attempts >= RETRY_INTERVALS.length) return;

  const payloadStr = JSON.stringify(delivery.payload);
  const signature = crypto
    .createHmac('sha256', delivery.webhook.secret)
    .update(payloadStr)
    .digest('hex');

  const attemptStartTime = Date.now();
  let status: 'SUCCESS' | 'FAILED' = 'FAILED';
  let responseData: any = null;

  try {
    const res = await axios.post(delivery.webhook.url, delivery.payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-GoSIM-Event': delivery.event,
        'X-GoSIM-Delivery': delivery.id
      },
      timeout: 10000 // 10s timeout
    });

    status = res.status >= 200 && res.status < 300 ? 'SUCCESS' : 'FAILED';
    responseData = { status: res.status, data: res.data };
  } catch (err: any) {
    status = 'FAILED';
    responseData = { error: err.message };
  }

  const newAttempts = delivery.attempts + 1;
  let nextRetry = null;

  if (status === 'FAILED' && newAttempts < RETRY_INTERVALS.length) {
    nextRetry = new Date(Date.now() + RETRY_INTERVALS[newAttempts]);
  }

  await prisma.webhookDelivery.update({
    where: { id: delivery.id },
    data: {
      status: nextRetry ? 'PENDING' : status,
      attempts: newAttempts,
      nextRetry,
      response: responseData,
      updatedAt: new Date()
    }
  });
};

export const runWebhookCron = async () => {
  // Find all pending deliveries that are due
  const pendingDeliveries = await prisma.webhookDelivery.findMany({
    where: {
      status: 'PENDING',
      nextRetry: { lte: new Date() }
    },
    take: 50 // batch size
  });

  for (const delivery of pendingDeliveries) {
    await processDelivery(delivery.id);
  }
};
