import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isRedisConnected = false;
let isConnecting = false;

export const connectRedis = async () => {
  if (!isRedisConnected && !isConnecting && !redisClient.isOpen) {
    isConnecting = true;
    try {
      await redisClient.connect();
      isRedisConnected = true;
      console.log('Connected to Redis ✅');
    } catch (err) {
      isConnecting = false;
      throw err;
    }
  }
};

export default redisClient;

// Start connection immediately
connectRedis().catch((err) =>
  console.error('Failed to connect to Redis initially', err)
);
