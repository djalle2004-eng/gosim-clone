import prisma from '../../lib/db';
import { encrypt, decrypt, maskSecret } from '../../utils/encryption';
import axios from 'axios';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// ================================
// PROVIDER DEFINITIONS REGISTRY
// ================================

export interface ProviderKeyDef {
  key: string;
  label: string;
  placeholder: string;
  isSecret: boolean; // if true, value is encrypted & masked on read
  required?: boolean;
}

export interface ProviderDef {
  provider: string;
  label: string;
  description: string;
  icon: string; // emoji
  keys: ProviderKeyDef[];
}

export interface CategoryDef {
  category: string;
  label: string;
  icon: string;
  providers: ProviderDef[];
}

/**
 * Master registry of every provider SoufSim can integrate with.
 * This is what drives both the backend validation and the frontend UI.
 */
export const PROVIDERS_REGISTRY: CategoryDef[] = [
  {
    category: 'ESIM_PROVIDER',
    label: 'Fournisseurs eSIM',
    icon: '🌐',
    providers: [
      {
        provider: 'AIRALO',
        label: 'Airalo',
        description: "Le plus grand fournisseur mondial d'eSIM pour voyageurs.",
        icon: '✈️',
        keys: [
          {
            key: 'API_URL',
            label: "URL de l'API",
            placeholder: 'https://partners.airalo.com/v2',
            isSecret: false,
          },
          {
            key: 'CLIENT_ID',
            label: 'Client ID',
            placeholder: 'Votre Client ID Airalo',
            isSecret: true,
            required: true,
          },
          {
            key: 'CLIENT_SECRET',
            label: 'Client Secret',
            placeholder: 'Votre Client Secret Airalo',
            isSecret: true,
            required: true,
          },
          {
            key: 'MODE',
            label: 'Mode',
            placeholder: 'sandbox | production',
            isSecret: false,
          },
        ],
      },
      {
        provider: 'ESIMGO',
        label: 'eSIM.Go',
        description: "Plateforme B2B d'eSIM avec API REST simple.",
        icon: '📡',
        keys: [
          {
            key: 'API_URL',
            label: "URL de l'API",
            placeholder: 'https://api.esim-go.com/v2',
            isSecret: false,
          },
          {
            key: 'API_KEY',
            label: 'Clé API',
            placeholder: 'Votre clé API eSIM.Go',
            isSecret: true,
            required: true,
          },
        ],
      },
      {
        provider: 'SIMFONY',
        label: 'Simfony',
        description: 'Fournisseur eSIM alternatif avec couverture régionale.',
        icon: '📶',
        keys: [
          {
            key: 'API_URL',
            label: "URL de l'API",
            placeholder: 'https://api.simfony.com/v1',
            isSecret: false,
          },
          {
            key: 'API_KEY',
            label: 'Clé API',
            placeholder: 'Votre clé API Simfony',
            isSecret: true,
            required: true,
          },
          {
            key: 'API_SECRET',
            label: 'Secret API',
            placeholder: 'Votre secret Simfony',
            isSecret: true,
          },
        ],
      },
    ],
  },
  {
    category: 'PAYMENT',
    label: 'Passerelles de Paiement',
    icon: '💳',
    providers: [
      {
        provider: 'STRIPE',
        label: 'Stripe',
        description:
          'Paiement par carte bancaire international (Visa, Mastercard).',
        icon: '💎',
        keys: [
          {
            key: 'SECRET_KEY',
            label: 'Clé Secrète',
            placeholder: 'sk_live_...',
            isSecret: true,
            required: true,
          },
          {
            key: 'PUBLISHABLE_KEY',
            label: 'Clé Publique',
            placeholder: 'pk_live_...',
            isSecret: false,
            required: true,
          },
          {
            key: 'WEBHOOK_SECRET',
            label: 'Webhook Secret',
            placeholder: 'whsec_...',
            isSecret: true,
          },
        ],
      },
      {
        provider: 'CIB',
        label: 'CIB (Carte Interbancaire)',
        description: 'Paiement par carte CIB algérienne.',
        icon: '🏦',
        keys: [
          {
            key: 'MERCHANT_ID',
            label: 'Merchant ID',
            placeholder: 'Votre Merchant ID CIB',
            isSecret: false,
            required: true,
          },
          {
            key: 'TERMINAL_ID',
            label: 'Terminal ID',
            placeholder: 'Votre Terminal ID',
            isSecret: false,
          },
          {
            key: 'SECRET_KEY',
            label: 'Clé Secrète',
            placeholder: 'Votre clé secrète CIB',
            isSecret: true,
            required: true,
          },
          {
            key: 'API_URL',
            label: "URL de l'API",
            placeholder: 'https://payment.cib.dz/api',
            isSecret: false,
          },
        ],
      },
      {
        provider: 'EDAHABIA',
        label: 'Edahabia (Algérie Poste)',
        description: "Paiement via carte Edahabia d'Algérie Poste.",
        icon: '📮',
        keys: [
          {
            key: 'MERCHANT_ID',
            label: 'Merchant ID',
            placeholder: 'Votre Merchant ID Edahabia',
            isSecret: false,
            required: true,
          },
          {
            key: 'API_KEY',
            label: 'Clé API',
            placeholder: 'Votre clé API Edahabia',
            isSecret: true,
            required: true,
          },
          {
            key: 'SECRET_KEY',
            label: 'Clé Secrète',
            placeholder: 'Votre clé secrète',
            isSecret: true,
            required: true,
          },
          {
            key: 'API_URL',
            label: "URL de l'API",
            placeholder: 'https://epay.poste.dz/api',
            isSecret: false,
          },
        ],
      },
    ],
  },
  {
    category: 'EMAIL',
    label: 'Email & Notifications',
    icon: '📧',
    providers: [
      {
        provider: 'SMTP',
        label: 'Serveur SMTP',
        description:
          "Configuration du serveur d'envoi d'emails (Gmail, SendGrid, Mailgun, etc.).",
        icon: '✉️',
        keys: [
          {
            key: 'HOST',
            label: 'Hôte SMTP',
            placeholder: 'smtp.gmail.com',
            isSecret: false,
            required: true,
          },
          {
            key: 'PORT',
            label: 'Port',
            placeholder: '587',
            isSecret: false,
            required: true,
          },
          {
            key: 'USER',
            label: 'Utilisateur',
            placeholder: 'votre@email.com',
            isSecret: false,
            required: true,
          },
          {
            key: 'PASS',
            label: 'Mot de passe / App Password',
            placeholder: 'Mot de passe SMTP',
            isSecret: true,
            required: true,
          },
          {
            key: 'FROM',
            label: 'Email expéditeur',
            placeholder: 'noreply@soufsim.com',
            isSecret: false,
          },
          {
            key: 'SECURE',
            label: 'SSL/TLS (true/false)',
            placeholder: 'false',
            isSecret: false,
          },
        ],
      },
    ],
  },
];

