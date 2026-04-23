import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  getCurrentUser,
  refresh,
  enable2FA,
  verify2FA,
  disable2FA,
} from './auth.controller';
import { verifyToken } from './auth.middleware';
import { generateTokens, logLoginHistory } from './auth.service';
import { loginLimiter, otpLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refresh);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// 2FA Routes
router.post('/2fa/enable', verifyToken, enable2FA);
router.post('/2fa/verify', otpLimiter, verify2FA);
router.post('/2fa/disable', verifyToken, disable2FA);

router.get('/me', verifyToken, getCurrentUser);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login?error=oauth_failed',
  }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const { accessToken, refreshToken } = await generateTokens(
        user,
        req,
        true
      ); // OAuth usually gives a long session

      const isProd = process.env.NODE_ENV === 'production';

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
        maxAge: 90 * 24 * 60 * 60 * 1000,
      });

      // Log success
      await logLoginHistory(user.id, req, true);

      // Redirect to frontend
      const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (err) {
      res.redirect('/login?error=oauth_failed');
    }
  }
);

export default router;
