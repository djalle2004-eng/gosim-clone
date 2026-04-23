import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/db';
import redisClient from '../../utils/redis';
import { sendEmail } from '../../utils/mailer';
import { User } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { UAParser } from 'ua-parser-js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const generateTokens = async (
  user: User,
  req: any,
  rememberMe: boolean = false
) => {
  const payload = { id: user.id, role: user.role, email: user.email };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

  // Generate a random string for refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Parse user agent
  const parser = new UAParser(req.headers['user-agent'] || '');
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const deviceInfo = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'}`;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 90 : 7)); // 90 days if rememberMe, else 7 days

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
      deviceInfo,
      ip: req.ip || 'unknown',
    },
  });

  return { accessToken, refreshToken };
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  const templatePath = path.join(__dirname, 'templates', 'verify-email.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace('{{OTP}}', otp);

  await sendEmail(email, 'Verify your SoufSim Account', html);
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const templatePath = path.join(__dirname, 'templates', 'reset-password.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
  html = html.replace('{{RESET_LINK}}', resetLink);

  await sendEmail(email, 'Reset Your Password - SoufSim', html);
};

export const sendWelcomeEmail = async (email: string) => {
  const templatePath = path.join(__dirname, 'templates', 'welcome.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace('{{APP_URL}}', FRONTEND_URL);

  await sendEmail(email, 'Welcome to SoufSim!', html);
};

export const logLoginHistory = async (
  userId: string,
  req: any,
  success: boolean
) => {
  const parser = new UAParser(req.headers['user-agent'] || '');
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const deviceInfo = `${browser.name || 'Unknown'} - ${os.name || 'Unknown'}`;
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';

  await prisma.loginHistory.create({
    data: {
      userId,
      ip,
      device: deviceInfo,
      userAgent: req.headers['user-agent'] || 'unknown',
      success,
    },
  });

  if (success) {
    const pastLogins = await prisma.loginHistory.count({
      where: {
        userId,
        success: true,
        ip,
        device: deviceInfo,
      },
    });

    if (pastLogins === 1) {
      // First time login from this IP/Device combination
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        // Mock email alert
        console.log(
          `[SECURITY ALERT] New login from unrecognized device/IP for ${user.email}: ${deviceInfo} (${ip})`
        );
        // await sendEmail(user.email, 'New Login Alert', `A new login was detected from ${deviceInfo} (IP: ${ip}).`);
      }
    }
  }
};
