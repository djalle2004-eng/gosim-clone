import * as repository from './plans.repository';
import redisClient from '../../utils/redis';
import { convertPrice } from '../../utils/currency';
import prisma from '../../lib/db';

const computeAverageRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

const mapPlanWithCurrency = async (plan: any, currency: string) => {
  let mappedPrice = plan.price;
  
  if (currency !== 'USD') {
     mappedPrice = await convertPrice(plan.price, currency);
  }

  return {
    ...plan,
    price: mappedPrice,
    displayCurrency: currency,
    averageRating: computeAverageRating(plan.reviews)
  };
};

export const getPlans = async (filters: any, sortBy: string, page: number, limit: number, currency: string) => {
  const where = repository.buildWhereClause(filters);
  
  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'price_asc') orderBy = { price: 'asc' };
  else if (sortBy === 'price_desc') orderBy = { price: 'desc' };
  else if (sortBy === 'popular') orderBy = { isBestSeller: 'desc' };
  else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

  const skip = (page - 1) * limit;
  const { total, plans } = await repository.getPlans(where, orderBy, skip, limit);

  const mappedPlans = await Promise.all(plans.map(p => mapPlanWithCurrency(p, currency)));

  return {
    data: mappedPlans,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total
    }
  };
};

export const getPopularPlans = async (currency: string) => {
  const cacheKey = `plans:popular:${currency}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const plans = await prisma.eSimPlan.findMany({
    where: { isActive: true, isBestSeller: true },
    take: 12,
    include: {
      country: true,
      reviews: { select: { rating: true } }
    }
  });

  const mappedPlans = await Promise.all(plans.map(p => mapPlanWithCurrency(p, currency)));
  
  // Cache for 10 minutes
  await redisClient.setEx(cacheKey, 600, JSON.stringify(mappedPlans));
  return mappedPlans;
};

export const getPlanBySlug = async (slug: string, currency: string) => {
  const plan = await prisma.eSimPlan.findUnique({
    where: { slug },
    include: { country: true, reviews: { select: { rating: true } } }
  });

  if (!plan) return null;
  return await mapPlanWithCurrency(plan, currency);
};
