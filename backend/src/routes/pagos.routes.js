import { Router } from 'express';
import { createPago, listPagos } from '../controllers/pagos.controller.js';
import { crearCheckout, verificarPago } from '../controllers/payments.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Pagos simulados (Nequi/Daviplata)
router.post('/', requireAuth, requireRole('turista'), createPago);
router.get('/', requireAuth, listPagos);

// Pagos reales con Stripe
router.post('/checkout', requireAuth, requireRole('turista'), crearCheckout);
router.get('/verificar/:session_id', requireAuth, verificarPago);

export default router;
