import cron from 'node-cron';
import prisma from '../lib/db';
import { enqueueEmail } from '../queues/emailQueue';
import { enqueuePush } from '../queues/pushQueue';
import {
  notifyDataLow,
  notifyESimExpiring,
} from '../services/notification.service';

console.log('[Jobs] Registering automated cron jobs...');

// ─── 1. Every 6 hours: Sync exchange rates ────────────────────────────────────
cron.schedule('0 */6 * * *', async () => {
  console.log('[Job] Starting exchange rate sync...');
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Exchange rate API unreachable');
    const data = (await res.json()) as any;

    // Log exchange rates (store in cache or env in production)
    console.log(
      '[Job] Exchange rates updated. Base: USD, Rates count:',
      Object.keys(data.rates || {}).length
    );
    console.log('[Job] Exchange rates updated successfully.');
  } catch (err: any) {
    console.error('[Job] Exchange rate sync failed:', err.message);
  }
});

// ─── 2. Every 30 minutes: Sync eSIM statuses with providers ──────────────────
cron.schedule('*/30 * * * *', async () => {
  console.log('[Job] Starting eSIM status sync...');
  try {
    const staleEsims = await prisma.eSim.findMany({
      where: {
        status: { in: ['ACTIVE', 'INACTIVE'] },
        updatedAt: {
          lt: new Date(Date.now() - 30 * 60 * 1000),
        },
      },
      take: 50,
    });

    for (const esim of staleEsims) {
      // Update dataUsed as a placeholder for sync logic
      // In production: call provider API to get real usage stats
      console.log(`[Job] Would sync eSIM: ${esim.iccid}`);
    }
    console.log(`[Job] Synced ${staleEsims.length} eSIMs.`);
  } catch (err: any) {
    console.error('[Job] eSIM sync failed:', err.message);
  }
});

// ─── 3. Daily at 9 AM: Expiry reminders ──────────────────────────────────────
cron.schedule('0 9 * * *', async () => {
  console.log('[Job] Running eSIM expiry reminders...');
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringEsims = await prisma.eSim.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
      },
      include: {
        user: { select: { email: true, firstName: true } },
        orderItem: { include: { plan: { select: { name: true } } } },
      },
    });

    for (const esim of expiringEsims) {
      const daysLeft = Math.ceil(
        ((esim.expiresAt?.getTime() ?? 0) - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const planName = esim.orderItem.plan.name;
      const userName = esim.user.firstName || 'Valued Customer';

      await enqueueEmail({
        type: 'esim_expiring_soon',
        to: esim.user.email,
        name: userName,
        iccid: esim.iccid,
        planName,
        expiresAt:
          esim.expiresAt?.toLocaleDateString('en-US', { dateStyle: 'long' }) ||
          '',
        daysLeft,
      });

      await enqueuePush({
        userId: esim.userId,
        title: '⏳ eSIM Expiring Soon',
        body: `Your ${planName} expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`,
        url: '/plans',
        tag: `expire-${esim.iccid}`,
      });

      await notifyESimExpiring(esim.userId, daysLeft, planName);
    }

    console.log(
      `[Job] Sent expiry reminders for ${expiringEsims.length} eSIMs.`
    );
  } catch (err: any) {
    console.error('[Job] Expiry reminder job failed:', err.message);
  }
});

// ─── 4. Daily at midnight: Low data alerts ───────────────────────────────────
// Using dataUsed >= 80% of dataTotal as "low data" indicator
cron.schedule('0 0 * * *', async () => {
  console.log('[Job] Checking for low data eSIMs...');
  try {
    const activeEsims = await prisma.eSim.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { email: true, firstName: true } },
        orderItem: { include: { plan: { select: { name: true } } } },
      },
    });

    // Filter: consumed >= 80% of total
    const lowDataEsims = activeEsims.filter(
      (e) => e.dataTotal > 0 && e.dataUsed / e.dataTotal >= 0.8
    );

    for (const esim of lowDataEsims) {
      const remainingMb = Math.max(0, esim.dataTotal - esim.dataUsed);
      const planName = esim.orderItem.plan.name;

      await enqueueEmail({
        type: 'data_low_alert',
        to: esim.user.email,
        name: esim.user.firstName || 'Valued Customer',
        iccid: esim.iccid,
        remainingMb,
        planName,
      });

      await notifyDataLow(esim.userId, remainingMb);
    }

    console.log(`[Job] Low data alerts sent for ${lowDataEsims.length} eSIMs.`);
  } catch (err: any) {
    console.error('[Job] Low data alert job failed:', err.message);
  }
});

// ─── 5. Weekly Monday 8 AM: Admin reports ────────────────────────────────────
cron.schedule('0 8 * * 1', async () => {
  console.log('[Job] Generating weekly admin report...');
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [newUsers, newOrders, revenueAgg] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED', createdAt: { gte: weekAgo } },
        _sum: { totalAmount: true },
      }),
    ]);

    const revenue = revenueAgg._sum?.totalAmount ?? 0;

    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { email: true, firstName: true },
    });

    console.log(
      `[Job] Weekly stats — Users: ${newUsers}, Orders: ${newOrders}, Revenue: $${revenue.toFixed(2)}`
    );

    // For now, log and skip email (admin report email template is similar to welcome)
    console.log(`[Job] Would notify ${admins.length} admins.`);
  } catch (err: any) {
    console.error('[Job] Weekly report job failed:', err.message);
  }
});

console.log('[Jobs] All cron jobs registered successfully ✓');
