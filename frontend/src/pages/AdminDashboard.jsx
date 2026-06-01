import { useEffect, useState } from 'react';
import api from '../api/client.js';
import MapaExperiencias from '../components/MapaExperiencias.jsx';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;

export default function AdminDashboard() {
  const [tab, setTab] = useState('resumen');
  const [metrics, setMetrics] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      const [m, u, s, e, r, p] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/usuarios'),
        api.get('/solicitudes'),
        api.get('/experiencias'),
        api.get('/reservas'),
        api.get('/pagos'),
      ]);
      setMetrics(m.data); setUsuarios(u.data); setSolicitudes(s.data);
      setExperiencias(e.data); setReservas(r.data); setPagos(p.data);
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { loadAll(); }, []);

  // --- acciones ---
  const resolver = async (id, estado) => {
    const motivo_rechazo = estado === 'rechazada' ? prompt('Motivo del rechazo (opcional):') || '' : undefined;
    await api.patch(`/solicitudes/${id}`, { estado, motivo_rechazo });
    await loadAll();
  };
  const cambiarRol = async (id, rol) => { await api.patch(`/admin/usuarios/${id}/rol`, { rol }); await loadAll(); };
  const eliminarUsuario = async (id) => { if (confirm('¿Eliminar este usuario y todos sus datos?')) { await api.delete(`/admin/usuarios/${id}`); await loadAll(); } };
  const eliminarExp = async (id) => { if (confirm('¿Eliminar esta experiencia?')) { await api.delete(`/experiencias/${id}`); await loadAll(); } };
  const cambiarReserva = async (id, estado) => { await api.patch(`/reservas/${id}/estado`, { estado }); await loadAll(); };

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;
  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'solicitudes', label: `Solicitudes${pendientes ? ` (${pendientes})` : ''}` },
    { id: 'usuarios', label: `Usuarios (${usuarios.length})` },
    { id: 'experiencias', label: `Experiencias (${experiencias.length})` },
    { id: 'reservas', label: `Reservas (${reservas.length})` },
    { id: 'pagos', label: `Pagos (${pagos.length})` },
  ];

  if (!metrics) return <div className="p-10 text-center text-slate-500">{error || 'Cargando panel…'}</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de administración</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Control total de la plataforma Muelle Digital.</p>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-slate-200 dark:border-rio-800">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium ${tab === t.id ? 'border-b-2 border-rio-600 text-rio-700 dark:border-rio-400 dark:text-rio-300' : 'text-slate-500 hover:text-rio-700 dark:text-slate-400 dark:hover:text-rio-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {/* RESUMEN */}
      {tab === 'resumen' && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Usuarios" value={metrics.usuarios} />
            <Metric label="Guías" value={metrics.guias} />
            <Metric label="Experiencias" value={metrics.experiencias} />
            <Metric label="Ingresos" value={money(metrics.ingresos)} />
            <Metric label="Reservas" value={metrics.reservas} />
            <Metric label="Reseñas" value={metrics.resenas} />
            <Metric label="Turistas" value={metrics.turistas} />
            <Metric label="Solicitudes pendientes" value={metrics.solicitudes_pendientes} highlight={pendientes > 0} />
          </div>
          <div>
            <h2 className="mb-2 font-bold text-slate-800 dark:text-white">🗺️ Puntos de encuentro de todas las experiencias</h2>
            <MapaExperiencias experiencias={experiencias} />
          </div>
        </div>
      )}

      {/* SOLICITUDES */}
      {tab === 'solicitudes' && (
        <div className="mt-6 space-y-3">
          {solicitudes.length === 0 && <p className="text-slate-500 dark:text-slate-400">No hay solicitudes.</p>}
          {solicitudes.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{s.nombre_completo} <span className="text-sm font-normal text-slate-400">· {s.usuario_email}</span></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Doc: {s.documento} · Tel: {s.telefono} · Zona: {s.zona}</p>
                  {s.experiencia_previa && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Experiencia: {s.experiencia_previa}</p>}
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{s.descripcion}</p>
                </div>
                <Badge estado={s.estado} />
              </div>
              {s.estado === 'pendiente' && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => resolver(s.id, 'aprobada')} className="btn-primary px-4 py-1.5 text-sm">Aprobar</button>
                  <button onClick={() => resolver(s.id, 'rechazada')} className="btn-outline border-red-300 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50">Rechazar</button>
                </div>
              )}
              {s.estado === 'rechazada' && s.motivo_rechazo && <p className="mt-2 text-xs text-red-600">Motivo: {s.motivo_rechazo}</p>}
            </div>
          ))}
        </div>
      )}

      {/* USUARIOS */}
      {tab === 'usuarios' && (
        <Tabla cols={['Usuario', 'Email', 'Rol', 'Exp.', 'Reservas', 'Acciones']}>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t border-slate-100 dark:border-rio-800">
              <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{u.nombre}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{u.email}</td>
              <td className="px-4 py-2">
                <select value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-sm">
                  <option value="turista">turista</option>
                  <option value="guia">guia</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{u.total_experiencias}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{u.total_reservas}</td>
              <td className="px-4 py-2">
                <button onClick={() => eliminarUsuario(u.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </Tabla>
      )}

      {/* EXPERIENCIAS */}
      {tab === 'experiencias' && (
        <Tabla cols={['Título', 'Guía', 'Precio', 'Punto encuentro', 'Acciones']}>
          {experiencias.map((e) => (
            <tr key={e.id} className="border-t border-slate-100 dark:border-rio-800">
              <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{e.titulo}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{e.guia_nombre}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{money(e.precio)}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{e.punto_encuentro || (e.lat ? `${e.lat}, ${e.lng}` : '—')}</td>
              <td className="px-4 py-2">
                <button onClick={() => eliminarExp(e.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </Tabla>
      )}

      {/* RESERVAS */}
      {tab === 'reservas' && (
        <Tabla cols={['Experiencia', 'Turista', 'Fecha', 'Estado', 'Acciones']}>
          {reservas.map((r) => (
            <tr key={r.id} className="border-t border-slate-100 dark:border-rio-800">
              <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{r.experiencia_titulo}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{r.turista_nombre}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{new Date(r.fecha).toLocaleDateString('es-CO')}</td>
              <td className="px-4 py-2"><Badge estado={r.estado} /></td>
              <td className="px-4 py-2">
                <select value={r.estado} onChange={(e) => cambiarReserva(r.id, e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-sm">
                  <option value="pendiente">pendiente</option>
                  <option value="confirmada">confirmada</option>
                  <option value="cancelada">cancelada</option>
                  <option value="completada">completada</option>
                </select>
              </td>
            </tr>
          ))}
        </Tabla>
      )}

      {/* PAGOS */}
      {tab === 'pagos' && (
        <Tabla cols={['Experiencia', 'Método', 'Valor', 'Estado', 'Referencia']}>
          {pagos.map((p) => (
            <tr key={p.id} className="border-t border-slate-100 dark:border-rio-800">
              <td className="px-4 py-2 text-slate-800 dark:text-slate-100">{p.experiencia_titulo}</td>
              <td className="px-4 py-2 capitalize text-slate-500">{p.metodo_pago}</td>
              <td className="px-4 py-2 text-slate-500 dark:text-slate-300">{money(p.valor)}</td>
              <td className="px-4 py-2"><Badge estado={p.estado} /></td>
              <td className="px-4 py-2 text-xs text-slate-400">{p.referencia}</td>
            </tr>
          ))}
        </Tabla>
      )}
    </div>
  );
}

const Metric = ({ label, value, highlight }) => (
  <div className={`card p-5 text-center ${highlight ? 'ring-2 ring-amber-300' : ''}`}>
    <p className="text-3xl font-bold text-rio-700 dark:text-rio-300">{value}</p>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

const Tabla = ({ cols, children }) => (
  <div className="card mt-6 overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-500 dark:bg-rio-800/50 dark:text-slate-300">
        <tr>{cols.map((c) => <th key={c} className="px-4 py-2 font-medium">{c}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const badgeColors = {
  pendiente: 'bg-amber-50 text-amber-700', confirmada: 'bg-green-50 text-green-700',
  cancelada: 'bg-red-50 text-red-700', completada: 'bg-rio-50 text-rio-700',
  aprobada: 'bg-green-50 text-green-700', rechazada: 'bg-red-50 text-red-700',
  completado: 'bg-green-50 text-green-700', fallido: 'bg-red-50 text-red-700',
};
const Badge = ({ estado }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[estado] || 'bg-slate-100 text-slate-600'}`}>{estado}</span>
);
