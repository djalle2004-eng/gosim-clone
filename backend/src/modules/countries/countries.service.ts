import prisma from '../../lib/db';
import redisClient from '../../utils/redis';

export const getCountries = async () => {
  const cached = await redisClient.get('countries:all');
  if (cached) return JSON.parse(cached);

  const countries = await prisma.country.findMany({
    where: { isActive: true },
    orderBy: { nameEn: 'asc' }
  });

  await redisClient.setEx('countries:all', 3600, JSON.stringify(countries));
  return countries;
};

export const getPopularCountries = async () => {
  const cached = await redisClient.get('countries:popular');
  if (cached) return JSON.parse(cached);

  const countries = await prisma.country.findMany({
    where: { isActive: true, isPopular: true },
  });

  await redisClient.setEx('countries:popular', 3600, JSON.stringify(countries));
  return countries;
};

export const getCountryByCode = async (code: string) => {
  return await prisma.country.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      esimPlans: {
        where: { isActive: true },
        orderBy: { price: 'asc' }
      }
    }
  });
};

export const searchCountries = async (query: string) => {
  // Prisma postgres fullTextSearch parsing (word1 | word2)
  const searchQuery = query.trim().split(/\s+/).join(' | ');
  
  return await prisma.country.findMany({
    where: {
      isActive: true,
      nameEn: {
        search: searchQuery
      }
    }
  });
};
