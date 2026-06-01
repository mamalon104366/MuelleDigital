import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken, asyncHandler, publicUser } from '../utils/helpers.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { nombre, email, password, telefono, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  // SEGURIDAD: el registro siempre crea un turista. El rol "guía" solo lo
  // otorga el admin al aprobar una solicitud (ver solicitudes_guia). "admin"
  // jamás se asigna por aquí. El parámetro `rol` se ignora a propósito.
  const hash = await bcrypt.hash(password, 10);

  const { rows } = await query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol, telefono)
     VALUES ($1, $2, $3, 'turista', $4)
     RETURNING *`,
    [nombre, email.toLowerCase().trim(), hash, telefono || null]
  );

  const usuario = rows[0];
  res.status(201).json({ token: signToken(usuario), user: publicUser(usuario) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  const { rows } = await query('SELECT * FROM usuarios WHERE email = $1', [
    email.toLowerCase().trim(),
  ]);
  const usuario = rows[0];

  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  res.json({ token: signToken(usuario), user: publicUser(usuario) });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json({ user: publicUser(rows[0]) });
});
