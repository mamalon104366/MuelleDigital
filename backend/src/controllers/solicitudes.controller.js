import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';

// POST /api/solicitudes — un usuario pide ser guía (llena el formulario de seguridad)
export const createSolicitud = asyncHandler(async (req, res) => {
  const { nombre_completo, documento, telefono, zona, experiencia_previa, descripcion } = req.body;

  if (req.user.rol === 'guia' || req.user.rol === 'admin') {
    return res.status(409).json({ error: 'Tu cuenta ya tiene permisos para crear experiencias.' });
  }
  if (!nombre_completo || !documento || !telefono || !zona || !descripcion) {
    return res.status(400).json({ error: 'Completa todos los campos obligatorios del formulario.' });
  }

  // Evita solicitudes duplicadas en estado pendiente
  const { rows: prev } = await query(
    `SELECT id FROM solicitudes_guia WHERE usuario_id = $1 AND estado = 'pendiente'`,
    [req.user.id]
  );
  if (prev.length) {
    return res.status(409).json({ error: 'Ya tienes una solicitud pendiente de revisión.' });
  }

  const { rows } = await query(
    `INSERT INTO solicitudes_guia
       (usuario_id, nombre_completo, documento, telefono, zona, experiencia_previa, descripcion)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [req.user.id, nombre_completo, documento, telefono, zona, experiencia_previa || null, descripcion]
  );

  res.status(201).json(rows[0]);
});

// GET /api/solicitudes/mia — estado de la solicitud del usuario actual
export const getMiSolicitud = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM solicitudes_guia WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [req.user.id]
  );
  res.json(rows[0] || null);
});

// GET /api/solicitudes — admin lista todas (opcional ?estado=pendiente)
export const listSolicitudes = asyncHandler(async (req, res) => {
  const { estado } = req.query;
  const params = [];
  let where = '';
  if (estado) {
    params.push(estado);
    where = `WHERE s.estado = $1`;
  }

  const { rows } = await query(
    `SELECT s.*, u.email AS usuario_email
     FROM solicitudes_guia s
     JOIN usuarios u ON u.id = s.usuario_id
     ${where}
     ORDER BY (s.estado = 'pendiente') DESC, s.created_at DESC`,
    params
  );
  res.json(rows);
});

// PATCH /api/solicitudes/:id — admin aprueba o rechaza
export const resolveSolicitud = asyncHandler(async (req, res) => {
  const { estado, motivo_rechazo } = req.body;
  if (!['aprobada', 'rechazada'].includes(estado)) {
    return res.status(400).json({ error: 'estado debe ser "aprobada" o "rechazada".' });
  }

  const { rows: sRows } = await query('SELECT * FROM solicitudes_guia WHERE id = $1', [req.params.id]);
  const solicitud = sRows[0];
  if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada.' });
  if (solicitud.estado !== 'pendiente') {
    return res.status(409).json({ error: 'Esta solicitud ya fue resuelta.' });
  }

  const { rows } = await query(
    `UPDATE solicitudes_guia
       SET estado = $1, motivo_rechazo = $2, resuelta_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [estado, estado === 'rechazada' ? motivo_rechazo || null : null, req.params.id]
  );

  // Si se aprueba, el usuario pasa a ser guía (puede publicar experiencias).
  if (estado === 'aprobada') {
    await query(`UPDATE usuarios SET rol = 'guia' WHERE id = $1`, [solicitud.usuario_id]);
  }

  res.json(rows[0]);
});
