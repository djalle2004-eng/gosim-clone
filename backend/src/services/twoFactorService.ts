import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class TwoFactorService {
  static generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `GoSIM (${email})`,
    });
    return secret;
  }

  static async generateQRCode(otpauthUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
        if (err) reject(err);
        else resolve(dataUrl);
      });
    });
  }

  static verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Accept current and previous/next window
    });
  }

  static async generateBackupCodes(count = 10): Promise<{ plain: string[], hashed: string[] }> {
    const plainCodes: string[] = [];
    const hashedCodes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex'); // 8 chars
      plainCodes.push(code);
      const hashed = await bcrypt.hash(code, 10);
      hashedCodes.push(hashed);
    }

    return { plain: plainCodes, hashed: hashedCodes };
  }

  static async verifyBackupCode(code: string, hashedCodes: string[]): Promise<{ isValid: boolean, remainingCodes: string[] }> {
    for (let i = 0; i < hashedCodes.length; i++) {
      const isValid = await bcrypt.compare(code, hashedCodes[i]);
      if (isValid) {
        // Remove the used code
        const remaining = [...hashedCodes];
        remaining.splice(i, 1);
        return { isValid: true, remainingCodes: remaining };
      }
    }
    return { isValid: false, remainingCodes: hashedCodes };
  }
}
