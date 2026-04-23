import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db';
import { UAParser } from 'ua-parser-js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  static async generateRefreshToken(userId: string, req: any): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Parse user agent
    const parser = new UAParser(req.headers['user-agent'] || '');
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const deviceInfo = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'}`;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        deviceInfo,
        ip: req.ip || 'unknown'
      }
    });

    return token;
  }

  static async verifyRefreshToken(token: string): Promise<string | null> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash }
    });

    if (!storedToken) return null;
    if (storedToken.isRevoked) return null;
    if (storedToken.expiresAt < new Date()) return null;

    // Rotate token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true }
    });

    return storedToken.userId;
  }

  static async revokeRefreshToken(token: string) {
    if (!token) return;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true }
    });
  }

  static async logLoginHistory(userId: string, req: any, success: boolean) {
    const parser = new UAParser(req.headers['user-agent'] || '');
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    const deviceInfo = `${browser.name || 'Unknown'} - ${os.name || 'Unknown'} - ${device.vendor || 'PC'}`;

    await prisma.loginHistory.create({
      data: {
        userId,
        ip: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        device: deviceInfo,
        success
      }
    });

    if (success) {
      // Check if this is a new IP/Device combination
      const pastLogins = await prisma.loginHistory.count({
        where: {
          userId,
          success: true,
          ip: req.ip || 'unknown',
          device: deviceInfo
        }
      });
      
      // pastLogins is exactly 1 because we just inserted the current one
      if (pastLogins === 1) {
        // Trigger a new device alert email (mocked for now, or use mailer later)
        console.log(`[ALERT] New device login detected for user ${userId} on ${deviceInfo}`);
        // import { sendMail } from '../utils/mailer';
        // await sendMail(user.email, 'New Login Alert', ...);
      }
    }
  }
}
