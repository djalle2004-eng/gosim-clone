import { Request, Response } from 'express';
import prisma from '../../lib/db';
import { getStripeClient } from '../../services/stripe.service';
import { provisionESim } from '../../services/esim-provider.service';

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { items, promoCode, currency = 'DZD' } = req.body;
    const userId = (req as any).user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // 1. Verify prices securely from DB
    for (const item of items) {
      const plan = await prisma.eSimPlan.findUnique({
        where: { id: item.planId },
      });
      if (!plan) throw new Error(`Plan ${item.planId} not found`);

      // Determine price based on currency
      const unitPrice = currency === 'DZD' ? (plan.priceDZD || plan.price * 150) : plan.price;
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        planId: plan.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });
    }

    // Apply promo code logic (mocked for now, can be expanded)
    let discount = 0;
    if (promoCode === 'GOSIM10') {
      discount = totalAmount * 0.1; // 10% discount
      totalAmount -= discount;
    }

    // 2. Create PENDING Order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        totalAmount: totalAmount,
        currency: currency,
        paymentMethod: 'CARD',
        notes: promoCode ? `Promo Code Applied: ${promoCode}` : null,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    // 3. Create Stripe PaymentIntent
    // Stripe expects amount in smallest currency unit (cents for USD, centimes for DZD)
    const amountInSmallestUnit = Math.round(totalAmount * 100);
    const stripe = await getStripeClient();

    // We only create an intent if the amount > 0
    let clientSecret = null;
    if (amountInSmallestUnit > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInSmallestUnit,
        currency: currency.toLowerCase(),
        metadata: { orderId: order.id, userId: userId },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: paymentIntent.id },
      });

      clientSecret = paymentIntent.client_secret;
    }

    return res.json({
      clientSecret,
      orderId: order.id,
      totalAmount,
      currency,
      discount,
    });
  } catch (err: any) {
    console.error('Checkout CreateIntent Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Error' });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { orderItems: { include: { plan: true } } },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'PAID')
      return res.json({ message: 'Order already paid', order });

    // In a real app with Webhooks, the webhook usually handles this.
    // However, for local payment methods like CIB, we might confirm manually.
    // Let's assume this endpoint is called after successful CIB payment or free orders

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paymentMethod: paymentMethod || order.paymentMethod,
      },
    });

    // Provision eSIMs
    for (const item of order.orderItems) {
      for (let i = 0; i < item.quantity; i++) {
        const esimData = await provisionESim(
          item.plan.providerId || '2sky_mock_id'
        );
        await prisma.eSim.create({
          data: {
            orderItemId: item.id,
            userId: userId,
            iccid: esimData.iccid,
            qrCode: esimData.qrCode,
            activationCode: esimData.activationCode,
            status: 'ACTIVE',
            dataTotal: item.plan.dataAmount,
          },
        });
      }
    }

    return res.json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error('Checkout Confirm Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Error' });
  }
};
