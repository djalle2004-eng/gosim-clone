import { getSettingValue } from './settings.service';

/**
 * Central bridge to fetch application configurations.
 * Logic: Try Database first (SystemSetting), fallback to process.env.
 */

export const getAiraloConfig = async () => {
  const dbUrl = await getSettingValue('ESIM_PROVIDER', 'AIRALO', 'API_URL');
  const dbId = await getSettingValue('ESIM_PROVIDER', 'AIRALO', 'CLIENT_ID');
  const dbSecret = await getSettingValue('ESIM_PROVIDER', 'AIRALO', 'CLIENT_SECRET');
  const dbMode = await getSettingValue('ESIM_PROVIDER', 'AIRALO', 'MODE');

  return {
    baseUrl: dbUrl || process.env.AIRALO_API_URL || 'https://partners.airalo.com/v2',
    clientId: dbId || process.env.AIRALO_CLIENT_ID || '',
    clientSecret: dbSecret || process.env.AIRALO_CLIENT_SECRET || '',
    useMock: process.env.NODE_ENV === 'development' && process.env.MOCK_PROVIDERS === 'true' && !dbId,
    mode: dbMode || 'sandbox'
  };
};

export const getEsimGoConfig = async () => {
  const dbUrl = await getSettingValue('ESIM_PROVIDER', 'ESIMGO', 'API_URL');
  const dbKey = await getSettingValue('ESIM_PROVIDER', 'ESIMGO', 'API_KEY');

  return {
    baseUrl: dbUrl || process.env.ESIM_GO_API_URL || 'https://api.esim-go.com/v2',
    apiKey: dbKey || process.env.ESIM_GO_API_KEY || ''
  };
};

export const getStripeConfig = async () => {
  const dbSecret = await getSettingValue('PAYMENT', 'STRIPE', 'SECRET_KEY');
  const dbPublic = await getSettingValue('PAYMENT', 'STRIPE', 'PUBLISHABLE_KEY');
  const dbWebhook = await getSettingValue('PAYMENT', 'STRIPE', 'WEBHOOK_SECRET');

  return {
    secretKey: dbSecret || process.env.STRIPE_SECRET_KEY || '',
    publishableKey: dbPublic || process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: dbWebhook || process.env.STRIPE_WEBHOOK_SECRET || ''
  };
};

export const getSmtpConfig = async () => {
  const host = await getSettingValue('EMAIL', 'SMTP', 'HOST');
  const port = await getSettingValue('EMAIL', 'SMTP', 'PORT');
  const user = await getSettingValue('EMAIL', 'SMTP', 'USER');
  const pass = await getSettingValue('EMAIL', 'SMTP', 'PASS');
  const from = await getSettingValue('EMAIL', 'SMTP', 'FROM');
  const secure = await getSettingValue('EMAIL', 'SMTP', 'SECURE');

  return {
    host: host || process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(port || process.env.SMTP_PORT || '587'),
    user: user || process.env.SMTP_USER || '',
    pass: pass || process.env.SMTP_PASS || '',
    from: from || process.env.SMTP_FROM || 'noreply@soufsim.com',
    secure: secure === 'true' || process.env.SMTP_SECURE === 'true'
  };
};
