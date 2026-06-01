import { query } from '../config/db.js';
import { asyncHandler } from '../utils/helpers.js';
import { crearProductoYPrecio } from '../config/stripe.js';

// GET /api/experiencias  — lista pública con filtros opcionales
// query params: q, ubicacion, temporada, categoria, precio_min, precio_max
export const listExperiencias = asyncHandler(async (req, res) => {
  const { q, ubicacion, temporada, categoria, precio_min, precio_max } = req.query;

  const where = [];
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    where.push(`(e.titulo ILIKE $${params.length} OR e.descripcion ILIKE $${params.length})`);
  }
  if (ubicacion) {
    params.push(`%${ubicacion}%`);
    where.push(`e.ubicacion ILIKE $${params.length}`);
  }
  if (temporada) {
    params.push(`%${temporada}%`);
    where.push(`e.temporada ILIKE $${params.length}`);
  }
  if (categoria) {
    params.push(`%${categoria}%`);
    where.push(`e.categoria ILIKE $${params.length}`);
  }
  if (precio_min) {
    params.push(Number(precio_min));
    where.push(`e.precio >= $${params.length}`);
  }
  if (precio_max) {
    params.push(Number(precio_max));
    where.push(`e.precio <= $${params.length}`);
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT e.*,
            u.nombre AS guia_nombre,
            COALESCE(ROUND(AVG(r.puntuacion), 1), 0) AS rating_promedio,
            COUNT(r.id)                              AS total_resenas
     FROM experiencias e
     JOIN usuarios u ON u.id = e.guia_id
     LEFT JOIN ratings r ON r.experiencia_id = e.id
     ${whereSQL}
     GROUP BY e.id, u.nombre
     ORDER BY e.created_at DESC`,
    params
  );

  res.json(rows);
});

// GET /api/experiencias/:id — detalle + rating
export const getExperiencia = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT e.*,
            u.nombre   AS guia_nombre,
            u.telefono AS guia_telefono,
            COALESCE(ROUND(AVG(r.puntuacion), 1), 0) AS rating_promedio,
            COUNT(r.id)                              AS total_resenas
     FROM experiencias e
     JOIN usuarios u ON u.id = e.guia_id
     LEFT JOIN ratings r ON r.experiencia_id = e.id
     WHERE e.id = $1
     GROUP BY e.id, u.nombre, u.telefono`,
    [req.params.id]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Experiencia no encontrada.' });
  res.json(rows[0]);
});

// POST /api/experiencias — solo guía/admin
export const createExperiencia = asyncHandler(async (req, res) => {
  const { titulo, descripcion, precio, ubicacion, temporada, categoria, cupos,
          imagen, lat, lng, punto_encuentro } = req.body;

  if (!titulo || !descripcion || precio == null || !ubicacion) {
    return res.status(400).json({ error: 'Título, descripción, precio y ubicación son obligatorios.' });
  }

  const { rows } = await query(
    `INSERT INTO experiencias
       (titulo, descripcion, precio, ubicacion, temporada, categoria, guia_id, cupos,
        imagen, lat, lng, punto_encuentro)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [titulo, descripcion, precio, ubicacion, temporada || null, categoria || null,
     req.user.id, cupos ?? 0, imagen || null,
     lat ?? null, lng ?? null, punto_encuentro || null]
  );

  let experiencia = rows[0];

  // Crea Producto + Precio en Stripe (best-effort: si falla, no rompe el alta).
  try {
    const { stripe_product_id, stripe_price_id } = await crearProductoYPrecio({
      nombre: titulo, descripcion, precio,
    });
    if (stripe_price_id) {
      const upd = await query(
        `UPDATE experiencias SET stripe_product_id = $1, stripe_price_id = $2
         WHERE id = $3 RETURNING *`,
        [stripe_product_id, stripe_price_id, experiencia.id]
      );
      experiencia = upd.rows[0];
    }
  } catch (err) {
    console.warn('⚠️  No se pudo crear el producto en Stripe:', err.message);
  }

  res.status(201).json(experiencia);
});

// PUT /api/experiencias/:id — dueño o admin
export const updateExperiencia = asyncHandler(async (req, res) => {
  const { rows: existing } = await query('SELECT * FROM experiencias WHERE id = $1', [req.params.id]);
  const exp = existing[0];
  if (!exp) return res.status(404).json({ error: 'Experiencia no encontrada.' });
  if (req.user.rol !== 'admin' && exp.guia_id !== req.user.id) {
    return res.status(403).json({ error: 'Solo el guía dueño puede editar esta experiencia.' });
  }

  const { titulo, descripcion, precio, ubicacion, temporada, categoria, cupos,
          imagen, lat, lng, punto_encuentro } = req.body;

  const { rows } = await query(
    `UPDATE experiencias SET
       titulo          = COALESCE($1, titulo),
       descripcion     = COALESCE($2, descripcion),
       precio          = COALESCE($3, precio),
       ubicacion       = COALESCE($4, ubicacion),
       temporada       = COALESCE($5, temporada),
       categoria       = COALESCE($6, categoria),
       cupos           = COALESCE($7, cupos),
       imagen          = COALESCE($8, imagen),
       lat             = COALESCE($9, lat),
       lng             = COALESCE($10, lng),
       punto_encuentro = COALESCE($11, punto_encuentro)
     WHERE id = $12
     RETURNING *`,
    [titulo, descripcion, precio, ubicacion, temporada, categoria, cupos, imagen,
     lat, lng, punto_encuentro, req.params.id]
  );

  res.json(rows[0]);
});

// DELETE /api/experiencias/:id — dueño o admin
export const deleteExperiencia = asyncHandler(async (req, res) => {
  const { rows: existing } = await query('SELECT * FROM experiencias WHERE id = $1', [req.params.id]);
  const exp = existing[0];
  if (!exp) return res.status(404).json({ error: 'Experiencia no encontrada.' });
  if (req.user.rol !== 'admin' && exp.guia_id !== req.user.id) {
    return res.status(403).json({ error: 'Solo el guía dueño puede eliminar esta experiencia.' });
  }

  await query('DELETE FROM experiencias WHERE id = $1', [req.params.id]);
  res.json({ ok: true, mensaje: 'Experiencia eliminada.' });
});
