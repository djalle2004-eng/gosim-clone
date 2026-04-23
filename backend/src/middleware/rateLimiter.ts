import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../utils/redis';

const store = new RedisStore({
  // rate-limit-redis supports the native node-redis client v4
  sendCommand: (...args: string[]) => redisClient.sendCommand(args),
});

export const loginLimiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
});

export const otpLimiter = rateLimit({
  store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP/2FA attempts, please try again after 15 minutes' },
});

export const apiLimiter = rateLimit({
  store,
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each User/IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => {
    return req.user?.userId || req.ip || 'unknown';
  },
  message: { error: 'Too many requests, please try again later' },
});

export const publicLimiter = rateLimit({
  store,
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later' },
});
