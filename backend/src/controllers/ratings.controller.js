import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';

// GET /api/ratings?experiencia_id=  — reseñas públicas de una experiencia
export const listRatings = asyncHandler(async (req, res) => {
  const { experiencia_id } = req.query;
  if (!experiencia_id) {
    return res.status(400).json({ error: 'experiencia_id es obligatorio.' });
  }

  const { rows } = await query(
    `SELECT r.*, u.nombre AS usuario_nombre
     FROM ratings r
     JOIN usuarios u ON u.id = r.usuario_id
     WHERE r.experiencia_id = $1
     ORDER BY r.created_at DESC`,
    [experiencia_id]
  );

  res.json(rows);
});

// POST /api/ratings — solo turista (una reseña por experiencia)
export const createRating = asyncHandler(async (req, res) => {
  const { experiencia_id, puntuacion, comentario } = req.body;

  if (!experiencia_id || !puntuacion) {
    return res.status(400).json({ error: 'experiencia_id y puntuacion son obligatorios.' });
  }
  if (puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5.' });
  }

  // upsert: si ya calificó, actualiza su reseña
  const { rows } = await query(
    `INSERT INTO ratings (usuario_id, experiencia_id, puntuacion, comentario)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (usuario_id, experiencia_id)
     DO UPDATE SET puntuacion = EXCLUDED.puntuacion,
                   comentario = EXCLUDED.comentario,
                   created_at = NOW()
     RETURNING *`,
    [req.user.id, experiencia_id, puntuacion, comentario || null]
  );

  res.status(201).json(rows[0]);
});
