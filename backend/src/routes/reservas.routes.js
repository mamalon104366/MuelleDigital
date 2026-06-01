import { Router } from 'express';
import {
  createReserva,
  listReservas,
  updateEstadoReserva,
} from '../controllers/reservas.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('turista'), createReserva);
router.get('/', requireAuth, listReservas);
router.patch('/:id/estado', requireAuth, requireRole('guia', 'admin'), updateEstadoReserva);

export default router;
