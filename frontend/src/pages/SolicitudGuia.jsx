import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const vacio = { nombre_completo: '', documento: '', telefono: '', zona: '', experiencia_previa: '', descripcion: '' };

export default function SolicitudGuia() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...vacio, nombre_completo: user?.nombre || '', telefono: user?.telefono || '' });
  const [solicitud, setSolicitud] = useState(undefined); // undefined=cargando, null=sin solicitud
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargar = () => api.get('/solicitudes/mia').then((r) => setSolicitud(r.data)).catch(() => setSolicitud(null));
  useEffect(() => { cargar(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/solicitudes', form);
      setSolicitud(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Si ya es guía/admin
  if (user?.rol === 'guia' || user?.rol === 'admin') {
    return (
      <Estado emoji="✅" titulo="Ya tienes permisos de guía">
        <Link to="/guia" className="btn-primary mt-4">Ir a mi panel</Link>
      </Estado>
    );
  }

  if (solicitud === undefined) return <div className="p-10 text-center text-slate-500">Cargando…</div>;

  // Estado pendiente o aprobada
  if (solicitud && solicitud.estado === 'pendiente') {
    return (
      <Estado emoji="⏳" titulo="Solicitud en revisión"
        texto="Tu formulario fue enviado y un administrador lo revisará pronto. Te habilitaremos para publicar experiencias en cuanto sea aprobado." />
    );
  }
  if (solicitud && solicitud.estado === 'aprobada') {
    return (
      <Estado emoji="🎉" titulo="¡Solicitud aprobada!" texto="Cierra sesión y vuelve a entrar para activar tu panel de guía.">
        <Link to="/guia" className="btn-primary mt-4">Ir a mi panel</Link>
      </Estado>
    );
  }

  // Sin solicitud o rechazada → mostrar formulario
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Verificación de guía</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Por seguridad, no cualquiera puede publicar experiencias. Cuéntanos quién eres; un administrador revisará tu solicitud.
      </p>

      {solicitud?.estado === 'rechazada' && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Tu solicitud anterior fue rechazada{solicitud.motivo_rechazo ? `: ${solicitud.motivo_rechazo}` : '.'} Puedes corregir y volver a enviar.
        </div>
      )}
      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={enviar} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nombre completo *</label>
          <input required className="input" value={form.nombre_completo} onChange={set('nombre_completo')} />
        </div>
        <div>
          <label className="label">Documento de identidad *</label>
          <input required className="input" value={form.documento} onChange={set('documento')} />
        </div>
        <div>
          <label className="label">Teléfono *</label>
          <input required className="input" value={form.telefono} onChange={set('telefono')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Zona donde operas *</label>
          <input required className="input" placeholder="Ej: El Llanito, Ciénaga Miramar…" value={form.zona} onChange={set('zona')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Experiencia previa (opcional)</label>
          <input className="input" placeholder="Años como guía/pescador, certificaciones…" value={form.experiencia_previa} onChange={set('experiencia_previa')} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Cuéntanos sobre las experiencias que quieres ofrecer *</label>
          <textarea required rows="4" className="input" value={form.descripcion} onChange={set('descripcion')} />
        </div>
        <button disabled={loading} className="btn-primary sm:col-span-2 py-3">
          {loading ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}

function Estado({ emoji, titulo, texto, children }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="text-6xl">{emoji}</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{titulo}</h1>
      {texto && <p className="mt-2 text-slate-500 dark:text-slate-400">{texto}</p>}
      {children}
    </div>
  );
}
