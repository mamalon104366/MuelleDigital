import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client.js';

// Página a la que Stripe redirige tras el pago (success_url).
// Verifica el estado contra el backend (no depende del webhook en local).
export default function PagoExito() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [estado, setEstado] = useState('verificando');

  useEffect(() => {
    if (!sessionId) { setEstado('sin_sesion'); return; }
    api.get(`/pagos/verificar/${sessionId}`)
      .then((r) => setEstado(r.data.estado === 'completado' ? 'ok' : 'pendiente'))
      .catch(() => setEstado('error'));
  }, [sessionId]);

  const ui = {
    verificando: { emoji: '⏳', titulo: 'Verificando tu pago…', texto: 'Un momento por favor.' },
    ok: { emoji: '🎉', titulo: '¡Pago confirmado!', texto: 'Tu reserva quedó confirmada. ¡Nos vemos en el río!' },
    pendiente: { emoji: '⌛', titulo: 'Pago en proceso', texto: 'Tu pago se está procesando. Revisa "Mis reservas" en un momento.' },
    error: { emoji: '⚠️', titulo: 'No pudimos verificar el pago', texto: 'Revisa "Mis reservas" o inténtalo de nuevo.' },
    sin_sesion: { emoji: '🤔', titulo: 'Sin información de pago', texto: 'No encontramos la sesión de pago.' },
  }[estado];

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="text-6xl">{ui.emoji}</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{ui.titulo}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{ui.texto}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/mis-reservas" className="btn-primary">Ver mis reservas</Link>
        <Link to="/experiencias" className="btn-outline">Seguir explorando</Link>
      </div>
    </div>
  );
}
