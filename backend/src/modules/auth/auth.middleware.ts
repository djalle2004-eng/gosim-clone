import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/db';
import { JwtPayload } from './auth.types';
import { generateTokens } from './auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// loginRateLimiter is now imported from src/middleware/rateLimiter.ts in routes

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
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (
      !storedToken ||
      storedToken.isRevoked ||
      storedToken.expiresAt < new Date()
    ) {
      return res
        .status(401)
        .json({ message: 'Session expirée, veuillez vous reconnecter' });
    }

    // Ensure user still exists and isActive
    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Proceed to generate new tokens
    const tokens = await generateTokens(user, req, false);

    // Update Cookies automatically via Response (middleware trick)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    (req as any).user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Non autorisé - Refresh Token invalide' });
  }
};

