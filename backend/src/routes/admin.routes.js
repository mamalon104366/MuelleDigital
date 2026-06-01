import { Router } from 'express';
import {
  listUsuarios,
  updateRolUsuario,
  deleteUsuario,
  getMetrics,
} from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Todas las rutas de admin requieren rol admin
router.use(requireAuth, requireRole('admin'));

router.get('/metrics', getMetrics);
router.get('/usuarios', listUsuarios);
router.patch('/usuarios/:id/rol', updateRolUsuario);
router.delete('/usuarios/:id', deleteUsuario);

export default router;
