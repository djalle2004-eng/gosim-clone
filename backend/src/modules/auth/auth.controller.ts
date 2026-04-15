import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../../lib/db';
import redisClient from '../../utils/redis';
import { z } from 'zod';
import { 
  registerSchema, loginSchema, forgotPasswordSchema, 
  resetPasswordSchema, verifyEmailSchema 
} from './auth.validators';
import {
  hashPassword, generateTokens, generateOTP, sendVerificationEmail,
  sendResetPasswordEmail, sendWelcomeEmail, logLoginHistory
} from './auth.service';

const isProd = process.env.NODE_ENV === 'production';

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check existing
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
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
      }
    });

    // Generate and store OTP in Redis (expires in 15 mins)
    const otp = generateOTP();
    await redisClient.setEx(`verify_otp:${user.id}`, 60 * 15, otp);
    
    // Send background email
    sendVerificationEmail(user.email, otp);

    const { accessToken, refreshToken } = generateTokens(user, false);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({ message: 'Utilisateur créé, veuillez vérifier votre email.', user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
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
        OR: [
          { email: data.emailOrPhone },
          { phone: data.emailOrPhone }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    
    if (!isMatch) {
      // Consume a point in rate limiter
      if ((req as any).rateLimiter) {
        await (req as any).rateLimiter.consume((req as any).limiterKey);
      }
      await logLoginHistory(user.id, ip, device, false);
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Ce compte a été désactivé' });
    }

    await logLoginHistory(user.id, ip, device, true);

    const { accessToken, refreshToken } = generateTokens(user, data.rememberMe);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: isProd, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, secure: isProd, sameSite: 'strict', 
      maxAge: (data.rememberMe ? 90 : 30) * 24 * 60 * 60 * 1000 
    });

    return res.json({ message: 'Connecté avec succès', user: { id: user.id, role: user.role, email: user.email, isVerified: user.isVerified } });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = verifyEmailSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (user.isVerified) return res.status(400).json({ message: 'Email déjà vérifié' });

    const storedOtp = await redisClient.get(`verify_otp:${user.id}`);
    if (!storedOtp || storedOtp !== data.otp) {
      return res.status(400).json({ message: 'OTP invalide ou expiré' });
    }

    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    await redisClient.del(`verify_otp:${user.id}`);
    
    sendWelcomeEmail(user.email);

    return res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
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
    return res.json({ message: 'Si un compte existe, un email de réinitialisation a été envoyé.' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = resetPasswordSchema.parse({ token, newPassword: req.body.newPassword });

    const userId = await redisClient.get(`reset_token:${token}`);
    if (!userId) {
      return res.status(400).json({ message: 'Lien de réinitialisation invalide ou expiré' });
    }

    const hashedPwd = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPwd } });
    
    await redisClient.del(`reset_token:${token}`);
    
    // Invalidate all existing refresh tokens if necessary by tracking token versions in a stricter implementation

    return res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Erreur interne' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const user = (req as any).user;
  
  if (refreshToken && user) {
    // Revoke specifically in redis
    await redisClient.setEx(`revoke_refresh:${user.id}:${refreshToken}`, 90 * 24 * 60 * 60, "true");
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
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isVerified: true, phone: true }
  });
  
  if (!fullUser) return res.status(404).json({ message: 'Utilisateur introuvable' });
  return res.json(fullUser);
};
