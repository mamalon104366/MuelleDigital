import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import ExperienceDetailPanel from '../components/ExperienceDetailPanel.jsx';
import RatingStars from '../components/RatingStars.jsx';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;
const tiempo = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso)) / 3.6e6);
  if (h < 1) return 'hace minutos';
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
};

export default function Home() {
  const navigate = useNavigate();
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  const [filtros, setFiltros] = useState({ q: '', ubicacion: '', categoria: '', precio_max: '' });

  const cargar = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const limpio = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
      const { data } = await api.get('/experiencias', { params: limpio });
      setExperiencias(data);
      setSeleccion((prev) => (data.some((e) => e.id === prev) ? prev : data[0]?.id ?? null));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const buscar = (e) => { e.preventDefault(); cargar(filtros); };
  const set = (k) => (e) => setFiltros({ ...filtros, [k]: e.target.value });

  const abrir = (id) => {
    setSeleccion(id);
    // En móvil (sin panel lateral) vamos a la página de detalle
    if (window.matchMedia('(max-width: 1023px)').matches) navigate(`/experiencias/${id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Barra de filtros tipo píldoras */}
      <form onSubmit={buscar} className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm dark:border-rio-700 dark:bg-rio-900">
          <span className="text-slate-400">🔎</span>
          <input className="w-full bg-transparent outline-none dark:text-slate-100 dark:placeholder-slate-400" placeholder="Buscar experiencias…" value={filtros.q} onChange={set('q')} />
        </div>
        <input className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm outline-none dark:border-rio-700 dark:bg-rio-900 dark:text-slate-100 dark:placeholder-slate-400" placeholder="📍 Ubicación" value={filtros.ubicacion} onChange={set('ubicacion')} />
        <input className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm outline-none dark:border-rio-700 dark:bg-rio-900 dark:text-slate-100 dark:placeholder-slate-400" placeholder="Categoría" value={filtros.categoria} onChange={set('categoria')} />
        <input type="number" min="0" className="w-32 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm outline-none dark:border-rio-700 dark:bg-rio-900 dark:text-slate-100 dark:placeholder-slate-400" placeholder="Precio máx." value={filtros.precio_max} onChange={set('precio_max')} />
        <button className="btn-primary rounded-full px-6">Buscar</button>
      </form>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</div>}

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        <strong className="text-slate-800 dark:text-white">{experiencias.length}</strong> experiencias fluviales disponibles
      </p>

      {/* Maestro-detalle */}
      <div className="mt-3 grid gap-5 lg:grid-cols-5">
        {/* Lista (maestro) */}
        <div className="space-y-3 lg:col-span-2">
          {loading ? (
            <p className="py-10 text-center text-slate-500">Cargando…</p>
          ) : experiencias.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No se encontraron experiencias.</p>
          ) : (
            experiencias.map((e) => (
              <button
                key={e.id}
                onClick={() => abrir(e.id)}
                className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:bg-rio-900 ${
                  seleccion === e.id
                    ? 'border-rio-500 ring-2 ring-rio-200 dark:ring-rio-700'
                    : 'border-slate-200 dark:border-rio-800'
                }`}
              >
                <h3 className="font-semibold text-slate-800 dark:text-white">{e.titulo}</h3>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{e.guia_nombre}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">📍 {e.ubicacion}</p>
                <p className="mt-1 font-bold text-rio-700 dark:text-rio-300">{money(e.precio)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <RatingStars value={Number(e.rating_promedio)} size="text-xs" />
                    <span className="text-xs text-slate-400">({e.total_resenas})</span>
                  </div>
                  <span className="text-xs text-slate-400">{tiempo(e.created_at)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detalle — solo en pantallas grandes (móvil navega a la página) */}
        <div className="hidden lg:col-span-3 lg:block">
          {seleccion ? (
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-rio-800 dark:bg-rio-900">
              <ExperienceDetailPanel id={seleccion} key={seleccion} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center text-slate-400 dark:border-rio-700">
              Selecciona una experiencia para ver el detalle
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
