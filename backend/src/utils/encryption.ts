import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Master key for encrypting/decrypting API secrets stored in DB.
 * This is the ONE secret that must remain in the .env file.
 * Must be exactly 32 bytes (64 hex characters).
 */
function getMasterKey(): Buffer {
  const hex = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    // Auto-generate a deterministic fallback from DATABASE_URL for dev convenience
    const fallback = crypto
      .createHash('sha256')
      .update(process.env.DATABASE_URL || 'soufsim-dev-key')
      .digest('hex');
    return Buffer.from(fallback, 'hex');
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing IV + ciphertext + auth tag.
 */
export function encrypt(plaintext: string): string {
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const tag = cipher.getAuthTag();

  // Pack: IV (16b) + Tag (16b) + Ciphertext
  const packed = Buffer.concat([iv, tag, encrypted]);
  return packed.toString('base64');
}

/**
 * Decrypt a base64-encoded AES-256-GCM string back to plaintext.
 */
export function decrypt(encryptedBase64: string): string {
  const key = getMasterKey();
  const packed = Buffer.from(encryptedBase64, 'base64');

  const iv = packed.subarray(0, IV_LENGTH);
  const tag = packed.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Mask a secret value for safe display (e.g. "sk_live_****Xk3F")
 */
export function maskSecret(value: string): string {
  if (value.length <= 8) return '••••••••';
  const prefix = value.substring(0, 4);
  const suffix = value.substring(value.length - 4);
  return `${prefix}${'•'.repeat(Math.min(value.length - 8, 20))}${suffix}`;
}
