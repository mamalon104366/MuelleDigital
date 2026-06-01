import { verifyToken } from '../utils/helpers.js';

// Verifica el JWT del header Authorization: Bearer <token>
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado. Falta el token.' });
  }

  try {
    req.user = verifyToken(token); // { id, rol, nombre }
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Restringe el acceso a ciertos roles. Uso: requireRole('guia', 'admin')
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
  }
  next();
};
