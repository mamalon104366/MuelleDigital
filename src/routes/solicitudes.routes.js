import { Router } from 'express';
import {
  createSolicitud,
  getMiSolicitud,
  listSolicitudes,
  resolveSolicitud,
} from '../controllers/solicitudes.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Usuario autenticado
router.post('/', requireAuth, createSolicitud);
router.get('/mia', requireAuth, getMiSolicitud);

// Admin
router.get('/', requireAuth, requireRole('admin'), listSolicitudes);
router.patch('/:id', requireAuth, requireRole('admin'), resolveSolicitud);

export default router;
