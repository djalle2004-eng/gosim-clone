import {
  PrismaClient,
  Region,
  PlanProvider,
  Speed,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// ============================================================
// DATA: 32 COUNTRIES with English + Arabic names
// ============================================================
const COUNTRIES = [
  // EUROPE
  {
    nameEn: 'France',
    nameAr: 'فرنسا',
    code: 'FR',
    flag: '🇫🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Germany',
    nameAr: 'ألمانيا',
    code: 'DE',
    flag: '🇩🇪',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    code: 'GB',
    flag: '🇬🇧',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Italy',
    nameAr: 'إيطاليا',
    code: 'IT',
    flag: '🇮🇹',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Spain',
    nameAr: 'إسبانيا',
    code: 'ES',
    flag: '🇪🇸',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Portugal',
    nameAr: 'البرتغال',
    code: 'PT',
    flag: '🇵🇹',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Greece',
    nameAr: 'اليونان',
    code: 'GR',
    flag: '🇬🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Turkey',
    nameAr: 'تركيا',
    code: 'TR',
    flag: '🇹🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Netherlands',
    nameAr: 'هولندا',
    code: 'NL',
    flag: '🇳🇱',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Switzerland',
    nameAr: 'سويسرا',
    code: 'CH',
    flag: '🇨🇭',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Sweden',
    nameAr: 'السويد',
    code: 'SE',
    flag: '🇸🇪',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Norway',
    nameAr: 'النرويج',
    code: 'NO',
    flag: '🇳🇴',
    region: Region.EUROPE,
    isPopular: false,
  },
  // ASIA
  {
    nameEn: 'Japan',
    nameAr: 'اليابان',
    code: 'JP',
    flag: '🇯🇵',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'South Korea',
    nameAr: 'كوريا الجنوبية',
    code: 'KR',
    flag: '🇰🇷',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'Thailand',
    nameAr: 'تايلاند',
    code: 'TH',
    flag: '🇹🇭',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'Singapore',
    nameAr: 'سنغافورة',
    code: 'SG',
    flag: '🇸🇬',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'India',
    nameAr: 'الهند',
    code: 'IN',
    flag: '🇮🇳',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Vietnam',
    nameAr: 'فيتنام',
    code: 'VN',
    flag: '🇻🇳',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Indonesia',
    nameAr: 'إندونيسيا',
    code: 'ID',
    flag: '🇮🇩',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Malaysia',
    nameAr: 'ماليزيا',
    code: 'MY',
    flag: '🇲🇾',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Australia',
    nameAr: 'أستراليا',
    code: 'AU',
    flag: '🇦🇺',
    region: Region.ASIA,
    isPopular: true,
  },
  // AMERICAS
  {
    nameEn: 'United States',
    nameAr: 'الولايات المتحدة',
    code: 'US',
    flag: '🇺🇸',
    region: Region.AMERICAS,
    isPopular: true,
  },
  {
    nameEn: 'Canada',
    nameAr: 'كندا',
    code: 'CA',
    flag: '🇨🇦',
    region: Region.AMERICAS,
    isPopular: true,
  },
  {
    nameEn: 'Brazil',
    nameAr: 'البرازيل',
    code: 'BR',
    flag: '🇧🇷',
    region: Region.AMERICAS,
    isPopular: false,
  },
  {
    nameEn: 'Mexico',
    nameAr: 'المكسيك',
    code: 'MX',
    flag: '🇲🇽',
    region: Region.AMERICAS,
    isPopular: false,
  },
  // MIDDLE EAST
  {
    nameEn: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    code: 'AE',
    flag: '🇦🇪',
    region: Region.MIDDLEEAST,
    isPopular: true,
  },
  {
    nameEn: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    code: 'SA',
    flag: '🇸🇦',
    region: Region.MIDDLEEAST,
    isPopular: true,
  },
  {
    nameEn: 'Qatar',
    nameAr: 'قطر',
    code: 'QA',
    flag: '🇶🇦',
    region: Region.MIDDLEEAST,
    isPopular: false,
  },
  // AFRICA
  {
    nameEn: 'Algeria',
    nameAr: 'الجزائر',
    code: 'DZ',
    flag: '🇩🇿',
    region: Region.AFRICA,
    isPopular: true,
  },
  {
    nameEn: 'Morocco',
    nameAr: 'المغرب',
    code: 'MA',
    flag: '🇲🇦',
    region: Region.AFRICA,
    isPopular: true,
  },
  {
    nameEn: 'Egypt',
    nameAr: 'مصر',
    code: 'EG',
    flag: '🇪🇬',
    region: Region.AFRICA,
    isPopular: true,
  },
  {
    nameEn: 'South Africa',
    nameAr: 'جنوب أفريقيا',
    code: 'ZA',
    flag: '🇿🇦',
    region: Region.AFRICA,
    isPopular: false,
  },
  {
    nameEn: 'Tunisia',
    nameAr: 'تونس',
    code: 'TN',
    flag: '🇹🇳',
    region: Region.AFRICA,
    isPopular: false,
  },
];

// ============================================================
// DATA: All plan configs per country (65+ plans total)
// ============================================================
interface PlanTemplate {
  dataGB: number | 'unlimited';
  days: number;
  priceUSD: number;
  speed: Speed;
  isBestSeller?: boolean;
  provider: PlanProvider;
  features: string[];
}

const PLAN_TEMPLATES: Record<string, PlanTemplate[]> = {
  // EUROPE Popular
  FR: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 4.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup', 'No Phone Number'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 15.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'Easy QR Setup', 'No Setup Fee'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 24.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'Easy QR Setup'],
    },
    {
      dataGB: 20,
      days: 30,
      priceUSD: 38.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', 'High Capacity', '5G Speed'],
    },
  ],
  DE: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 11.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 25.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'No Setup Fee'],
    },
    {
      dataGB: 20,
      days: 30,
      priceUSD: 39.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', 'High Capacity', '5G Speed'],
    },
  ],
  GB: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 5.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 16.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 27.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'High Capacity'],
    },
  ],
  IT: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 10.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 14.5,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 22.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed'],
    },
  ],
  ES: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 9.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 13.5,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready'],
    },
  ],
  TR: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 8.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 13.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.SIMFONY,
      features: ['Data Only', 'Wide Coverage'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 22.0,
      speed: Speed.FOUR_G_FIVE_G,
      provider: PlanProvider.SIMFONY,
      features: ['Data Only', '5G Ready', 'Wide Coverage'],
    },
  ],
  GR: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 9.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 14.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', 'Island Coverage'],
    },
  ],
  // ASIA
  JP: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 5.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 3,
      days: 15,
      priceUSD: 12.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'No Phone Number'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 18.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'Nationwide Coverage'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 29.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'High Capacity'],
    },
  ],
  KR: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 11.5,
      speed: Speed.FOUR_G_FIVE_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 26.0,
      speed: Speed.FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'Nationwide'],
    },
  ],
  TH: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 8.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 13.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Nationwide 4G'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 20.0,
      speed: Speed.FOUR_G_FIVE_G,
      provider: PlanProvider.SIMFONY,
      features: ['Data Only', '5G Ready'],
    },
  ],
  SG: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 10.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'Easy QR Setup'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 24.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed'],
    },
  ],
  AU: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 12.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Nationwide 4G'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 28.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Ready', 'Wide Coverage'],
    },
  ],
  // AMERICAS
  US: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 4.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 14.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'No Setup Fee'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 22.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'Nationwide'],
    },
    {
      dataGB: 20,
      days: 30,
      priceUSD: 35.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', 'High Capacity', '5G Speed'],
    },
  ],
  CA: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 11.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 25.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'Nationwide'],
    },
  ],
  // MIDDLE EAST
  AE: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 6.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 3,
      days: 15,
      priceUSD: 14.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', '5G Ready', 'UAE Coverage'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 32.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed', 'Nationwide'],
    },
  ],
  SA: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 12.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 18.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.SIMFONY,
      features: ['Data Only', '5G Ready'],
    },
  ],
  QA: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 13.0,
      speed: Speed.FOUR_G_FIVE_G,
      isBestSeller: true,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Ready', 'Easy QR Setup'],
    },
    {
      dataGB: 10,
      days: 30,
      priceUSD: 28.0,
      speed: Speed.FIVE_G,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', '5G Speed'],
    },
  ],
  // AFRICA
  DZ: [
    {
      dataGB: 1,
      days: 7,
      priceUSD: 3.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.CUSTOM,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 3,
      days: 15,
      priceUSD: 9.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.CUSTOM,
      features: ['Data Only', 'Nationwide 4G'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 14.0,
      speed: Speed.FOUR_G,
      provider: PlanProvider.SIMFONY,
      features: ['Data Only', 'Nationwide Coverage'],
    },
  ],
  MA: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 8.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 13.5,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Nationwide 4G'],
    },
  ],
  EG: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 7.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.AIRALO,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 12.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.ESIMGO,
      features: ['Data Only', 'Nationwide 4G'],
    },
  ],
  TN: [
    {
      dataGB: 3,
      days: 15,
      priceUSD: 8.0,
      speed: Speed.FOUR_G,
      isBestSeller: true,
      provider: PlanProvider.CUSTOM,
      features: ['Data Only', 'Easy QR Setup'],
    },
    {
      dataGB: 5,
      days: 30,
      priceUSD: 12.5,
      speed: Speed.FOUR_G,
      provider: PlanProvider.CUSTOM,
      features: ['Data Only', 'Good Coverage'],
    },
  ],
};

