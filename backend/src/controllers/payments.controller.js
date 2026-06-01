import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';
import { stripe, MONEDA, aUnidadMinima, comisionDe } from '../config/stripe.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Confirma el pago y la reserva a partir de una sesión de Stripe (idempotente).
// Se usa tanto desde el webhook como desde la verificación en el success_url.
const confirmarPorSession = async (session) => {
  const reservaId = session.metadata?.reserva_id;
  if (!reservaId) return;
  await query(
    `UPDATE pagos SET estado = 'completado', stripe_payment_intent = $1
     WHERE stripe_session_id = $2 AND estado <> 'completado'`,
    [session.payment_intent || null, session.id]
  );
  await query(`UPDATE reservas SET estado = 'confirmada' WHERE id = $1`, [reservaId]);
};

// POST /api/pagos/checkout — crea una Stripe Checkout Session para una reserva
export const crearCheckout = asyncHandler(async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe no está configurado en el servidor.' });

  const { reserva_id } = req.body;
  const { rows } = await query(
    `SELECT r.*, e.titulo, e.precio, e.stripe_price_id, e.id AS exp_id
     FROM reservas r JOIN experiencias e ON e.id = r.experiencia_id
     WHERE r.id = $1`,
    [reserva_id]
  );
  const reserva = rows[0];
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });
  if (reserva.usuario_id !== req.user.id) {
    return res.status(403).json({ error: 'No puedes pagar una reserva ajena.' });
  }

  const valor = Number(reserva.precio) * reserva.personas;

  // Usa el precio de Stripe si existe; si no, crea uno en línea.
  const lineItem = reserva.stripe_price_id
    ? { price: reserva.stripe_price_id, quantity: reserva.personas }
    : {
        price_data: {
          currency: MONEDA,
          product_data: { name: reserva.titulo },
          unit_amount: aUnidadMinima(reserva.precio),
        },
        quantity: reserva.personas,
      };

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [lineItem],
    success_url: `${CLIENT_URL}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/experiencias/${reserva.exp_id}?pago=cancelado`,
    metadata: { reserva_id: String(reserva.id), usuario_id: String(req.user.id) },
  });

  // Registra el pago como pendiente (se confirma en webhook/verificación).
  await query(
    `INSERT INTO pagos (reserva_id, metodo_pago, estado, valor, comision, stripe_session_id, referencia)
     VALUES ($1, 'stripe', 'pendiente', $2, $3, $4, $5)`,
    [reserva.id, valor, comisionDe(valor), session.id, session.id.slice(-12)]
  );

  res.json({ url: session.url });
});

// GET /api/pagos/verificar/:session_id — confirma desde el success_url (sin depender del webhook)
export const verificarPago = asyncHandler(async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe no configurado.' });
  const session = await stripe.checkout.sessions.retrieve(req.params.session_id);
  if (session.payment_status === 'paid') {
    await confirmarPorSession(session);
    return res.json({ estado: 'completado' });
  }
  res.json({ estado: session.payment_status });
});

// POST /api/stripe/webhook — eventos de Stripe (raw body). Confirma pagos en producción.
export const webhook = async (req, res) => {
  if (!stripe) return res.status(503).end();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = whSecret
      ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], whSecret)
      : JSON.parse(req.body.toString()); // sin secret (solo dev): no verifica firma
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    try {
      await confirmarPorSession(event.data.object);
    } catch (err) {
      console.error('❌ Error confirmando pago por webhook:', err.message);
    }
  }
  res.json({ received: true });
};