// ================================
// CRUD OPERATIONS
// ================================

/**
 * Get all settings, grouped by category/provider.
 * Secret values are masked for display.
 */
export const getAllSettings = async () => {
  const settings = await prisma.systemSetting.findMany({
    orderBy: [{ category: 'asc' }, { provider: 'asc' }, { key: 'asc' }],
  });

  // Build a lookup map: category.provider.key -> { value, isActive }
  const settingsMap: Record<string, Record<string, Record<string, any>>> = {};
  for (const s of settings) {
    if (!settingsMap[s.category]) settingsMap[s.category] = {};
    if (!settingsMap[s.category][s.provider])
      settingsMap[s.category][s.provider] = {};

    // Find the key def to decide if we should mask
    const catDef = PROVIDERS_REGISTRY.find((c) => c.category === s.category);
    const provDef = catDef?.providers.find((p) => p.provider === s.provider);
    const keyDef = provDef?.keys.find((k) => k.key === s.key);

    let displayValue = '';
    try {
      const decrypted = decrypt(s.value);
      displayValue = keyDef?.isSecret ? maskSecret(decrypted) : decrypted;
    } catch {
      displayValue = '⚠️ Erreur de déchiffrement';
    }

    settingsMap[s.category][s.provider][s.key] = {
      id: s.id,
      value: displayValue,
      isActive: s.isActive,
      hasValue: true,
      updatedAt: s.updatedAt,
    };
  }

  // Merge with registry to ensure all providers/keys appear
  return PROVIDERS_REGISTRY.map((cat) => ({
    ...cat,
    providers: cat.providers.map((prov) => {
      const provSettings = settingsMap[cat.category]?.[prov.provider] || {};
      const isActive =
        Object.values(provSettings).some((s: any) => s.isActive) || false;

      return {
        ...prov,
        isActive,
        keys: prov.keys.map((keyDef) => ({
          ...keyDef,
          value: provSettings[keyDef.key]?.value || '',
          hasValue: provSettings[keyDef.key]?.hasValue || false,
          updatedAt: provSettings[keyDef.key]?.updatedAt || null,
        })),
      };
    }),
  }));
};

/**
 * Upsert one or more settings for a provider.
 */
