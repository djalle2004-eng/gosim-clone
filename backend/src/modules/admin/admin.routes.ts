import { Router } from 'express';
import * as controller from './admin.controller';
import { requireAdmin, requireSuperAdmin, audit } from './admin.middleware';
import { verifyToken } from '../auth/auth.middleware';

const router = Router();

// Global Admin Protective Wrapper
router.use(verifyToken, requireAdmin);

// Dashboard
router.get('/stats', controller.getStats);
router.get('/analytics', controller.getAnalytics);
router.get('/recent-orders', controller.getRecentOrders);

// Plans
router.get('/plans', controller.getPlans);
router.post('/plans', audit('CREATE_PLAN', 'ESimPlan'), controller.createPlan);
router.put(
  '/plans/:id',
  audit('UPDATE_PLAN', 'ESimPlan'),
  controller.updatePlan
);
router.delete(
  '/plans/:id',
  audit('DELETE_PLAN', 'ESimPlan'),
  controller.deletePlan
);
router.patch(
  '/plans/:id/toggle',
  audit('TOGGLE_PLAN', 'ESimPlan'),
  controller.togglePlan
);
router.post(
  '/plans/sync',
  audit('SYNC_PLANS', 'ESimPlan'),
  controller.syncPlans
);

// Countries (Super Admin only for management)
router.get('/countries', requireSuperAdmin, controller.getCountries);
router.post(
  '/countries',
  requireSuperAdmin,
  audit('CREATE_COUNTRY', 'Country'),
  controller.createCountry
);
router.put(
  '/countries/:id',
  requireSuperAdmin,
  audit('UPDATE_COUNTRY', 'Country'),
  controller.updateCountry
);
router.delete(
  '/countries/:id',
  requireSuperAdmin,
  audit('DELETE_COUNTRY', 'Country'),
  controller.deleteCountry
);

// Users (Super Admin required for role mutations)
router.get('/users', controller.getUsers);
router.get('/users/:id', controller.getUserInfo);
router.patch(
  '/users/:id/ban',
  audit('TOGGLE_BAN', 'User'),
  controller.toggleBanUser
);
router.patch(
  '/users/:id/role',
  requireSuperAdmin,
  audit('CHANGE_ROLE', 'User'),
  controller.changeUserRole
);

// Orders
router.get('/orders', controller.getOrders);
router.get('/orders/:id', controller.getOrderDetails);
router.patch(
  '/orders/:id/status',
  audit('UPDATE_ORDER', 'Order'),
  controller.patchOrderStatus
);
router.post(
  '/orders/:id/refund',
  requireSuperAdmin,
  audit('REFUND_ORDER', 'Order'),
  controller.triggerRefund
);

// Esims
router.get('/esims', controller.getEsims);
router.get('/esims/:iccid', controller.getEsimDetails);
router.post(
  '/esims/:iccid/deactivate',
  audit('DEACTIVATE_ESIM', 'ESim'),
  controller.deactivateEsim
);

// Tickets
router.get('/tickets', controller.getTickets);
router.get('/tickets/:id', controller.getTicketDetails);
router.post(
  '/tickets/:id/reply',
  audit('REPLY_TICKET', 'Ticket'),
  controller.replyTicket
);
router.patch(
  '/tickets/:id/status',
  audit('UPDATE_TICKET', 'Ticket'),
  controller.patchTicketStatus
);
router.patch(
  '/tickets/:id/assign',
  audit('ASSIGN_TICKET', 'Ticket'),
  controller.assignTicketUser
);

export default router;
