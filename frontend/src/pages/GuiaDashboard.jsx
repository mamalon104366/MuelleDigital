import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import SelectorPunto from '../components/SelectorPunto.jsx';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;
const vacio = { titulo: '', descripcion: '', precio: '', ubicacion: '', temporada: '', categoria: '', cupos: '', imagen: '' };
const iniciales = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const estadoBadge = {
  pendiente: 'bg-amber-50 text-amber-700',
  confirmada: 'bg-green-50 text-green-700',
  cancelada: 'bg-red-50 text-red-700',
  completada: 'bg-rio-50 text-rio-700',
};

export default function GuiaDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('resumen');
  const [misExp, setMisExp] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState(vacio);
  const [punto, setPunto] = useState(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const cargar = async () => {
    const [exps, res] = await Promise.all([api.get('/experiencias'), api.get('/reservas')]);
    setMisExp(exps.data.filter((e) => e.guia_id === user.id || user.rol === 'admin'));
    setReservas(res.data);
  };

  useEffect(() => { cargar().catch((e) => setError(e.message)); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const crear = async (e) => {
    e.preventDefault();
    setError(''); setOk('');
    try {
      await api.post('/experiencias', {
        ...form,
        precio: Number(form.precio),
        cupos: Number(form.cupos) || 0,
        lat: punto?.lat ?? null,
        lng: punto?.lng ?? null,
      });
      setOk('✅ Experiencia publicada con éxito.');
      setForm(vacio); setPunto(null);
      await cargar();
      setTab('experiencias');
    } catch (err) { setError(err.message); }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    await api.delete(`/experiencias/${id}`);
    await cargar();
  };

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/reservas/${id}/estado`, { estado });
    await cargar();
  };

  const pendientes = reservas.filter((r) => r.estado === 'pendiente').length;
  const tabs = [
    { id: 'resumen', label: 'Mi área' },
    { id: 'crear', label: 'Crear experiencia' },
    { id: 'experiencias', label: `Mis experiencias (${misExp.length})` },
    { id: 'reservas', label: `Reservas (${reservas.length})` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar perfil */}
        <aside className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rio-600 text-2xl font-bold text-white">
              {iniciales(user.nombre)}
            </div>
            <h2 className="mt-3 font-bold text-slate-800 dark:text-white">{user.nombre}</h2>
            <span className="mt-1 inline-block rounded-full bg-rio-50 px-3 py-0.5 text-xs font-medium text-rio-700 dark:bg-rio-800 dark:text-rio-200">
              {user.rol === 'admin' ? 'Administrador' : 'Guía verificado'}
            </span>
            <p className="mt-2 text-xs text-slate-400">{user.email}</p>
          </div>

          <div className="card mt-4 divide-y divide-slate-100 dark:divide-rio-800">
            <Stat label="Experiencias" value={misExp.length} />
            <Stat label="Reservas recibidas" value={reservas.length} />
            <Stat label="Reservas pendientes" value={pendientes} />
          </div>
        </aside>

        {/* Contenido */}
        <main className="lg:col-span-3">
          {/* Tabs */}
          <div className="mb-5 flex flex-wrap gap-1 border-b border-slate-200 dark:border-rio-800">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-sm font-medium ${
                  tab === t.id ? 'border-b-2 border-rio-600 text-rio-700 dark:border-rio-400 dark:text-rio-300' : 'text-slate-500 hover:text-rio-700 dark:text-slate-400 dark:hover:text-rio-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {ok && <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{ok}</div>}

          {tab === 'resumen' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-rio-700 to-rio-500 p-6 text-white">
                <h1 className="text-2xl font-bold">¡Hola, {user.nombre.split(' ')[0]}! 🛶</h1>
                <p className="mt-1 text-rio-50">Gestiona tus experiencias fluviales y tus reservas desde aquí.</p>
                <button onClick={() => setTab('crear')} className="btn mt-4 bg-white px-5 py-2 font-semibold text-rio-700 hover:bg-rio-50">
                  + Crear nueva experiencia
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <BigStat label="Experiencias publicadas" value={misExp.length} />
                <BigStat label="Reservas recibidas" value={reservas.length} />
                <BigStat label="Pendientes por confirmar" value={pendientes} />
              </div>
            </div>
          )}

          {tab === 'crear' && (
            <form onSubmit={crear} className="card grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Título *</label>
                <input required className="input" value={form.titulo} onChange={set('titulo')} />
              </div>
              <div>
                <label className="label">Ubicación *</label>
                <input required className="input" value={form.ubicacion} onChange={set('ubicacion')} />
              </div>
              <div>
                <label className="label">Precio (COP) *</label>
                <input required type="number" min="0" className="input" value={form.precio} onChange={set('precio')} />
              </div>
              <div>
                <label className="label">Cupos</label>
                <input type="number" min="0" className="input" value={form.cupos} onChange={set('cupos')} />
              </div>
              <div>
                <label className="label">Temporada</label>
                <input className="input" placeholder="seca, lluvias…" value={form.temporada} onChange={set('temporada')} />
              </div>
              <div>
                <label className="label">Categoría</label>
                <input className="input" placeholder="avistamiento, pesca…" value={form.categoria} onChange={set('categoria')} />
              </div>
              <div>
                <label className="label">Nombre del punto de encuentro</label>
                <input className="input" placeholder="Muelle de El Llanito…" value={form.punto_encuentro || ''} onChange={set('punto_encuentro')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">URL de imagen (opcional)</label>
                <input className="input" value={form.imagen} onChange={set('imagen')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Descripción *</label>
                <textarea required rows="3" className="input" value={form.descripcion} onChange={set('descripcion')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">📍 Marca el punto de encuentro en el mapa</label>
                <SelectorPunto value={punto} onChange={setPunto} />
              </div>
              <button className="btn-primary py-3 sm:col-span-2">Publicar experiencia</button>
            </form>
          )}

          {tab === 'experiencias' && (
            <div className="space-y-3">
              {misExp.map((e) => (
                <div key={e.id} className="card flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{e.titulo}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{money(e.precio)} · {e.cupos} cupos · {e.ubicacion}</p>
                    {e.punto_encuentro && <p className="text-xs text-rio-600">📍 {e.punto_encuentro}</p>}
                  </div>
                  <button onClick={() => eliminar(e.id)} className="btn-outline border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                    Eliminar
                  </button>
                </div>
              ))}
              {misExp.length === 0 && <p className="text-slate-500">Aún no has publicado experiencias.</p>}
            </div>
          )}

          {tab === 'reservas' && (
            <div className="space-y-3">
              {reservas.map((r) => (
                <div key={r.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{r.experiencia_titulo}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {r.turista_nombre} · {new Date(r.fecha).toLocaleDateString('es-CO')} · {r.personas} pers.
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${estadoBadge[r.estado]}`}>{r.estado}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => cambiarEstado(r.id, 'confirmada')} className="btn-primary px-3 py-1.5 text-sm">Confirmar</button>
                    <button onClick={() => cambiarEstado(r.id, 'cancelada')} className="btn-outline px-3 py-1.5 text-sm">Cancelar</button>
                  </div>
                </div>
              ))}
              {reservas.length === 0 && <p className="text-slate-500">Sin reservas todavía.</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="flex items-center justify-between px-5 py-3">
    <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    <span className="font-bold text-slate-800 dark:text-white">{value}</span>
  </div>
);

const BigStat = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-3xl font-bold text-rio-700 dark:text-rio-300">{value}</p>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);