// ============================================================
// GLOBAL / REGIONAL plans
// ============================================================
const GLOBAL_PLANS = [
  {
    name: 'Europe Explorer 5GB',
    slug: 'europe-explorer-5gb-30d',
    dataGB: 5,
    days: 30,
    priceUSD: 22.0,
    speed: Speed.FOUR_G_FIVE_G,
    isRegional: true,
    isGlobal: false,
    isBestSeller: true,
    provider: PlanProvider.SIMFONY,
    features: [
      '40+ European Countries',
      'Data Only',
      '5G Ready',
      'Easy QR Setup',
    ],
  },
  {
    name: 'Europe Explorer 20GB',
    slug: 'europe-explorer-20gb-30d',
    dataGB: 20,
    days: 30,
    priceUSD: 55.0,
    speed: Speed.FIVE_G,
    isRegional: true,
    isGlobal: false,
    isBestSeller: false,
    provider: PlanProvider.SIMFONY,
    features: [
      '40+ European Countries',
      'Data Only',
      '5G Speed',
      'High Capacity',
    ],
  },
  {
    name: 'Asia Pacific 5GB',
    slug: 'asia-pacific-5gb-30d',
    dataGB: 5,
    days: 30,
    priceUSD: 25.0,
    speed: Speed.FOUR_G_FIVE_G,
    isRegional: true,
    isGlobal: false,
    isBestSeller: true,
    provider: PlanProvider.ESIMGO,
    features: ['15+ Asian Countries', 'Data Only', '5G Ready'],
  },
  {
    name: 'Asia Pacific 10GB',
    slug: 'asia-pacific-10gb-30d',
    dataGB: 10,
    days: 30,
    priceUSD: 40.0,
    speed: Speed.FOUR_G_FIVE_G,
    isRegional: true,
    isGlobal: false,
    isBestSeller: false,
    provider: PlanProvider.ESIMGO,
    features: ['15+ Asian Countries', 'Data Only', '5G Ready', 'High Capacity'],
  },
  {
    name: 'Middle East 3GB',
    slug: 'middle-east-3gb-15d',
    dataGB: 3,
    days: 15,
    priceUSD: 18.0,
    speed: Speed.FOUR_G,
    isRegional: true,
    isGlobal: false,
    isBestSeller: false,
    provider: PlanProvider.SIMFONY,
    features: ['6 Middle Eastern Countries', 'Data Only', '4G Speed'],
  },
  {
    name: 'Global Voyager 10GB',
    slug: 'global-voyager-10gb-30d',
    dataGB: 10,
    days: 30,
    priceUSD: 49.0,
    speed: Speed.FOUR_G_FIVE_G,
    isRegional: false,
    isGlobal: true,
    isBestSeller: true,
    provider: PlanProvider.AIRALO,
    features: [
      '100+ Countries',
      'Data Only',
      '5G Ready',
      'No Setup Fee',
      'Easy QR Setup',
    ],
  },
  {
    name: 'Global Voyager 20GB',
    slug: 'global-voyager-20gb-30d',
    dataGB: 20,
    days: 30,
    priceUSD: 79.0,
    speed: Speed.FOUR_G_FIVE_G,
    isRegional: false,
    isGlobal: true,
    isBestSeller: false,
    provider: PlanProvider.AIRALO,
    features: ['100+ Countries', 'Data Only', '5G Ready', 'High Capacity'],
  },
  {
    name: 'Global Unlimited',
    slug: 'global-unlimited-15d',
    dataGB: 'unlimited',
    days: 15,
    priceUSD: 89.0,
    speed: Speed.FOUR_G,
    isRegional: false,
    isGlobal: true,
    isBestSeller: true,
    provider: PlanProvider.ESIMGO,
    features: [
      '100+ Countries',
      'Unlimited Data',
      'Fair Use Policy',
      'Easy QR Setup',
    ],
  },
];

