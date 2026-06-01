import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';

// Genera una referencia de comprobante simple.
const generarReferencia = (metodo) =>
  `${metodo.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

// POST /api/pagos — turista paga una reserva (Nequi/Daviplata simulado)
export const createPago = asyncHandler(async (req, res) => {
  const { reserva_id, metodo_pago } = req.body;

  if (!['nequi', 'daviplata'].includes(metodo_pago)) {
    return res.status(400).json({ error: 'metodo_pago debe ser "nequi" o "daviplata".' });
  }

  // La reserva debe existir y pertenecer al usuario
  const { rows: rRows } = await query(
    `SELECT r.*, e.precio FROM reservas r
     JOIN experiencias e ON e.id = r.experiencia_id
     WHERE r.id = $1`,
    [reserva_id]
  );
  const reserva = rRows[0];
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });
  if (reserva.usuario_id !== req.user.id) {
    return res.status(403).json({ error: 'No puedes pagar una reserva ajena.' });
  }

  const valor = Number(reserva.precio) * reserva.personas;
  const referencia = generarReferencia(metodo_pago);

  // Pago simulado: se marca como completado y la reserva pasa a confirmada
  const { rows } = await query(
    `INSERT INTO pagos (reserva_id, metodo_pago, estado, valor, referencia)
     VALUES ($1, $2, 'completado', $3, $4)
     RETURNING *`,
    [reserva_id, metodo_pago, valor, referencia]
  );

  await query("UPDATE reservas SET estado = 'confirmada' WHERE id = $1", [reserva_id]);

  res.status(201).json({
    pago: rows[0],
    comprobante: { referencia, valor, metodo_pago, estado: 'completado' },
  });
});

// GET /api/pagos — pagos del usuario (admin ve todos)
export const listPagos = asyncHandler(async (req, res) => {
  const base = `
    SELECT p.*, r.usuario_id, e.titulo AS experiencia_titulo
    FROM pagos p
    JOIN reservas r     ON r.id = p.reserva_id
    JOIN experiencias e ON e.id = r.experiencia_id`;

  let rows;
  if (req.user.rol === 'admin') {
    ({ rows } = await query(`${base} ORDER BY p.fecha DESC`));
  } else {
    ({ rows } = await query(`${base} WHERE r.usuario_id = $1 ORDER BY p.fecha DESC`, [req.user.id]));
  }

  res.json(rows);
});
