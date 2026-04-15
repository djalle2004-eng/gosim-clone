import { PrismaClient, Region, PlanProvider, Speed } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const COUNTRIES = [
  {
    nameEn: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: Region.AMERICAS,
    isPopular: true,
  },
  {
    nameEn: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'France',
    code: 'FR',
    flag: '🇫🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    region: Region.AMERICAS,
    isPopular: false,
  },
  {
    nameEn: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'China',
    code: 'CN',
    flag: '🇨🇳',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    region: Region.MIDDLEEAST,
    isPopular: true,
  },
  {
    nameEn: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    region: Region.MIDDLEEAST,
    isPopular: false,
  },
  {
    nameEn: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    region: Region.AFRICA,
    isPopular: false,
  },
  {
    nameEn: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    region: Region.AFRICA,
    isPopular: false,
  },
  {
    nameEn: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    region: Region.AFRICA,
    isPopular: true,
  },
  {
    nameEn: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    region: Region.AMERICAS,
    isPopular: false,
  },
  {
    nameEn: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    region: Region.AMERICAS,
    isPopular: false,
  },
  {
    nameEn: 'India',
    code: 'IN',
    flag: '🇮🇳',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Thailand',
    code: 'TH',
    flag: '🇹🇭',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'Vietnam',
    code: 'VN',
    flag: '🇻🇳',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    region: Region.ASIA,
    isPopular: false,
  },
  {
    nameEn: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    region: Region.ASIA,
    isPopular: true,
  },
  {
    nameEn: 'Switzerland',
    code: 'CH',
    flag: '🇨🇭',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Netherlands',
    code: 'NL',
    flag: '🇳🇱',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Sweden',
    code: 'SE',
    flag: '🇸🇪',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Norway',
    code: 'NO',
    flag: '🇳🇴',
    region: Region.EUROPE,
    isPopular: false,
  },
  {
    nameEn: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    region: Region.EUROPE,
    isPopular: true,
  },
  {
    nameEn: 'Algeria',
    code: 'DZ',
    flag: '🇩🇿',
    region: Region.AFRICA,
    isPopular: true,
  },
];

const BUNDLE_SIZES = [
  { amount: 1024, name: '1GB', days: 7, priceFactor: 4.5 },
  { amount: 3072, name: '3GB', days: 15, priceFactor: 11 },
  { amount: 5120, name: '5GB', days: 30, priceFactor: 16 },
  { amount: 10240, name: '10GB', days: 30, priceFactor: 26 },
  { amount: 20480, name: '20GB', days: 30, priceFactor: 40 },
  { amount: -1, name: 'Unlimited', days: 15, priceFactor: 45 },
];

async function main() {
  console.log('Clearing database...');
  await prisma.review.deleteMany();
  await prisma.eSim.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.eSimPlan.deleteMany();
  await prisma.country.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding countries...');
  const countryRecords = [];
  for (const c of COUNTRIES) {
    const country = await prisma.country.create({
      data: {
        nameEn: c.nameEn,
        nameAr: null, // Could add Arabic names if needed
        code: c.code,
        flag: c.flag,
        region: c.region,
        isPopular: c.isPopular,
      },
    });
    countryRecords.push(country);
  }

  console.log(`Seeding plans for ${countryRecords.length} countries...`);
  let planCount = 0;

  // Seed local plans
  for (const country of countryRecords) {
    // Generate 2 to 5 plans per country
    const plansToGenerates = faker.number.int({ min: 2, max: 5 });
    const selectedBundles = faker.helpers.arrayElements(
      BUNDLE_SIZES,
      plansToGenerates
    );

    for (const bundle of selectedBundles) {
      const priceUSD =
        bundle.priceFactor * faker.number.float({ min: 0.8, max: 1.2 });
      const speed = faker.helpers.arrayElement([
        Speed.FOUR_G,
        Speed.FOUR_G_FIVE_G,
        Speed.FIVE_G,
      ]);

      await prisma.eSimPlan.create({
        data: {
          name: `${country.nameEn} ${bundle.name} - ${bundle.days} Days`,
          slug: faker.helpers
            .slugify(`${country.code} ${bundle.name} ${bundle.days} Days`)
            .toLowerCase(),
          countryId: country.id,
          dataAmount: bundle.amount,
          validity: bundle.days,
          price: parseFloat(priceUSD.toFixed(2)),
          priceDZD: parseFloat((priceUSD * 134).toFixed(2)), // Approx conversion
          priceEUR: parseFloat((priceUSD * 0.92).toFixed(2)),
          provider: faker.helpers.arrayElement([
            PlanProvider.AIRALO,
            PlanProvider.ESIMGO,
          ]),
          speed: speed,
          isUnlimited: bundle.amount === -1,
          isBestSeller: faker.datatype.boolean() && country.isPopular,
          features: ['Data Only', 'No Phone Number', 'Easy QR Setup'],
        },
      });
      planCount++;
    }
  }

  // Generate some Global/Regional Plans
  console.log('Seeding global / regional plans...');
  const regions = [
    { name: 'Europe+', slug: 'europe-plus', isRegional: true, isGlobal: false },
    {
      name: 'Asia Explorer',
      slug: 'asia-explorer',
      isRegional: true,
      isGlobal: false,
    },
    {
      name: 'Global Voyager',
      slug: 'global-voyager',
      isRegional: false,
      isGlobal: true,
    },
  ];

  for (const reg of regions) {
    for (const bundle of [BUNDLE_SIZES[2], BUNDLE_SIZES[4]]) {
      // 5GB and 20GB
      const priceUSD = bundle.priceFactor * 1.5; // Regional/Global is more expensive
      await prisma.eSimPlan.create({
        data: {
          name: `${reg.name} ${bundle.name} - ${bundle.days} Days`,
          slug: faker.helpers
            .slugify(`${reg.slug} ${bundle.name} ${bundle.days} Days`)
            .toLowerCase(),
          dataAmount: bundle.amount,
          validity: bundle.days,
          price: parseFloat(priceUSD.toFixed(2)),
          priceDZD: parseFloat((priceUSD * 134).toFixed(2)),
          priceEUR: parseFloat((priceUSD * 0.92).toFixed(2)),
          isRegional: reg.isRegional,
          isGlobal: reg.isGlobal,
          provider: PlanProvider.SIMFONY,
          features: ['Multi-country Support', 'Data Only', 'Easy QR Setup'],
        },
      });
      planCount++;
    }
  }

  console.log(`Successfully created ${planCount} eSIM plans!`);

  console.log('Seeding Admin User...');

  // Create a real bcrypt hashed password for the seed
  const bcrypt = require('bcrypt');
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.create({
    data: {
      email: 'admin@gosim.com',
      password: hashedAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