// Helper: convert GB to MB
function gbToMb(gb: number | 'unlimited'): number {
  if (gb === 'unlimited') return -1;
  return gb * 1024;
}

// Helper: generate slug from name
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function main() {
  console.log('\n🌱 Starting database seed...\n');

  // --- Cleanup ---
  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.loginHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.review.deleteMany();
  await prisma.eSim.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.eSimPlan.deleteMany();
  await prisma.country.deleteMany();
  await prisma.identityVerification.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleared.\n');

  // --- Countries ---
  console.log('🌍 Seeding countries...');
  const countryMap: Record<string, string> = {}; // code => id

  for (const c of COUNTRIES) {
    const country = await prisma.country.create({
      data: {
        nameEn: c.nameEn,
        nameAr: c.nameAr,
        code: c.code,
        flag: c.flag,
        region: c.region,
        isPopular: c.isPopular,
        isActive: true,
      },
    });
    countryMap[c.code] = country.id;
  }
  console.log(`✅ ${COUNTRIES.length} countries seeded.\n`);

  // --- eSIM Plans (per country) ---
  console.log('📦 Seeding eSIM plans...');
  let planCount = 0;
  const slugSet = new Set<string>();

  for (const [code, plans] of Object.entries(PLAN_TEMPLATES)) {
    const countryId = countryMap[code];
    if (!countryId) continue;

    const countryName = COUNTRIES.find((c) => c.code === code)?.nameEn ?? code;

    for (const plan of plans) {
      const dataLabel =
        plan.dataGB === 'unlimited' ? 'Unlimited' : `${plan.dataGB}GB`;
      const baseName = `${countryName} ${dataLabel} - ${plan.days} Days`;
      const baseSlug = toSlug(`${code}-${dataLabel}-${plan.days}d`);

      // Ensure unique slugs
      let slug = baseSlug;
      let suffix = 1;
      while (slugSet.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      slugSet.add(slug);

      await prisma.eSimPlan.create({
        data: {
          name: baseName,
          slug,
          countryId,
          isGlobal: false,
          isRegional: false,
          dataAmount: gbToMb(plan.dataGB),
          validity: plan.days,
          speed: plan.speed,
          price: plan.priceUSD,
          priceDZD: parseFloat((plan.priceUSD * 134.5).toFixed(2)),
          priceEUR: parseFloat((plan.priceUSD * 0.92).toFixed(2)),
          provider: plan.provider,
          providerId: `${plan.provider.toLowerCase()}_${code.toLowerCase()}_${dataLabel.toLowerCase()}`,
          features: plan.features,
          isBestSeller: plan.isBestSeller ?? false,
          isUnlimited: plan.dataGB === 'unlimited',
          isActive: true,
        },
      });
      planCount++;
    }
  }
  console.log(`✅ ${planCount} country eSIM plans seeded.\n`);

  // --- Global / Regional Plans ---
  console.log('🌐 Seeding global and regional plans...');
  let globalCount = 0;

  for (const plan of GLOBAL_PLANS) {
    let slug = plan.slug;
    let suffix = 1;
    while (slugSet.has(slug)) {
      slug = `${plan.slug}-${suffix++}`;
    }
    slugSet.add(slug);

    const dataLabel =
      plan.dataGB === 'unlimited' ? 'Unlimited' : `${plan.dataGB}GB`;

    await prisma.eSimPlan.create({
      data: {
        name: plan.name,
        slug,
        countryId: null,
        isGlobal: plan.isGlobal,
        isRegional: plan.isRegional,
        dataAmount: gbToMb(plan.dataGB),
        validity: plan.days,
        speed: plan.speed,
        price: plan.priceUSD,
        priceDZD: parseFloat((plan.priceUSD * 134.5).toFixed(2)),
        priceEUR: parseFloat((plan.priceUSD * 0.92).toFixed(2)),
        provider: plan.provider,
        providerId: `${plan.provider.toLowerCase()}_global_${dataLabel.toLowerCase()}`,
        features: plan.features,
        isBestSeller: plan.isBestSeller,
        isUnlimited: plan.dataGB === 'unlimited',
        isActive: true,
      },
    });
    globalCount++;
  }
  console.log(`✅ ${globalCount} global/regional plans seeded.\n`);

  // --- Admin User ---
  console.log('👤 Seeding admin users...');
  const hashedAdminPassword = await bcrypt.hash('Admin@123456', 12);
  const hashedUserPassword = await bcrypt.hash('User@123456', 12);

  await prisma.user.upsert({
    where: { email: 'superadmin@soufsim.dz' },
    update: {
      password: hashedAdminPassword,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: 'superadmin@soufsim.dz',
      password: hashedAdminPassword,
      firstName: 'SoufSim',
      lastName: 'SuperAdmin',
      role: Role.SUPER_ADMIN,
      isActive: true,
      isVerified: true,
      country: 'DZ',
      preferredCurrency: 'DZD',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@soufsim.dz',
      password: hashedAdminPassword,
      firstName: 'Platform',
      lastName: 'Admin',
      role: Role.ADMIN,
      isActive: true,
      isVerified: true,
      country: 'DZ',
      preferredCurrency: 'DZD',
    },
  });

  await prisma.user.create({
    data: {
      email: 'demo@soufsim.dz',
      password: hashedUserPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: Role.USER,
      isActive: true,
      isVerified: true,
      country: 'DZ',
      preferredCurrency: 'DZD',
    },
  });

  const totalPlans = planCount + globalCount;
  console.log('✅ 3 users (super admin, admin, demo user) seeded.\n');
  console.log('═══════════════════════════════════════');
  console.log(`🎉 Seed completed successfully!`);
  console.log(`   • Countries : ${COUNTRIES.length}`);
  console.log(`   • eSIM Plans: ${totalPlans}`);
  console.log(`   • Users     : 3`);
  console.log('═══════════════════════════════════════\n');
  console.log('🔑 Admin credentials:');
  console.log('   superadmin@soufsim.dz  /  Admin@123456');
  console.log('   admin@soufsim.dz       /  Admin@123456');
  console.log('   demo@soufsim.dz        /  User@123456\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
