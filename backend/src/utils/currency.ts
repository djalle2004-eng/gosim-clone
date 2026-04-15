import redisClient from './redis';

// Simple mock or API integration for exchange rates
// In production, use OpenExchangeRates or Fixer.io
const fetchLiveRates = async () => {
  // Mock external API call:
  return {
    USD: 1,
    EUR: 0.92,
    DZD: 134.5,
  };
};

export const convertPrice = async (
  usdAmount: number,
  targetCurrency: string
): Promise<number> => {
  if (targetCurrency === 'USD') return usdAmount;

  try {
    let ratesStr = await redisClient.get('exchange_rates');
    let rates;

    if (!ratesStr) {
      rates = await fetchLiveRates();
      // Cache for 1 hour
      await redisClient.setEx('exchange_rates', 60 * 60, JSON.stringify(rates));
    } else {
      rates = JSON.parse(ratesStr);
    }

    const rate = rates[targetCurrency];
    if (!rate) return usdAmount; // fallback to base

    const converted = usdAmount * rate;
    return parseFloat(converted.toFixed(2));
  } catch (error) {
    console.error('Exchange rate error:', error);
    return usdAmount; // fallback
  }
};
