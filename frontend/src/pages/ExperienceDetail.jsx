import { useParams, Link } from 'react-router-dom';
import ExperienceDetailPanel from '../components/ExperienceDetailPanel.jsx';

// Página de detalle directa (enlace permanente /experiencias/:id).
// Reutiliza el panel compartido que ya incluye mapa, reserva y reseñas en vivo.
export default function ExperienceDetail() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/experiencias" className="text-sm text-rio-700 hover:underline">
        ← Volver a experiencias
      </Link>
      <div className="mt-4">
        <ExperienceDetailPanel id={id} />
      </div>
    </div>
  );
}
