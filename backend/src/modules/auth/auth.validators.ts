import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[\W_]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email or phone required'),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid token'),
  newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  email: z.string().email('Invalid email format'),
});
