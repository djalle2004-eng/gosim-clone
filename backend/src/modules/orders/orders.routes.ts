import { Router } from 'express';
import { create, getHistory, getDetails, cancel, refund } from './orders.controller';
import { verifyToken } from '../auth/auth.middleware'; // Requires users to be logged in!

const router = Router();

router.use(verifyToken); // All endpoints require JWT session

router.post('/', create);
router.get('/', getHistory);
router.get('/:id', getDetails);
router.post('/:id/cancel', cancel);

// Admin Action
router.post('/:id/refund', refund);

export default router;
