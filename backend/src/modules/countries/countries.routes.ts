import { Router } from 'express';
import { getAll, getPopular, getByCode, search } from './countries.controller';

const router = Router();

router.get('/popular', getPopular);
router.get('/search', search);
router.get('/:code', getByCode);
router.get('/', getAll);

export default router;
