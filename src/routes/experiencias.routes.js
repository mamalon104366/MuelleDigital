import { Router } from 'express';
import {
  listExperiencias,
  getExperiencia,
  createExperiencia,
  updateExperiencia,
  deleteExperiencia,
} from '../controllers/experiencias.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Públicas
router.get('/', listExperiencias);
router.get('/:id', getExperiencia);

// Solo guía o admin
router.post('/', requireAuth, requireRole('guia', 'admin'), createExperiencia);
router.put('/:id', requireAuth, requireRole('guia', 'admin'), updateExperiencia);
router.delete('/:id', requireAuth, requireRole('guia', 'admin'), deleteExperiencia);

export default router;
