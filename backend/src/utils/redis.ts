import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isRedisConnected = false;

export const connectRedis = async () => {
  if (!isRedisConnected) {
    await redisClient.connect();
    isRedisConnected = true;
    console.log('Connected to Redis ✅');
  }
};

export default redisClient;
