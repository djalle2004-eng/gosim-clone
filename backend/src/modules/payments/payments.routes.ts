import { Router } from 'express';
import {
  createIntent,
  createSession,
  webhook,
  simulateSuccess,
} from './payments.controller';
import { verifyToken } from '../auth/auth.middleware';

const router = Router();

// STRIPE WEBHOOK (Needs to be public and unprotected by JWT!)
router.post('/webhook', webhook);

// Protect the rest of the endpoints
router.use(verifyToken);

router.post('/create-intent', createIntent);
router.post('/create-session', createSession);
router.post('/simulate-success', simulateSuccess);

export default router;
