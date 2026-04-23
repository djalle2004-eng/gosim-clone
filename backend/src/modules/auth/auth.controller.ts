import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';
import redisClient from '../../utils/redis';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validators';
import {
  hashPassword,
  generateTokens,
  generateOTP,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
  logLoginHistory,
} from './auth.service';
import { AuthService } from '../../services/authService';
import { TwoFactorService } from '../../services/twoFactorService';

const isProd = process.env.NODE_ENV === 'production';

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const hashedPwd = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPwd,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isVerified: false,
      },
    });

    // Generate and store OTP in Redis (expires in 15 mins)
    const otp = generateOTP();
    await redisClient.setEx(`verify_otp:${user.id}`, 60 * 15, otp);

    // Send background email
    sendVerificationEmail(user.email, otp);

    const { accessToken, refreshToken } = await generateTokens(user, req, false);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'Utilisateur créé, veuillez vérifier votre email.',
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const device = req.headers['user-agent'] || 'unknown';

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.emailOrPhone }, { phone: data.emailOrPhone }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      await logLoginHistory(user.id, req, false);
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Ce compte a été désactivé' });
    }

    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign({ tempId: user.id, rememberMe: data.rememberMe }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '5m' });
      return res.json({
        requires2FA: true,
        tempToken,
        message: '2FA required'
      });
    }

    await logLoginHistory(user.id, req, true);

    const { accessToken, refreshToken } = await generateTokens(user, req, data.rememberMe);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: (data.rememberMe ? 90 : 30) * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Connecté avec succès',
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = verifyEmailSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (user.isVerified)
      return res.status(400).json({ message: 'Email déjà vérifié' });

    const storedOtp = await redisClient.get(`verify_otp:${user.id}`);
    if (!storedOtp || storedOtp !== data.otp) {
      return res.status(400).json({ message: 'OTP invalide ou expiré' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
    await redisClient.del(`verify_otp:${user.id}`);

    sendWelcomeEmail(user.email);

    return res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      // Store in redis for 1 hour
      await redisClient.setEx(`reset_token:${resetToken}`, 60 * 60, user.id);
      sendResetPasswordEmail(user.email, resetToken);
    }

    // Always return success to prevent email enumeration
    return res.json({
      message:
        'Si un compte existe, un email de réinitialisation a été envoyé.',
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = resetPasswordSchema.parse({
      token,
      newPassword: req.body.newPassword,
    });

    const userId = await redisClient.get(`reset_token:${token}`);
    if (!userId) {
      return res
        .status(400)
        .json({ message: 'Lien de réinitialisation invalide ou expiré' });
    }

    const hashedPwd = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPwd },
    });

    await redisClient.del(`reset_token:${token}`);

    // Invalidate all existing refresh tokens if necessary by tracking token versions in a stricter implementation

    return res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const user = (req as any).user;

  if (refreshToken && user) {
    await AuthService.revokeRefreshToken(refreshToken);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.json({ message: 'Déconnecté' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Non autorisé' });

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      phone: true,
    },
  });

  if (!fullUser)
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  return res.json(fullUser);
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token manquant' });

    const userId = await AuthService.verifyRefreshToken(refreshToken);
    if (!userId) return res.status(401).json({ message: 'Refresh token invalide ou expiré' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Utilisateur introuvable ou inactif' });

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user, req, false);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: 'Tokens rafraîchis' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const secret = TwoFactorService.generateSecret(user.email);
    const qrCode = await TwoFactorService.generateQRCode(secret.otpauth_url!);
    const { plain: backupCodesPlain, hashed: backupCodesHashed } = await TwoFactorService.generateBackupCodes();

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        backupCodes: backupCodesHashed
      }
    });

    return res.json({
      secret: secret.base32,
      qrCode,
      backupCodes: backupCodesPlain
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { token, tempToken, code } = req.body;
    let userId = null;
    let rememberMe = false;

    // Handling 2FA during Login flow
    if (tempToken) {
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback_secret') as any;
      userId = decoded.tempId;
      rememberMe = decoded.rememberMe || false;
    } else {
      // Handling 2FA setup flow
      userId = (req as any).user?.id;
    }

    if (!userId || !code) return res.status(400).json({ message: 'Données manquantes' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) return res.status(400).json({ message: '2FA non configuré' });

    const isValid = TwoFactorService.verifyToken(user.twoFactorSecret, code);
    if (!isValid) {
      // Check backup codes
      if (user.backupCodes) {
        const { isValid: isBackupValid, remainingCodes } = await TwoFactorService.verifyBackupCode(code, user.backupCodes as string[]);
        if (isBackupValid) {
          await prisma.user.update({
            where: { id: userId },
            data: { backupCodes: remainingCodes, twoFactorEnabled: true }
          });
          // Authenticated successfully via backup code
          await logLoginHistory(user.id, req, true);
          const tokens = await generateTokens(user, req, rememberMe);
          
          res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
          res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: (rememberMe ? 90 : 30) * 24 * 60 * 60 * 1000 });
          return res.json({ message: '2FA activé/vérifié avec succès', user: { id: user.id, email: user.email, role: user.role } });
        }
      }
      return res.status(400).json({ message: 'Code invalide' });
    }

    if (!user.twoFactorEnabled) {
      await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    }

    if (tempToken) {
      await logLoginHistory(user.id, req, true);
      const tokens = await generateTokens(user, req, rememberMe);
      
      res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: (rememberMe ? 90 : 30) * 24 * 60 * 60 * 1000 });
      return res.json({ message: 'Connecté avec succès', user: { id: user.id, email: user.email, role: user.role } });
    }

    return res.json({ message: '2FA vérifié' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null, backupCodes: Prisma.DbNull }
    });

    return res.json({ message: '2FA désactivé' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur interne' });
  }
};
