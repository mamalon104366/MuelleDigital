import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from './RatingStars.jsx';
import MapaPunto from './MapaPunto.jsx';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;
const REFRESCO_RESENAS = 6000; // ms — "tiempo real" por polling ligero

export default function ExperienceDetailPanel({ id }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exp, setExp] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [fecha, setFecha] = useState('');
  const [personas, setPersonas] = useState(1);
  const [reserva, setReserva] = useState(null);

  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');

  const cargarExp = () => api.get(`/experiencias/${id}`).then((r) => setExp(r.data));
  const cargarResenas = () => api.get('/ratings', { params: { experiencia_id: id } }).then((r) => setResenas(r.data));

  // Carga inicial + reset al cambiar de experiencia
  useEffect(() => {
    setExp(null);
    setReserva(null);
    setMensaje('');
    setError('');
    Promise.all([cargarExp(), cargarResenas()]).catch((e) => setError(e.message));
  }, [id]);

  // Reseñas en tiempo real: refresco periódico mientras el panel está abierto
  useEffect(() => {
    const t = setInterval(() => {
      cargarResenas().catch(() => {});
    }, REFRESCO_RESENAS);
    return () => clearInterval(t);
  }, [id]);

  const reservar = async (e) => {
    e.preventDefault();
    setError(''); setMensaje('');
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/reservas', { experiencia_id: Number(id), fecha, personas: Number(personas) });
      setReserva(data);
      setMensaje('¡Reserva creada! Completa el pago para confirmarla.');
    } catch (err) { setError(err.message); }
  };

  const pagar = async (metodo_pago) => {
    setError('');
    try {
      const { data } = await api.post('/pagos', { reserva_id: reserva.id, metodo_pago });
      setMensaje(`✅ Pago ${data.comprobante.estado}. Comprobante: ${data.comprobante.referencia}`);
      setReserva(null);
    } catch (err) { setError(err.message); }
  };

  // Pago real con tarjeta: crea la Checkout Session y redirige a Stripe.
  const pagarStripe = async () => {
    setError('');
    try {
      const { data } = await api.post('/pagos/checkout', { reserva_id: reserva.id });
      window.location.href = data.url;
    } catch (err) { setError(err.message); }
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/ratings', { experiencia_id: Number(id), puntuacion, comentario });
      setComentario('');
      await Promise.all([cargarResenas(), cargarExp()]);
    } catch (err) { setError(err.message); }
  };

  if (error && !exp) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!exp) return <div className="p-8 text-center text-slate-500">Cargando…</div>;

  return (
    <div>
      {/* Cabecera */}
      <div className="h-52 w-full overflow-hidden rounded-xl bg-rio-100">
        {exp.imagen ? (
          <img src={exp.imagen} alt={exp.titulo} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl text-rio-300">🛶</div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{exp.titulo}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">📍 {exp.ubicacion}</p>
        </div>
        <span className="whitespace-nowrap text-2xl font-bold text-rio-700 dark:text-rio-300">{money(exp.precio)}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <RatingStars value={Number(exp.rating_promedio)} size="text-sm" />
        <span className="text-slate-500 dark:text-slate-400">{exp.rating_promedio} ({exp.total_resenas})</span>
        {exp.temporada && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-rio-800 dark:text-slate-300">🗓️ {exp.temporada}</span>}
        {exp.categoria && <span className="rounded-full bg-rio-50 px-2 py-0.5 text-rio-700 dark:bg-rio-800 dark:text-rio-200">{exp.categoria}</span>}
      </div>

      {/* Reserva / pago */}
      <div className="card mt-4 p-4">
        {mensaje && <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">{mensaje}</div>}
        {error && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {!reserva ? (
          <form onSubmit={reservar} className="grid gap-3 sm:grid-cols-3 sm:items-end">
            <div>
              <label className="label">Fecha</label>
              <input type="date" required className="input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <label className="label">Personas</label>
              <input type="number" min="1" required className="input" value={personas} onChange={(e) => setPersonas(e.target.value)} />
            </div>
            <button className="btn-primary py-2.5">{user ? 'Reservar' : 'Inicia sesión'}</button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-300">Completa el pago para confirmar tu reserva:</p>
            <button onClick={pagarStripe} className="btn-primary w-full">💳 Pagar con tarjeta (Stripe)</button>
            <p className="text-center text-xs text-slate-400">— o paga simulado —</p>
            <div className="flex gap-2">
              <button onClick={() => pagar('nequi')} className="btn-outline flex-1">Nequi</button>
              <button onClick={() => pagar('daviplata')} className="btn-outline flex-1">Daviplata</button>
            </div>
          </div>
        )}
      </div>

      {/* Punto de encuentro en el mapa */}
      <section className="mt-6">
        <h2 className="mb-2 font-bold text-slate-800 dark:text-white">📍 Punto de encuentro</h2>
        {exp.punto_encuentro && <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{exp.punto_encuentro}</p>}
        <MapaPunto lat={exp.lat} lng={exp.lng} label={exp.punto_encuentro || exp.titulo} />
      </section>

      {/* Descripción */}
      <section className="mt-6">
        <h2 className="mb-2 font-bold text-slate-800 dark:text-white">Sobre la experiencia</h2>
        <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{exp.descripcion}</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Guía: <strong>{exp.guia_nombre}</strong></p>
      </section>

      {/* Reseñas en tiempo real */}
      <section className="mt-6">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 dark:text-white">Reseñas</h2>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> en vivo
          </span>
        </div>

        {user && user.rol === 'turista' && (
          <form onSubmit={enviarResena} className="card mt-3 space-y-2 p-4">
            <RatingStars value={puntuacion} onChange={setPuntuacion} />
            <textarea className="input" rows="2" placeholder="Comentario (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} />
            <button className="btn-primary">Publicar reseña</button>
          </form>
        )}

        <div className="mt-3 space-y-2">
          {resenas.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay reseñas. ¡Sé el primero!</p>
          ) : (
            resenas.map((r) => (
              <div key={r.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-slate-800 dark:text-white">{r.usuario_nombre}</strong>
                  <RatingStars value={r.puntuacion} size="text-sm" />
                </div>
                {r.comentario && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comentario}</p>}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
