import { Router } from 'express';
import { listPlans, getPopular, getBySlug, getByCountry, getByRegion } from './plans.controller';

const router = Router();

router.get('/popular', getPopular);
router.get('/search', listPlans); // Search is handled via listPlans ?q= param natively
router.get('/country/:code', getByCountry);
router.get('/region/:region', getByRegion);
router.get('/:slug', getBySlug);
router.get('/', listPlans);

export default router;
