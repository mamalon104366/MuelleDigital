import { Router } from 'express';
import { listRatings, createRating } from '../controllers/ratings.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listRatings);
router.post('/', requireAuth, requireRole('turista'), createRating);

export default router;
