import cron from 'node-cron';
import { airaloClient } from './airalo.client';
import { db } from '../../lib/db';
import { PlanProvider } from '@prisma/client';

export class AiraloSyncService {
  /**
   * Syncs all packages from Airalo mapping to ESimPlan in our DB.
   * We will create/upsert base country links generically if they exist.
   */
  async syncAllPackages() {
    try {
      console.log('🔄 [Airalo Sync] Starting provider package sync...');

      const packages = await airaloClient.getPackages();
      // Airalo returns an array of packages. In reality, it returns a paginated structure
      // or filter structure. We map the generic array response.

      let syncedCount = 0;

      for (const pkg of packages) {
        // Find or create country logic via Airalo's typical ISO shortcode inside package
        let countryId = null;
        if (pkg.country?.code) {
          let country = await db.country.findUnique({
            where: { code: pkg.country.code.toUpperCase() },
          });
          if (!country) {
            country = await db.country.create({
              data: {
                code: pkg.country.code.toUpperCase(),
                nameEn: pkg.country.title || pkg.country.code,
                region: 'GLOBAL', // Defaulting. Can build mapping.
              },
            });
          }
          countryId = country.id;
        }

        const dataAmountInt = this.parseDataAmount(pkg.data); // "10 GB" -> 10240
        const isUnlimited = dataAmountInt === -1;

        await db.eSimPlan.upsert({
          where: { slug: pkg.slug },
          create: {
            name: pkg.title,
            slug: pkg.slug,
            countryId,
            dataAmount: dataAmountInt,
            validity: parseInt(pkg.validity) || 30, // "30 days" -> 30
            price: parseFloat(pkg.price),
            provider: PlanProvider.AIRALO,
            providerId: pkg.id.toString(),
            isUnlimited,
            speed: 'FOUR_G_FIVE_G',
            features: `["Data Only", "Installs instantly via QR"]`,
          },
          update: {
            price: parseFloat(pkg.price), // Update dynamically shifting prices
            updatedAt: new Date(),
          },
        });

        syncedCount++;
      }

      console.log(
        `✅ [Airalo Sync] Successfully synced ${syncedCount} packages.`
      );
    } catch (error) {
      console.error('❌ [Airalo Sync Error]', error);
    }
  }

  /**
   * Helper to convert "10 GB" into standard MB format.
   */
  private parseDataAmount(dataStr: string): number {
    if (!dataStr) return 0;
    const lowered = dataStr.toLowerCase();
    if (lowered.includes('unlimited')) return -1;

    const match = lowered.match(/\d+(\.\d+)?/);
    if (!match) return 0;

    const num = parseFloat(match[0]);
    if (lowered.includes('gb')) return Math.floor(num * 1024);
    if (lowered.includes('mb')) return Math.floor(num);
    return Math.floor(num);
  }

  /**
   * Initializes the cron scheduler for midnight operations
   */
  initCron() {
    // Run every day at 3:00 AM Server Time
    cron.schedule('0 3 * * *', () => {
      this.syncAllPackages();
    });
    console.log('⏰ [Cron] Scheduled Airalo Package Sync (Daily @ 3AM)');
  }
}

export const airaloSyncService = new AiraloSyncService();
