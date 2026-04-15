import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';

// =======================
// DASHBOARD & ANALYTICS
// =======================
export const getStats = async () => {
  const [totalUsers, totalOrders, activeESims, revenueAggr] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.eSim.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED', currency: 'USD' } })
  ]);

  return {
    revenue: revenueAggr._sum.amount || 0,
    orders: totalOrders,
    users: totalUsers,
    activeESims
  };
};

export const getAnalytics = async () => {
  // Mock implementations for Postgres grouping by date since real raw queries require heavy DB specific casting.
  const topPlans = await prisma.eSimPlan.findMany({
    orderBy: { orderItems: { _count: 'desc' } },
    take: 10,
    include: { country: true }
  });

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  return {
    topPlans,
    ordersByStatus,
    // Add custom date ranges charting arrays in production
  };
};

export const getRecentOrders = async () => {
  return await prisma.order.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, firstName: true } } }
  });
};

// =======================
// PLANS MANAGEMENT
// =======================
export const getAllPlans = async () => {
  return await prisma.eSimPlan.findMany({ include: { country: true }, orderBy: { createdAt: 'desc' } });
};

export const createPlan = async (data: any) => {
  return await prisma.eSimPlan.create({ data });
};

export const updatePlan = async (id: string, data: any) => {
  return await prisma.eSimPlan.update({ where: { id }, data });
};

export const deletePlan = async (id: string) => {
  // Soft Delete
  return await prisma.eSimPlan.update({ where: { id }, data: { isActive: false } });
};

export const togglePlanState = async (id: string) => {
  const plan = await prisma.eSimPlan.findUnique({ where: { id } });
  if (!plan) throw new Error('Plan not found');
  return await prisma.eSimPlan.update({ where: { id }, data: { isActive: !plan.isActive } });
};

export const syncProviderPlans = async () => {
  // Simulate an Airalo bulk download API. In real life, fetch JSON and upsert.
  // We mock a success resolution here.
  return { message: 'Synchronized 14 new plans from Airalo successfully.' };
};

// =======================
// COUNTRIES MANAGEMENT
// =======================
export const getCountries = async () => await prisma.country.findMany();
export const createCountry = async (data: any) => await prisma.country.create({ data });
export const updateCountry = async (id: string, data: any) => await prisma.country.update({ where: { id }, data });
export const deleteCountry = async (id: string) => await prisma.country.update({ where: { id }, data: { isActive: false } });

// =======================
// USERS MANAGEMENT
// =======================
export const getUsers = async (search?: string) => {
  const where: any = {};
  if (search) {
      where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } }
      ];
  }
  return await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
};

export const getUserDetails = async (id: string) => {
  return await prisma.user.findUnique({ where: { id }, include: { orders: true, eSims: true } });
};

export const banUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return await prisma.user.update({ where: { id }, data: { isActive: !user?.isActive } });
};

export const changeUserRole = async (id: string, role: any) => {
  return await prisma.user.update({ where: { id }, data: { role } });
};

// =======================
// ORDERS & ESIMS MANAGEMENT
// =======================
export const getOrders = async () => await prisma.order.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
export const getOrderDetails = async (id: string) => await prisma.order.findUnique({ where: { id }, include: { user: true, orderItems: { include: { assignedESims: true } } } });
export const updateOrderStatus = async (id: string, status: any) => await prisma.order.update({ where: { id }, data: { status } });

export const getEsims = async () => await prisma.eSim.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
export const getEsimDetails = async (iccid: string) => await prisma.eSim.findUnique({ where: { iccid }, include: { user: true, orderItem: { include: { plan: true } } } });
export const deactivateEsim = async (iccid: string) => await prisma.eSim.update({ where: { iccid }, data: { status: 'DELETED' } });

// =======================
// SUPPORT TICKETS
// =======================
export const getTickets = async () => await prisma.supportTicket.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
export const getTicket = async (id: string) => await prisma.supportTicket.findUnique({ where: { id }, include: { user: true } });
export const replyTicket = async (id: string, message: string) => {
  // In real implementation, insert into a TicketMessages table and send an Email to User!
  return await prisma.supportTicket.update({ where: { id }, data: { status: 'IN_PROGRESS' } });
};
export const changeTicketStatus = async (id: string, status: any) => await prisma.supportTicket.update({ where: { id }, data: { status } });
export const assignTicket = async (id: string, adminId: string) => await prisma.supportTicket.update({ where: { id }, data: { assignedTo: adminId } });
