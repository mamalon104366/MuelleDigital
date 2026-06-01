import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;

const estadoBadge = {
  pendiente: 'bg-amber-50 text-amber-700',
  confirmada: 'bg-green-50 text-green-700',
  cancelada: 'bg-red-50 text-red-700',
  completada: 'bg-rio-50 text-rio-700',
};

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reservas')
      .then((res) => setReservas(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mis reservas</h1>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Cargando…</p>
      ) : reservas.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-slate-500">Todavía no tienes reservas.</p>
          <Link to="/experiencias" className="btn-primary mt-4">
            Explorar experiencias
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reservas.map((r) => (
            <div key={r.id} className="card flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rio-100">
                {r.experiencia_imagen ? (
                  <img src={r.experiencia_imagen} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-rio-300">🛶</div>
                )}
              </div>
              <div className="flex-1">
                <Link to={`/experiencias/${r.experiencia_id}`} className="font-semibold text-slate-800 hover:underline dark:text-white">
                  {r.experiencia_titulo}
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  📅 {new Date(r.fecha).toLocaleDateString('es-CO')} · {r.personas} persona(s)
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-rio-700 dark:text-rio-300">{money(r.experiencia_precio * r.personas)}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadge[r.estado]}`}>
                  {r.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
