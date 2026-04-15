import { Request, Response } from 'express';
import * as adminService from './admin.service';
import { refundOrder } from '../orders/orders.service';

// Dashboard
export const getStats = async (req: Request, res: Response) =>
  res.json(await adminService.getStats());
export const getAnalytics = async (req: Request, res: Response) =>
  res.json(await adminService.getAnalytics());
export const getRecentOrders = async (req: Request, res: Response) =>
  res.json(await adminService.getRecentOrders());

// Plans
export const getPlans = async (req: Request, res: Response) =>
  res.json(await adminService.getAllPlans());
export const createPlan = async (req: Request, res: Response) =>
  res.json(await adminService.createPlan(req.body));
export const updatePlan = async (req: Request, res: Response) =>
  res.json(await adminService.updatePlan(req.params.id, req.body));
export const deletePlan = async (req: Request, res: Response) =>
  res.json(await adminService.deletePlan(req.params.id));
export const togglePlan = async (req: Request, res: Response) =>
  res.json(await adminService.togglePlanState(req.params.id));
export const syncPlans = async (req: Request, res: Response) =>
  res.json(await adminService.syncProviderPlans());

// Countries
export const getCountries = async (req: Request, res: Response) =>
  res.json(await adminService.getCountries());
export const createCountry = async (req: Request, res: Response) =>
  res.json(await adminService.createCountry(req.body));
export const updateCountry = async (req: Request, res: Response) =>
  res.json(await adminService.updateCountry(req.params.id, req.body));
export const deleteCountry = async (req: Request, res: Response) =>
  res.json(await adminService.deleteCountry(req.params.id));

// Users
export const getUsers = async (req: Request, res: Response) =>
  res.json(await adminService.getUsers(req.query.q as string));
export const getUserInfo = async (req: Request, res: Response) =>
  res.json(await adminService.getUserDetails(req.params.id));
export const toggleBanUser = async (req: Request, res: Response) =>
  res.json(await adminService.banUser(req.params.id));
export const changeUserRole = async (req: Request, res: Response) =>
  res.json(await adminService.changeUserRole(req.params.id, req.body.role));

// Orders
export const getOrders = async (req: Request, res: Response) =>
  res.json(await adminService.getOrders());
export const getOrderDetails = async (req: Request, res: Response) =>
  res.json(await adminService.getOrderDetails(req.params.id));
export const patchOrderStatus = async (req: Request, res: Response) =>
  res.json(
    await adminService.updateOrderStatus(req.params.id, req.body.status)
  );
export const triggerRefund = async (req: Request, res: Response) => {
  try {
    await refundOrder(req.params.id);
    return res.json({ message: 'Refunded' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

// eSIMs
export const getEsims = async (req: Request, res: Response) =>
  res.json(await adminService.getEsims());
export const getEsimDetails = async (req: Request, res: Response) =>
  res.json(await adminService.getEsimDetails(req.params.iccid));
export const deactivateEsim = async (req: Request, res: Response) =>
  res.json(await adminService.deactivateEsim(req.params.iccid));

// Tickets
export const getTickets = async (req: Request, res: Response) =>
  res.json(await adminService.getTickets());
export const getTicketDetails = async (req: Request, res: Response) =>
  res.json(await adminService.getTicket(req.params.id));
export const replyTicket = async (req: Request, res: Response) =>
  res.json(await adminService.replyTicket(req.params.id, req.body.message));
export const patchTicketStatus = async (req: Request, res: Response) =>
  res.json(
    await adminService.changeTicketStatus(req.params.id, req.body.status)
  );
export const assignTicketUser = async (req: Request, res: Response) =>
  res.json(
    await adminService.assignTicket(req.params.id, (req as any).user.id)
  );
