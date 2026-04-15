import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/db';
import redisClient from '../../utils/redis';
import { sendEmail } from '../../utils/mailer';
import { User } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const generateTokens = (user: User, rememberMe: boolean = false) => {
  const payload = { id: user.id, role: user.role, email: user.email };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  
  // 90 days if rememberMe, otherwise 30 days
  const refreshExpiresIn = rememberMe ? '90d' : '30d';
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: refreshExpiresIn });

  return { accessToken, refreshToken };
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  const templatePath = path.join(__dirname, 'templates', 'verify-email.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace('{{OTP}}', otp);

  await sendEmail(email, 'Verify your GoSIM Account', html);
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const templatePath = path.join(__dirname, 'templates', 'reset-password.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
  html = html.replace('{{RESET_LINK}}', resetLink);

  await sendEmail(email, 'Reset Your Password - GoSIM', html);
};

export const sendWelcomeEmail = async (email: string) => {
  const templatePath = path.join(__dirname, 'templates', 'welcome.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  html = html.replace('{{APP_URL}}', FRONTEND_URL);

  await sendEmail(email, 'Welcome to GoSIM!', html);
};

export const logLoginHistory = async (userId: string, ip: string, device: string, success: boolean) => {
  await prisma.loginHistory.create({
    data: {
      userId,
      ip,
      device,
      success
    }
  });
};
