import { ConnectionOptions } from 'bullmq';

/**
 * Shared Redis connection options for all BullMQ queues.
 * Uses the same REDIS_URL as the rest of the app.
 */
export const redisConnection: ConnectionOptions = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 5000, // 5s, 25s, 125s
  },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};
