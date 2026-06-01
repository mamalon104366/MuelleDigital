import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protege rutas: exige sesión y, opcionalmente, ciertos roles.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Cargando…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
