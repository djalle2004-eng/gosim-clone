import { Request, Response } from 'express';
import prisma from '../../lib/db';

const sendResponse = (req: Request, res: Response, data: any, meta: any = null, status = 200) => {
  res.status(status).json({
    success: true,
    data,
    meta,
    requestId: req.headers['x-request-id'] || `req_${Date.now()}`
  });
};

export const getPlans = async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [plans, total] = await Promise.all([
    prisma.eSimPlan.findMany({ skip, take: Number(limit) }),
    prisma.eSimPlan.count()
  ]);

  sendResponse(req, res, plans, { page: Number(page), limit: Number(limit), total });
};

export const getPlanById = async (req: Request, res: Response) => {
  const plan = await prisma.eSimPlan.findUnique({ where: { id: req.params.id } });
  if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
  sendResponse(req, res, plan);
};

export const createOrder = async (req: Request, res: Response) => {
  const { planId, quantity = 1 } = req.body;
  const partner = (req as any).partner;

  // In a real scenario, this would create an order, deduct balance, and provision eSIM.
  // We'll mock the response structure.
  sendResponse(req, res, { orderId: `ord_${Date.now()}`, status: 'PROCESSING', planId, quantity }, null, 201);
};

export const getOrderStatus = async (req: Request, res: Response) => {
  sendResponse(req, res, { id: req.params.id, status: 'COMPLETED' });
};

export const cancelOrder = async (req: Request, res: Response) => {
  sendResponse(req, res, { id: req.params.id, status: 'CANCELED' });
};

export const getEsims = async (req: Request, res: Response) => {
  sendResponse(req, res, [], { page: 1, limit: 20, total: 0 });
};

export const getEsimDetails = async (req: Request, res: Response) => {
  sendResponse(req, res, { iccid: req.params.iccid, status: 'ACTIVE', dataTotal: 5000, dataUsed: 1200 });
};

export const getEsimQrCode = async (req: Request, res: Response) => {
  sendResponse(req, res, { iccid: req.params.iccid, qrCodeUrl: 'https://api.gosim.dz/qrcodes/mock.png' });
};

export const topupEsim = async (req: Request, res: Response) => {
  sendResponse(req, res, { iccid: req.params.iccid, status: 'TOPUP_PROCESSING' });
};

export const getEsimUsage = async (req: Request, res: Response) => {
  sendResponse(req, res, { iccid: req.params.iccid, usageMB: 1200, totalMB: 5000 });
};

export const addWebhook = async (req: Request, res: Response) => {
  const { url, events } = req.body;
  const partner = (req as any).partner;
  
  const webhook = await prisma.webhookEndpoint.create({
    data: {
      userId: partner.userId,
      url,
      events,
      secret: `whsec_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    }
  });

  sendResponse(req, res, webhook, null, 201);
};

export const getWebhooks = async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  const webhooks = await prisma.webhookEndpoint.findMany({ where: { userId: partner.userId } });
  sendResponse(req, res, webhooks);
};

export const deleteWebhook = async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  await prisma.webhookEndpoint.deleteMany({
    where: { id: req.params.id, userId: partner.userId }
  });
  sendResponse(req, res, { deleted: true });
};

export const getBalance = async (req: Request, res: Response) => {
  sendResponse(req, res, { balance: 500.00, currency: 'USD' });
};

export const topupBalance = async (req: Request, res: Response) => {
  sendResponse(req, res, { message: 'Invoice generated. Please pay to update balance.', amount: req.body.amount });
};
