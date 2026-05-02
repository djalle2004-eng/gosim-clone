import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class TaxService {
  /**
   * Get monthly tax report
   */
  static async getMonthlyTaxReport() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: firstDayOfMonth },
        taxAmount: { gt: 0 },
      },
      include: {
        user: { select: { country: true, taxId: true } },
      },
    });

    const taxByCountry = new Map<
      string,
      { totalAmount: number; totalTax: number; orderCount: number }
    >();

    orders.forEach((order) => {
      // If user has a valid B2B taxId, and reverse charge applies, tax is 0.
      // But we count collected tax here.
      const country = order.user.country || 'Unknown';
      if (!taxByCountry.has(country)) {
        taxByCountry.set(country, {
          totalAmount: 0,
          totalTax: 0,
          orderCount: 0,
        });
      }
      const data = taxByCountry.get(country)!;
      data.totalAmount += order.totalAmount;
      data.totalTax += order.taxAmount;
      data.orderCount += 1;
    });

    return Array.from(taxByCountry.entries()).map(([country, stats]) => ({
      country,
      ...stats,
    }));
  }

  /**
   * Calculate Tax for a given order amount and user country
   */
  static calculateTax(amount: number, countryCode: string, hasTaxId: boolean) {
    // Basic logic
    // EU typically 20%, DZ 19%, US 0% (sales tax handled differently), etc.
    let taxRate = 0;

    // B2B Reverse Charge
    if (hasTaxId) {
      return { taxRate: 0, taxAmount: 0 };
    }

    if (countryCode === 'DZ') taxRate = 19;
    else if (['FR', 'DE', 'IT', 'ES'].includes(countryCode)) taxRate = 20;

    const taxAmount = (amount * taxRate) / 100;
    return { taxRate, taxAmount };
  }
}
