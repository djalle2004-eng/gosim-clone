import stripe from '../../services/stripe.service';
import { createCibCheckout } from '../../services/cib-payment.service';
import { provisionESim } from '../../services/esim-provider.service';
import prisma from '../../lib/db';
import { sendEmail } from '../../utils/mailer';

export const createPaymentIntent = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId }, include: { user: true } });
  if (!order) throw new Error('Order not found');
  if (order.status !== 'PENDING') throw new Error('Order is not PENDING');

  const amountInCents = Math.round(order.totalAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: order.currency.toLowerCase(),
    metadata: { orderId: order.id, userId: order.user.id },
    receipt_email: order.user.email,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: paymentIntent.id, paymentMethod: 'CARD' }
  });

  return paymentIntent.client_secret;
};

export const createCheckoutSession = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId }, include: { user: true, orderItems: { include: { plan: true } } } });
  if (!order) throw new Error('Order not found');

  const amountInCents = Math.round(order.totalAmount * 100);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order.orderItems.map(item => ({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: { name: `eSIM Plan: ${item.plan.name}` },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/checkout/cancel`,
    client_reference_id: order.id,
    metadata: { orderId: order.id, userId: order.user.id }
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id, paymentMethod: 'CARD' }
  });

  return session.url;
};

// Webhook handling function safely separated from Express scope
export const handleSuccessfulPayment = async (orderId: string, transactionId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { plan: true } }, user: true }
  });

  if (!order || order.status === 'PAID') return;

  // 1. Mark as PAID & generate payment record
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' }
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      userId: order.userId,
      amount: order.totalAmount,
      currency: order.currency,
      provider: 'STRIPE',
      providerTransactionId: transactionId,
      status: 'COMPLETED'
    }
  });

  // 2. Telecom Provisioning
  for (const item of order.orderItems) {
    for (let i = 0; i < item.quantity; i++) {
        // Ping Airalo simulator
        const provision = await provisionESim(item.plan.id);

        await prisma.eSim.create({
          data: {
            orderItemId: item.id,
            userId: order.userId,
            iccid: provision.iccid,
            qrCode: provision.qrCode,
            activationCode: provision.activationCode,
            status: 'INACTIVE',
            dataTotal: item.plan.dataAmount
          }
        });

        // 3. Send automated Email
        const messageHtml = `
          <h2>Your eSIM is Ready!</h2>
          <p>Plan: ${item.plan.name}</p>
          <p>Scan this QR code from your phone's cellular settings to activate.</p>
          <img src="${provision.qrCode}" alt="eSIM QR Code" />
          <p>ICCID: ${provision.iccid}</p>
        `;
        await sendEmail(order.user.email, 'Your GoSIM eSIM Installation', messageHtml);
    }
  }

  // 4. Create Notification
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: 'Payment Successful',
      message: `Your payment of ${order.totalAmount} ${order.currency} was processed successfully. Unpack your eSIM(s) in the dashboard!`,
      type: 'PAYMENT_SUCCESS'
    }
  });
};

export const handleFailedPayment = async (orderId: string) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'FAILED' }
  });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (order) {
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Payment Failed',
        message: 'Your recent transaction was declined. Please try another card.',
        type: 'PAYMENT_FAILED'
      }
    });
  }
};
