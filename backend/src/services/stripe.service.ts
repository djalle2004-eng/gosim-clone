import Stripe from 'stripe';
import { getStripeConfig } from '../modules/settings/config.service';
export { getStripeConfig };

/**
 * Get a dynamic Stripe client based on current database settings.
 * If no key is set in DB, it falls back to process.env.
 */
export const getStripeClient = async (): Promise<Stripe> => {
  const config = await getStripeConfig();
  const secret = config.secretKey || 'sk_test_mock';

  return new Stripe(secret, {
    apiVersion: '2023-10-16',
  });
};

// For backward compatibility during transition, we can still export a default, 
// but it's better to use getStripeClient() everywhere.
const defaultStripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

export default defaultStripe;
