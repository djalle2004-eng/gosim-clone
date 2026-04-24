import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';

export const buildWhereClause = (filters: any): Prisma.ESimPlanWhereInput => {
  const where: Prisma.ESimPlanWhereInput = { isActive: true };

  if (filters.region || filters.countryCode) {
    where.country = {};
    if (filters.region) {
      where.country.region = filters.region as any;
    }
    if (filters.countryCode) {
      where.country.code = filters.countryCode.toUpperCase();
    }
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
  }

  if (filters.minData) {
    where.dataAmount = { gte: parseInt(filters.minData, 10) };
  }

  if (filters.unlimited === 'true' || filters.unlimited === true) {
    where.isUnlimited = true;
  }

  if (filters.validity) {
    where.validity = parseInt(filters.validity, 10);
  }

  if (filters.speed) {
    // If multiple speeds, we'd need 'in'. For now assume single or handle accordingly
    if (Array.isArray(filters.speed)) {
      where.speed = { in: filters.speed as any };
    } else {
      where.speed = filters.speed as any;
    }
  }

  if (filters.search) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { country: { nameEn: { contains: q, mode: 'insensitive' } } },
      { country: { nameAr: { contains: q, mode: 'insensitive' } } },
      { slug: { contains: q, mode: 'insensitive' } },
    ];
  }

  return where;
};

export const getPlans = async (
  where: Prisma.ESimPlanWhereInput,
  orderBy: any,
  skip: number,
  take: number
) => {
  const [total, plans] = await Promise.all([
    prisma.eSimPlan.count({ where }),
    prisma.eSimPlan.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        country: {
          select: {
            nameEn: true,
            nameAr: true,
            code: true,
            flag: true,
            region: true,
          },
        },
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  return { total, plans };
};
