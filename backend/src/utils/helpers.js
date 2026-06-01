import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_inseguro_cambiame';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Genera un token JWT para un usuario.
export const signToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

// Envuelve controladores async para capturar errores sin try/catch repetido.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Quita el password_hash antes de enviar el usuario al cliente.
export const publicUser = (u) => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  rol: u.rol,
  telefono: u.telefono,
  created_at: u.created_at,
});
