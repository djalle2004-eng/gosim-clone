import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import redisClient from '../utils/redis';
import prisma from '../lib/db';

const TIER_DAILY_LIMITS = {
  FREE: 100,
  STARTER: 1000,
  PRO: 10000,
  ENTERPRISE: 100000,
};

// Rate limiter helper using sliding window or simple expiry in Redis
async function checkRateLimit(keyHash: string, tier: string): Promise<boolean> {
  const dateStr = new Date().toISOString().split('T')[0];
  const redisDailyKey = `ratelimit:daily:${keyHash}:${dateStr}`;
  const redisMinKey = `ratelimit:min:${keyHash}:${Math.floor(Date.now() / 60000)}`;

  try {
    const multi = redisClient.multi();
    multi.incr(redisDailyKey);
    multi.expire(redisDailyKey, 86400); // 24 hours
    multi.incr(redisMinKey);
    multi.expire(redisMinKey, 60); // 1 min

    const results = await multi.exec();
    const dailyUsage = results?.[0] as number;
    const minUsage = results?.[2] as number;

    const dailyLimit = TIER_DAILY_LIMITS[tier as keyof typeof TIER_DAILY_LIMITS] || 100;
    
    // 500 requests per minute burst limit
    if (minUsage > 500) {
      return false;
    }

    if (dailyUsage > dailyLimit) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Rate limiting error', err);
    return true; // Fallback to allow if Redis fails
  }
}

export const authenticateApiKey = (requiredScopes: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'Missing X-API-Key header',
        requestId: req.headers['x-request-id'] || 'req_' + Date.now(),
      });
    }

    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const cacheKey = `apikey:${keyHash}`;

    try {
      let keyDataStr = null;
      if (redisClient.isOpen) {
        keyDataStr = await redisClient.get(cacheKey);
      }

      let keyData;

      if (keyDataStr) {
        keyData = JSON.parse(keyDataStr);
      } else {
        // Fallback to DB
        const dbKey = await prisma.apiKey.findUnique({
          where: { keyHash },
          include: { user: true },
        });

        if (!dbKey || !dbKey.isActive) {
          return res.status(401).json({
            success: false,
            error: 'Invalid or inactive API Key',
            requestId: req.headers['x-request-id'] || 'req_' + Date.now(),
          });
        }

        // Fetch user's subscription or default to STARTER
        const tier = 'STARTER'; // Mocked for now

        let scopesArray: string[] = [];
        if (dbKey.scopes && Array.isArray(dbKey.scopes)) {
           scopesArray = dbKey.scopes as string[];
        }

        keyData = {
          id: dbKey.id,
          userId: dbKey.userId,
          tier: tier,
          scopes: scopesArray,
        };

        if (redisClient.isOpen) {
          await redisClient.setEx(cacheKey, 3600, JSON.stringify(keyData)); // Cache for 1 hour
        }
        
        // Update last used asynchronously
        prisma.apiKey.update({
          where: { id: dbKey.id },
          data: { lastUsedAt: new Date() },
        }).catch(console.error);
      }

      // Check scopes
      if (requiredScopes.length > 0) {
        const hasScope = requiredScopes.every(scope => keyData.scopes.includes(scope) || keyData.scopes.includes('*'));
        if (!hasScope) {
          return res.status(403).json({
            success: false,
            error: 'Insufficient scopes',
            requestId: req.headers['x-request-id'] || 'req_' + Date.now(),
          });
        }
      }

      // Apply rate limits
      const isAllowed = await checkRateLimit(keyHash, keyData.tier);
      if (!isAllowed) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          requestId: req.headers['x-request-id'] || 'req_' + Date.now(),
        });
      }

      // Attach context
      (req as any).partner = {
        userId: keyData.userId,
        tier: keyData.tier,
      };

      next();
    } catch (err: any) {
      console.error('API Key Auth Error:', err);
      return res.status(500).json({
        success: false,
        error: 'Internal authentication error',
        requestId: req.headers['x-request-id'] || 'req_' + Date.now(),
      });
    }
  };
};
