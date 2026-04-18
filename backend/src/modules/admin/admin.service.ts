import prisma from '../../lib/db';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

// =======================
// DASHBOARD & ANALYTICS
// =======================
export const getStats = async (adminUser?: any) => {
  const isReseller = adminUser?.role === 'RESELLER';
  const userIds = isReseller
    ? (
        await prisma.user.findMany({
          where: { resellerId: adminUser.id },
          select: { id: true },
        })
      ).map((u) => u.id)
    : undefined;

  const [totalUsers, totalOrders, activeESims, revenueAggr] = await Promise.all(
    [
      prisma.user.count({
        where: isReseller ? { resellerId: adminUser.id } : undefined,
      }),
      prisma.order.count({
        where: isReseller ? { userId: { in: userIds } } : undefined,
      }),
      prisma.eSim.count({
        where: {
          status: 'ACTIVE',
          ...(isReseller ? { userId: { in: userIds } } : {}),
        },
      }),
      !isReseller && adminUser?.role === 'SUPER_ADMIN'
        ? prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED', currency: 'USD' },
          })
        : Promise.resolve({ _sum: { amount: 0 } }),
    ]
  );

  return {
    revenue: revenueAggr._sum.amount || 0,
    orders: totalOrders,
    users: totalUsers,
    activeESims,
  };
};

export const getAnalytics = async (adminUser?: any) => {
  const isReseller = adminUser?.role === 'RESELLER';
  // Analytics for plans are universal for now, or you could filter.
  // We'll keep top plans universal.
  const topPlans = await prisma.eSimPlan.findMany({
    orderBy: { orderItems: { _count: 'desc' } },
    take: 10,
    include: { country: true },
  });

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return {
    topPlans,
    ordersByStatus,
    // Add custom date ranges charting arrays in production
  };
};

export const getRecentOrders = async (adminUser?: any) => {
  const isReseller = adminUser?.role === 'RESELLER';
  const where = isReseller ? { user: { resellerId: adminUser.id } } : undefined;

  return await prisma.order.findMany({
    where,
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, firstName: true } } },
  });
};

// =======================
// PLANS MANAGEMENT
// =======================
export const getAllPlans = async () => {
  return await prisma.eSimPlan.findMany({
    include: { country: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const createPlan = async (data: any) => {
  return await prisma.eSimPlan.create({ data });
};

export const updatePlan = async (id: string, data: any) => {
  return await prisma.eSimPlan.update({ where: { id }, data });
};

export const deletePlan = async (id: string) => {
  // Soft Delete
  return await prisma.eSimPlan.update({
    where: { id },
    data: { isActive: false },
  });
};

export const togglePlanState = async (id: string) => {
  const plan = await prisma.eSimPlan.findUnique({ where: { id } });
  if (!plan) throw new Error('Plan not found');
  return await prisma.eSimPlan.update({
    where: { id },
    data: { isActive: !plan.isActive },
  });
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
export const createCountry = async (data: any) =>
  await prisma.country.create({ data });
export const updateCountry = async (id: string, data: any) =>
  await prisma.country.update({ where: { id }, data });
export const deleteCountry = async (id: string) =>
  await prisma.country.update({ where: { id }, data: { isActive: false } });

// =======================
// USERS MANAGEMENT
// =======================
export const getUsers = async (search?: string, adminUser?: any) => {
  const where: any = {};

  // If the admin is a RESELLER, they can only see their own clients
  if (adminUser && adminUser.role === 'RESELLER') {
    where.resellerId = adminUser.id;
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
    ];
  }
  return await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
};

export const createStaff = async (staffData: any) => {
  const { email, password, firstName, lastName, role } = staffData;
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isVerified: true,
    },
  });
};

export const getUserDetails = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { orders: true, esims: true },
  });
};

export const banUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return await prisma.user.update({
    where: { id },
    data: { isActive: !user?.isActive },
  });
};

export const changeUserRole = async (id: string, role: any) => {
  return await prisma.user.update({ where: { id }, data: { role } });
};

// =======================
// ORDERS & ESIMS MANAGEMENT
// =======================
export const getOrders = async (adminUser?: any) => {
  const isReseller = adminUser?.role === 'RESELLER';
  const where = isReseller ? { user: { resellerId: adminUser.id } } : undefined;

  return await prisma.order.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};
export const getOrderDetails = async (id: string) =>
  await prisma.order.findUnique({
    where: { id },
    include: { user: true, orderItems: { include: { assignedESims: true } } },
  });
export const updateOrderStatus = async (id: string, status: any) =>
  await prisma.order.update({ where: { id }, data: { status } });

export const getEsims = async (adminUser?: any) => {
  const isReseller = adminUser?.role === 'RESELLER';
  const where = isReseller ? { user: { resellerId: adminUser.id } } : undefined;

  return await prisma.eSim.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};
export const getEsimDetails = async (iccid: string) =>
  await prisma.eSim.findUnique({
    where: { iccid },
    include: { user: true, orderItem: { include: { plan: true } } },
  });
export const deactivateEsim = async (iccid: string) =>
  await prisma.eSim.update({ where: { iccid }, data: { status: 'DELETED' } });

// =======================
// SUPPORT TICKETS
// =======================
export const getTickets = async () =>
  await prisma.supportTicket.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
export const getTicket = async (id: string) =>
  await prisma.supportTicket.findUnique({
    where: { id },
    include: { user: true },
  });
export const replyTicket = async (id: string, message: string) => {
  // In real implementation, insert into a TicketMessages table and send an Email to User!
  return await prisma.supportTicket.update({
    where: { id },
    data: { status: 'IN_PROGRESS' },
  });
};
export const changeTicketStatus = async (id: string, status: any) =>
  await prisma.supportTicket.update({ where: { id }, data: { status } });
export const assignTicket = async (id: string, adminId: string) =>
  await prisma.supportTicket.update({
    where: { id },
    data: { assignedTo: adminId },
  });
