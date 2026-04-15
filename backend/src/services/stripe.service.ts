import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';

// Stripe typescript SDK initialized
const stripe = new Stripe(secret, {
  apiVersion: '2023-10-16', // Ensure stable API ver
});

export default stripe;
