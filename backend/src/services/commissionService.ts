import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommissionService {
  /**
   * Get all pending commissions
   */
  static async getPendingCommissions() {
    return prisma.referral.findMany({
      where: {
        isPaid: false,
        commissionAmount: { gt: 0 },
      },
      include: {
        referrer: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        order: { select: { id: true, totalAmount: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Process a payout via API (Mocked for Wise/PayPal)
   */
  static async processPayout(referralIds: string[], method: 'paypal' | 'wise') {
    // 1. Verify all exist and are unpaid
    const referrals = await prisma.referral.findMany({
      where: {
        id: { in: referralIds },
        isPaid: false,
      },
    });

    if (referrals.length === 0)
      throw new Error('No pending commissions found for the provided IDs.');

    // 2. Mock external API Call
    console.log(
      `[CommissionService] Processing payout via ${method.toUpperCase()} for ${referrals.length} commissions...`
    );
    const totalAmount = referrals.reduce(
      (sum, r) => sum + r.commissionAmount,
      0
    );
    console.log(`[CommissionService] Total Payout: $${totalAmount}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. Mark as paid
    await prisma.referral.updateMany({
      where: { id: { in: referralIds } },
      data: { isPaid: true },
    });

    // 4. Record wallet transactions if we were paying into internal wallet,
    // but here we are paying externally, so we just return success.

    return {
      success: true,
      paidCount: referrals.length,
      totalAmount,
      method,
      transactionId: `tx_${Math.random().toString(36).substring(7)}`,
    };
  }

  /**
   * Calculate automatic commission for an order
   */
  static async calculateCommission(
    orderId: string,
    referralCodeId: string,
    referrerId: string,
    referredUserId: string
  ) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    const code = await prisma.referralCode.findUnique({
      where: { id: referralCodeId },
    });

    if (!order || !code) return;

    // e.g., 10% commission
    const rate = code.commissionRate > 0 ? code.commissionRate : 10;
    const commissionAmount = (order.totalAmount * rate) / 100;

    await prisma.referral.create({
      data: {
        referralCodeId,
        referrerId,
        referredUserId,
        orderId,
        commissionAmount,
        isPaid: false,
      },
    });
  }
}
