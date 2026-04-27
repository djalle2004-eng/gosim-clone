import { Router } from 'express';
import { createIntent, confirmOrder } from './checkout.controller';
import { verifyToken } from '../auth/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/create-intent', createIntent);
router.post('/confirm', confirmOrder);

export default router;