export const upsertSettings = async (
  category: string,
  provider: string,
  keys: { key: string; value: string }[],
  isActive: boolean,
  adminUserId: string
) => {
  const operations = keys
    .filter((k) => k.value && k.value.trim() !== '')
    .map((k) =>
      prisma.systemSetting.upsert({
        where: {
          category_provider_key: { category, provider, key: k.key },
        },
        update: {
          value: encrypt(k.value),
          isActive,
          updatedBy: adminUserId,
        },
        create: {
          category,
          provider,
          key: k.key,
          value: encrypt(k.value),
          isActive,
          updatedBy: adminUserId,
        },
      })
    );

  // Also update isActive on existing keys that weren't submitted
  const toggleOp = prisma.systemSetting.updateMany({
    where: { category, provider },
    data: { isActive },
  });

  await prisma.$transaction([...operations, toggleOp]);

  return { success: true, count: operations.length };
};

/**
 * Get the raw (decrypted) value of a setting. For internal use only.
 */
export const getSettingValue = async (
  category: string,
  provider: string,
  key: string
): Promise<string | null> => {
  const setting = await prisma.systemSetting.findUnique({
    where: { category_provider_key: { category, provider, key } },
  });

  if (!setting || !setting.isActive) return null;

  try {
    return decrypt(setting.value);
  } catch {
    console.error(`Failed to decrypt setting ${category}/${provider}/${key}`);
    return null;
  }
};

// ================================
// CONNECTION TESTS
// ================================

export const testConnection = async (
  category: string,
  provider: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (category === 'ESIM_PROVIDER' && provider === 'AIRALO') {
      return await testAiralo();
    }
    if (category === 'ESIM_PROVIDER' && provider === 'ESIMGO') {
      return await testEsimGo();
    }
    if (category === 'PAYMENT' && provider === 'STRIPE') {
      return await testStripe();
    }
    if (category === 'EMAIL' && provider === 'SMTP') {
      return await testSmtp();
    }

    return {
      success: true,
      message: `Test non implémenté pour ${provider}. Les clés ont été sauvegardées.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Erreur de connexion inconnue',
    };
  }
};

async function testAiralo(): Promise<{ success: boolean; message: string }> {
  const baseUrl =
    (await getSettingValue('ESIM_PROVIDER', 'AIRALO', 'API_URL')) ||
    'https://partners.airalo.com/v2';
  const clientId = await getSettingValue(
    'ESIM_PROVIDER',
    'AIRALO',
    'CLIENT_ID'
  );
  const clientSecret = await getSettingValue(
    'ESIM_PROVIDER',
    'AIRALO',
    'CLIENT_SECRET'
  );

  if (!clientId || !clientSecret) {
    return { success: false, message: 'Client ID ou Client Secret manquant.' };
  }

  const form = new URLSearchParams();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('grant_type', 'client_credentials');

  const res = await axios.post(`${baseUrl}/token`, form.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    timeout: 10000,
  });

  if (res.data?.data?.access_token) {
    return {
      success: true,
      message: `✅ Connexion Airalo réussie ! Token obtenu (expire dans ${res.data.data.expires_in}s).`,
    };
  }
  return { success: false, message: 'Réponse Airalo inattendue.' };
}

async function testEsimGo(): Promise<{ success: boolean; message: string }> {
  const baseUrl =
    (await getSettingValue('ESIM_PROVIDER', 'ESIMGO', 'API_URL')) ||
    'https://api.esim-go.com/v2';
  const apiKey = await getSettingValue('ESIM_PROVIDER', 'ESIMGO', 'API_KEY');

  if (!apiKey) return { success: false, message: 'Clé API manquante.' };

  const res = await axios.get(`${baseUrl}/catalogue`, {
    headers: { 'X-API-Key': apiKey, Accept: 'application/json' },
    timeout: 10000,
  });

  return {
    success: true,
    message: `✅ Connexion eSIM.Go réussie ! ${res.data?.length || 0} forfaits trouvés.`,
  };
}

async function testStripe(): Promise<{ success: boolean; message: string }> {
  const secretKey = await getSettingValue('PAYMENT', 'STRIPE', 'SECRET_KEY');
  if (!secretKey)
    return { success: false, message: 'Clé secrète Stripe manquante.' };

  const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  const balance = await stripe.balance.retrieve();

  return {
    success: true,
    message: `✅ Connexion Stripe réussie ! Solde: ${balance.available.map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(', ') || '0'}`,
  };
}

async function testSmtp(): Promise<{ success: boolean; message: string }> {
  const host = await getSettingValue('EMAIL', 'SMTP', 'HOST');
  const port = await getSettingValue('EMAIL', 'SMTP', 'PORT');
  const user = await getSettingValue('EMAIL', 'SMTP', 'USER');
  const pass = await getSettingValue('EMAIL', 'SMTP', 'PASS');

  if (!host || !user || !pass)
    return { success: false, message: 'Configuration SMTP incomplète.' };

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port || '587'),
    secure: (await getSettingValue('EMAIL', 'SMTP', 'SECURE')) === 'true',
    auth: { user, pass },
  });

  await transporter.verify();
  return {
    success: true,
    message: '✅ Connexion SMTP réussie ! Le serveur est joignable.',
  };
}
