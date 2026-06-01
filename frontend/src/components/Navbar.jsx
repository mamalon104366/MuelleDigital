import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${
      isActive
        ? 'bg-rio-50 text-rio-700 dark:bg-rio-800 dark:text-rio-100'
        : 'text-slate-600 hover:text-rio-700 dark:text-slate-300 dark:hover:text-rio-200'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-rio-800 dark:bg-rio-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/">
          <Logo size={38} textClass="text-rio-800 dark:text-white text-lg" />
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/experiencias" className={linkClass}>
            Experiencias
          </NavLink>

          {user && (
            <NavLink to="/mis-reservas" className={linkClass}>
              Mis reservas
            </NavLink>
          )}
          {user && user.rol === 'turista' && (
            <NavLink to="/solicitud-guia" className={linkClass}>
              Ser guía
            </NavLink>
          )}
          {user && (user.rol === 'guia' || user.rol === 'admin') && (
            <NavLink to="/guia" className={linkClass}>
              Panel guía
            </NavLink>
          )}
          {user && user.rol === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          <ThemeToggle />

          {user ? (
            <div className="ml-1 flex items-center gap-2">
              <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
                Hola, {user.nombre.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline px-3 py-1.5 text-sm">
                Salir
              </button>
            </div>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Link to="/login" className="btn-outline px-3 py-1.5 text-sm">
                Entrar
              </Link>
              <Link to="/registro" className="btn-primary px-3 py-1.5 text-sm">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
