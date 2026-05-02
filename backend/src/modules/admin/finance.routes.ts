import { Router } from 'express';
import { FinanceController } from './finance.controller';
import { verifyToken } from '../auth/auth.middleware';
import { requireAdmin } from './admin.middleware';

const router = Router();

// Ensure all these routes are protected
router.use(verifyToken, requireAdmin);

// Finance Summary
router.get('/summary', FinanceController.getSummary);
router.get('/revenue', FinanceController.getRevenue);
router.get('/ltv', FinanceController.getLTV);
router.get('/cohorts', FinanceController.getCohorts);

// Commissions
router.get('/commissions/pending', FinanceController.getPendingCommissions);
router.post('/commissions/payout', FinanceController.processPayout);

// Tax
router.get('/tax/report', FinanceController.getTaxReport);

export default router;
