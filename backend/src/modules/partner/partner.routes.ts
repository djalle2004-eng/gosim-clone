import { Router } from 'express';
import { authenticateApiKey } from '../../middleware/authenticateApiKey';
import {
  getPlans,
  getPlanById,
  createOrder,
  getOrderStatus,
  cancelOrder,
  getEsims,
  getEsimDetails,
  getEsimQrCode,
  topupEsim,
  getEsimUsage,
  addWebhook,
  getWebhooks,
  deleteWebhook,
  getBalance,
  topupBalance,
} from './partner.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 */

/**
 * @swagger
 * /v1/partner/plans:
 *   get:
 *     summary: Retrieve a list of eSIM plans
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of plans.
 */
router.get('/plans', authenticateApiKey(['plans:read']), getPlans);
router.get('/plans/:id', authenticateApiKey(['plans:read']), getPlanById);

router.post('/orders', authenticateApiKey(['orders:create']), createOrder);
router.get('/orders/:id', authenticateApiKey(['orders:read']), getOrderStatus);
router.post(
  '/orders/:id/cancel',
  authenticateApiKey(['orders:create']),
  cancelOrder
);

router.get('/esims', authenticateApiKey(['esims:read']), getEsims);
router.get('/esims/:iccid', authenticateApiKey(['esims:read']), getEsimDetails);
router.get(
  '/esims/:iccid/qrcode',
  authenticateApiKey(['esims:read']),
  getEsimQrCode
);
router.post(
  '/esims/:iccid/topup',
  authenticateApiKey(['esims:manage']),
  topupEsim
);
router.get(
  '/esims/:iccid/usage',
  authenticateApiKey(['esims:read']),
  getEsimUsage
);

router.post('/webhooks', authenticateApiKey(['webhooks:write']), addWebhook);
router.get('/webhooks', authenticateApiKey(['webhooks:read']), getWebhooks);
router.delete(
  '/webhooks/:id',
  authenticateApiKey(['webhooks:write']),
  deleteWebhook
);

router.get('/balance', authenticateApiKey(), getBalance);
router.post('/balance/topup', authenticateApiKey(), topupBalance);

export default router;
