import prisma from '../../lib/db';
import stripe from '../../services/stripe.service';
import { deactivateESim } from '../../services/esim-provider.service';

export const createOrder = async (
  userId: string,
  planId: string,
  quantity: number,
  currency: any,
  price: number
) => {
  const plan = await prisma.eSimPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('Plan not found');

  // Set up Order + OrderItem atomic transaction
  const order = await prisma.order.create({
    data: {
      userId,
      status: 'PENDING',
      totalAmount: price * quantity,
      currency: currency,
      paymentMethod: 'CARD', // default
      orderItems: {
        create: {
          planId: plan.id,
          quantity,
          unitPrice: price,
          totalPrice: price * quantity,
        },
      },
    },
    include: { orderItems: true },
  });

  return order;
};

export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: { plan: { include: { country: true } }, assignedESims: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (orderId: string, userId: string) => {
  return await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      orderItems: {
        include: { plan: { include: { country: true } }, assignedESims: true },
      },
      payments: true,
    },
  });
};

export const cancelOrder = async (orderId: string, userId: string) => {
  const order = await getOrderById(orderId, userId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'PENDING')
    throw new Error('Can only cancel PENDING orders');

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: 'FAILED' }, // Represents cancelled
  });
};

export const refundOrder = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: true,
      orderItems: { include: { assignedESims: true } },
    },
  });

  if (!order || order.status !== 'PAID')
    throw new Error('Invalid order for refund');

  const esims = order.orderItems.flatMap((i) => i.assignedESims);

  // Rule: Check if eSims are completely unused
  for (const esim of esims) {
    if (esim.dataUsed > 0) {
      throw new Error(
        `Refund aborted: ICCID ${esim.iccid} has already consumed ${esim.dataUsed}MB data`
      );
    }
  }

  const payment = order.payments.find(
    (p) => p.status === 'COMPLETED' && p.provider === 'STRIPE'
  );
  if (!payment || !payment.providerTransactionId) {
    throw new Error('No valid Stripe payment found to refund');
  }

  // 1. Stripe Refund
  const refund = await stripe.refunds.create({
    payment_intent: payment.providerTransactionId,
  });

  if (refund.status === 'succeeded' || refund.status === 'pending') {
    // 2. Deactivate Telecom SIM profiles
    await Promise.all(esims.map((e) => deactivateESim(e.iccid)));

    // 3. Update DB state natively
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'REFUNDED' },
    });

    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: { status: 'REFUNDED' },
    });

    await prisma.eSim.updateMany({
      where: { id: { in: esims.map((e) => e.id) } },
      data: { status: 'DELETED' },
    });

    return true;
  }

  throw new Error('Stripe refund failed');
};
