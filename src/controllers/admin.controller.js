import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';

// GET /api/admin/usuarios — lista de usuarios con conteos (sin password)
export const listUsuarios = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.nombre, u.email, u.rol, u.telefono, u.created_at,
            COUNT(DISTINCT e.id) AS total_experiencias,
            COUNT(DISTINCT r.id) AS total_reservas
     FROM usuarios u
     LEFT JOIN experiencias e ON e.guia_id = u.id
     LEFT JOIN reservas r     ON r.usuario_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  res.json(rows);
});

// PATCH /api/admin/usuarios/:id/rol — cambiar rol de un usuario
export const updateRolUsuario = asyncHandler(async (req, res) => {
  const { rol } = req.body;
  if (!['turista', 'guia', 'admin'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido.' });
  }
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'No puedes cambiar tu propio rol.' });
  }

  const { rows } = await query(
    `UPDATE usuarios SET rol = $1 WHERE id = $2
     RETURNING id, nombre, email, rol, telefono, created_at`,
    [rol, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json(rows[0]);
});

// DELETE /api/admin/usuarios/:id — eliminar usuario (cascade borra sus datos)
export const deleteUsuario = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de admin.' });
  }
  const { rowCount } = await query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json({ ok: true, mensaje: 'Usuario eliminado.' });
});

// GET /api/admin/metrics — resumen global para el dashboard
export const getMetrics = asyncHandler(async (_req, res) => {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM usuarios)                              AS usuarios,
      (SELECT COUNT(*) FROM usuarios WHERE rol = 'guia')           AS guias,
      (SELECT COUNT(*) FROM usuarios WHERE rol = 'turista')        AS turistas,
      (SELECT COUNT(*) FROM experiencias)                          AS experiencias,
      (SELECT COUNT(*) FROM reservas)                              AS reservas,
      (SELECT COUNT(*) FROM ratings)                               AS resenas,
      (SELECT COUNT(*) FROM solicitudes_guia WHERE estado='pendiente') AS solicitudes_pendientes,
      (SELECT COALESCE(SUM(valor),0) FROM pagos WHERE estado='completado') AS ingresos
  `);
  res.json(rows[0]);
});
