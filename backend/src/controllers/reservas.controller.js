import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';

// POST /api/reservas — solo turista
export const createReserva = asyncHandler(async (req, res) => {
  const { experiencia_id, fecha, personas } = req.body;
  const cantidad = Number(personas) || 1;

  if (!experiencia_id || !fecha) {
    return res.status(400).json({ error: 'experiencia_id y fecha son obligatorios.' });
  }

  const { rows: expRows } = await query('SELECT * FROM experiencias WHERE id = $1', [experiencia_id]);
  const exp = expRows[0];
  if (!exp) return res.status(404).json({ error: 'Experiencia no encontrada.' });

  // Cupos ya tomados (reservas pendientes o confirmadas)
  const { rows: ocupadosRows } = await query(
    `SELECT COALESCE(SUM(personas), 0) AS ocupados
     FROM reservas
     WHERE experiencia_id = $1 AND estado IN ('pendiente', 'confirmada')`,
    [experiencia_id]
  );
  const disponibles = exp.cupos - Number(ocupadosRows[0].ocupados);

  if (cantidad > disponibles) {
    return res.status(409).json({ error: `No hay cupos suficientes. Disponibles: ${disponibles}.` });
  }

  const { rows } = await query(
    `INSERT INTO reservas (usuario_id, experiencia_id, fecha, personas)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.user.id, experiencia_id, fecha, cantidad]
  );

  res.status(201).json(rows[0]);
});

// GET /api/reservas — turista: las suyas · guía: de sus experiencias · admin: todas
export const listReservas = asyncHandler(async (req, res) => {
  const base = `
    SELECT r.*,
           e.titulo    AS experiencia_titulo,
           e.precio    AS experiencia_precio,
           e.imagen    AS experiencia_imagen,
           e.guia_id   AS guia_id,
           u.nombre    AS turista_nombre
    FROM reservas r
    JOIN experiencias e ON e.id = r.experiencia_id
    JOIN usuarios u     ON u.id = r.usuario_id`;

  let rows;
  if (req.user.rol === 'admin') {
    ({ rows } = await query(`${base} ORDER BY r.created_at DESC`));
  } else if (req.user.rol === 'guia') {
    ({ rows } = await query(`${base} WHERE e.guia_id = $1 ORDER BY r.created_at DESC`, [req.user.id]));
  } else {
    ({ rows } = await query(`${base} WHERE r.usuario_id = $1 ORDER BY r.created_at DESC`, [req.user.id]));
  }

  res.json(rows);
});

// PATCH /api/reservas/:id/estado — guía dueño o admin
export const updateEstadoReserva = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const validos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  if (!validos.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Usa: ${validos.join(', ')}.` });
  }

  const { rows: rRows } = await query(
    `SELECT r.*, e.guia_id FROM reservas r
     JOIN experiencias e ON e.id = r.experiencia_id
     WHERE r.id = $1`,
    [req.params.id]
  );
  const reserva = rRows[0];
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });
  if (req.user.rol !== 'admin' && reserva.guia_id !== req.user.id) {
    return res.status(403).json({ error: 'Solo el guía dueño puede cambiar el estado.' });
  }

  const { rows } = await query(
    'UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *',
    [estado, req.params.id]
  );
  res.json(rows[0]);
});
