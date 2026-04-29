import { Queue, Worker, Job } from 'bullmq';
import { redisConnection, DEFAULT_JOB_OPTIONS } from './queue.config';

// ─── Job Payload Types ───────────────────────────────────────────────────────

export interface ESimProvisioningJob {
  orderId: string;
  planId: string;
  userId: string;
  provider: 'airalo' | 'esimgo' | 'mock';
}

export interface ESimTopupJob {
  iccid: string;
  packageId: string;
  orderId: string;
}

// ─── Queue Instance ───────────────────────────────────────────────────────────

export const provisioningQueue = new Queue<ESimProvisioningJob | ESimTopupJob>(
  'esim_provisioning',
  {
    connection: redisConnection,
    defaultJobOptions: {
      ...DEFAULT_JOB_OPTIONS,
      attempts: 5, // More retries for critical provisioning tasks
    },
  }
);

// ─── Worker ───────────────────────────────────────────────────────────────────

export const provisioningWorker = new Worker<ESimProvisioningJob | ESimTopupJob>(
  'esim_provisioning',
  async (job: Job<ESimProvisioningJob | ESimTopupJob>) => {
    console.log(`[provisioningQueue] Processing job ${job.id}:`, job.name);

    if (job.name === 'provision') {
      const data = job.data as ESimProvisioningJob;
      // Delegate to the provider-specific service
      // Dynamically import to avoid circular deps
      const { provisionESim } = await import('../services/esim-provider.service');
      await provisionESim(data.planId, 1);
    } else if (job.name === 'topup') {
      const data = job.data as ESimTopupJob;
      console.log(`[provisioningQueue] Topup for ICCID ${data.iccid}, package ${data.packageId}`);
      // Hook into the provider topup service here
    }
  },
  { connection: redisConnection, concurrency: 3 }
);

provisioningWorker.on('completed', (job) => {
  console.log(`[provisioningQueue] Job ${job.id} completed successfully.`);
});

provisioningWorker.on('failed', (job, err) => {
  console.error(`[provisioningQueue] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`, err.message);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const enqueueProvisioning = (data: ESimProvisioningJob) =>
  provisioningQueue.add('provision', data, DEFAULT_JOB_OPTIONS);

export const enqueueTopup = (data: ESimTopupJob) =>
  provisioningQueue.add('topup', data, DEFAULT_JOB_OPTIONS);
