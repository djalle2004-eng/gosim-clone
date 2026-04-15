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
} from './auth.controller';
import { verifyToken, loginRateLimiter } from './auth.middleware';
import { generateTokens, logLoginHistory } from './auth.service';

const router = Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post('/logout', verifyToken, logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

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
      const { accessToken, refreshToken } = generateTokens(user, true); // OAuth usually gives a long session

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
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const device = req.headers['user-agent'] || 'unknown';
      await logLoginHistory(user.id, ip, device, true);

      // Redirect to frontend
      const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${FRONTEND_URL}/dashboard`);
    } catch (err) {
      res.redirect('/login?error=oauth_failed');
    }
  }
);

export default router;
