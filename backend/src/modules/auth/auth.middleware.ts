import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../../utils/redis';
import { JwtPayload } from './auth.types';
import prisma from '../../lib/db';
import { generateTokens } from './auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Rate limiter for login: max 5 failed attempts per IP per 15 minutes
export const loginRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail',
    points: 5, // 5 requests
    duration: 60 * 15, // per 15 minutes
    blockDuration: 60 * 15, // Block for 15 minutes
  });

  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const resLimiter = await limiter.get(ip);

    if (resLimiter !== null && resLimiter.consumedPoints > 5) {
      return res
        .status(429)
        .json({
          message: 'Trop de tentatives échouées. Réessayez dans 15 minutes.',
        });
    }

    // Attach limiter to request to consume point strictly on failure
    (req as any).rateLimiter = limiter;
    (req as any).limiterKey = ip;
    next();
  } catch (error) {
    next();
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
      (req as any).user = decoded;
      return next();
    }
  } catch (err: any) {
    // Access token expired or invalid, try to use refresh token
    if (err.name !== 'TokenExpiredError' || !refreshToken) {
      return res.status(401).json({ message: 'Non autorisé - Token invalide' });
    }
  }

  // Automatic Refresh logic if we only have a valid refresh token left
  try {
    const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

    // Check if refresh token is revoked in Redis
    const isRevoked = await redisClient.get(
      `revoke_refresh:${decodedRefresh.id}:${refreshToken}`
    );
    if (isRevoked) {
      return res
        .status(401)
        .json({ message: 'Session expirée, veuillez vous reconnecter' });
    }

    // Ensure user still exists and isActive
    const user = await prisma.user.findUnique({
      where: { id: decodedRefresh.id },
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Proceed to generate new tokens
    const tokens = generateTokens(user, false); // Keep same duration for simplicity, though we could extend 90d if rememberMe was logged in Redis.

    // Update Cookies automatically via Response (middleware trick)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    (req as any).user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Non autorisé - Refresh Token invalide' });
  }
};
