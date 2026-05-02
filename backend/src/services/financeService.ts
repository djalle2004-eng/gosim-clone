import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class FinanceService {
  /**
   * Get Financial Summary (MRR, ARR, Churn, Net Revenue, Gross Margin)
   */
  static async getSummary() {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    // 1. Calculate MRR (Monthly Recurring Revenue)
    // Assuming subscriptions or active orders in the last 30 days
    const mrrResult = await prisma.order.aggregate({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: lastMonth },
      },
      _sum: { totalAmount: true },
    });
    const mrr = mrrResult._sum.totalAmount || 0;
    const arr = mrr * 12;

    // 2. Calculate Gross Margin
    // Using order items to find cost vs price
    const items = await prisma.orderItem.findMany({
      where: {
        order: { status: OrderStatus.COMPLETED, createdAt: { gte: lastMonth } },
      },
      include: { plan: true },
    });

    let totalRevenue = 0;
    let totalCost = 0;

    items.forEach((item) => {
      totalRevenue += item.totalPrice;
      const costPerUnit = item.plan.cost || item.plan.price * 0.5; // default 50% cost if not set
      totalCost += costPerUnit * item.quantity;
    });

    const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    const netRevenue = totalRevenue - totalCost; // Simplified net revenue

    // 3. Churn Rate (Lost users / Total users at start of period)
    // Simplified: users who ordered 2 months ago but not last month
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    const activeUsersTwoMonthsAgo = await prisma.order.findMany({
      where: { createdAt: { gte: twoMonthsAgo, lt: lastMonth }, status: OrderStatus.COMPLETED },
      select: { userId: true },
      distinct: ['userId'],
    });

    const activeUsersLastMonth = await prisma.order.findMany({
      where: { createdAt: { gte: lastMonth }, status: OrderStatus.COMPLETED },
      select: { userId: true },
      distinct: ['userId'],
    });

    const activeTwoMonthsSet = new Set(activeUsersTwoMonthsAgo.map((u) => u.userId));
    const activeLastMonthSet = new Set(activeUsersLastMonth.map((u) => u.userId));

    let churnedUsers = 0;
    activeTwoMonthsSet.forEach((userId) => {
      if (!activeLastMonthSet.has(userId)) churnedUsers++;
    });

    const churnRate =
      activeTwoMonthsSet.size > 0 ? (churnedUsers / activeTwoMonthsSet.size) * 100 : 0;

    return {
      mrr,
      arr,
      netRevenue,
      grossMargin: parseFloat(grossMargin.toFixed(2)),
      churnRate: parseFloat(churnRate.toFixed(2)),
      totalCost,
    };
  }

  /**
   * Get Revenue Data (Daily/Weekly/Monthly)
   */
  static async getRevenue(period: 'daily' | 'monthly' = 'daily') {
    const days = period === 'daily' ? 30 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: startDate },
      },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const revenueMap = new Map<string, number>();
    
    orders.forEach((order) => {
      const dateKey = period === 'daily' 
        ? order.createdAt.toISOString().split('T')[0]
        : `${order.createdAt.getFullYear()}-${(order.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
        
      revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + order.totalAmount);
    });

    return Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));
  }

  /**
   * LTV (Customer Lifetime Value)
   */
  static async getLTV() {
    // ARPU = Total Revenue / Total Unique Paying Customers
    // LTV = ARPU / Churn Rate
    const totalRevResult = await prisma.order.aggregate({
      where: { status: OrderStatus.COMPLETED },
      _sum: { totalAmount: true },
    });

    const uniqueCustomers = await prisma.order.findMany({
      where: { status: OrderStatus.COMPLETED },
      select: { userId: true },
      distinct: ['userId'],
    });

    const totalRevenue = totalRevResult._sum.totalAmount || 0;
    const arpu = uniqueCustomers.length > 0 ? totalRevenue / uniqueCustomers.length : 0;

    const summary = await this.getSummary();
    const churn = summary.churnRate > 0 ? summary.churnRate / 100 : 0.05; // default 5% if 0

    const ltv = arpu / churn;

    return { arpu: parseFloat(arpu.toFixed(2)), ltv: parseFloat(ltv.toFixed(2)) };
  }

  /**
   * Cohorts (Retention)
   */
  static async getCohorts() {
    // Simplified cohort: Count of new users per month and how many ordered again next months
    // Returning mock structure for dashboard integration
    return [
      { month: 'Jan', newUsers: 150, m1: 40, m2: 25, m3: 15 },
      { month: 'Feb', newUsers: 200, m1: 45, m2: 30, m3: 0 },
      { month: 'Mar', newUsers: 300, m1: 50, m2: 0, m3: 0 },
    ];
  }
}
