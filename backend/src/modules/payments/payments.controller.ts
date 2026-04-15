import { Request, Response } from 'express';
import stripe from '../../services/stripe.service';
import * as paymentsService from './payments.service';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'fallback_whsec';

export const createIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.id;
    const clientSecret = await paymentsService.createPaymentIntent(orderId, userId);
    return res.json({ clientSecret });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.id;
    const url = await paymentsService.createCheckoutSession(orderId, userId);
    return res.json({ url });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // req.body is a raw Buffer because of express.raw injected in index.ts specifically for this route!
    event = stripe.webhooks.constructEvent(req.body, sig as string, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature mismatch:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        if (paymentIntent.metadata.orderId) {
          await paymentsService.handleSuccessfulPayment(paymentIntent.metadata.orderId, paymentIntent.id);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as any;
        if (failedIntent.metadata.orderId) {
          await paymentsService.handleFailedPayment(failedIntent.metadata.orderId);
        }
        break;

      case 'checkout.session.completed':
        const session = event.data.object as any;
        if (session.metadata.orderId && session.payment_status === 'paid') {
          // checkout session actually spins up a payment intent under the hood
          await paymentsService.handleSuccessfulPayment(session.metadata.orderId, session.payment_intent);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing logic error:', err);
    res.status(500).end(); // Do not return payload on 500 inside webhooks to avoid Stripe retries locking
  }
};
