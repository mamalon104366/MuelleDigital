import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const bullets = [
  { t: 'Experiencias verificadas', d: 'Guías y pescadores locales aprobados por nuestro equipo.' },
  { t: 'Reserva y paga fácil', d: 'Asegura tu cupo y paga con Nequi o Daviplata en segundos.' },
  { t: 'Punto de encuentro en el mapa', d: 'Sabe exactamente dónde inicia tu aventura fluvial.' },
];

// Layout de pantalla partida para Login y Registro (estilo moderno tipo Mapbox).
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Panel de marca (izquierda) */}
      <div className="relative hidden overflow-hidden bg-rio-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #449cab 0, transparent 40%), radial-gradient(circle at 80% 60%, #2c7f8f 0, transparent 45%)',
          }}
        />
        <Link to="/" className="relative z-10"><Logo size={48} textClass="text-white text-2xl" /></Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight">Vive el río Magdalena con confianza</h2>
          <ul className="mt-8 space-y-5">
            {bullets.map((b) => (
              <li key={b.t} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rio-400 text-sm">✓</span>
                <div>
                  <p className="font-semibold">{b.t}</p>
                  <p className="text-sm text-rio-100/80">{b.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-rio-100/70">© Muelle Digital · Ecoturismo fluvial · Barrancabermeja</p>
      </div>

      {/* Formulario (derecha) */}
      <div className="flex items-center justify-center bg-white px-6 py-12 dark:bg-rio-950">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block lg:hidden">
            <Logo size={40} textClass="text-rio-800 dark:text-white text-xl" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
