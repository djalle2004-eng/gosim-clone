import { Router } from 'express';
import { verifyToken } from '../auth/auth.middleware';
import { requireSuperAdmin, audit } from '../admin/admin.middleware';
import {
  getSettings,
  getRegistry,
  updateProviderSettings,
  testProviderConnection,
} from './settings.controller';

const router = Router();

// All settings routes are SUPER_ADMIN only
router.use(verifyToken, requireSuperAdmin);

// GET full settings (merged with registry, secrets masked)
router.get('/', getSettings);

// GET static registry (provider definitions)
router.get('/registry', getRegistry);

// PUT update a provider's keys
router.put(
  '/:category/:provider',
  audit('UPDATE', 'system_settings'),
  updateProviderSettings
);

// POST test a provider connection
router.post('/test/:category/:provider', testProviderConnection);

export default router;
