import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';

const money = (v) => `$${Number(v).toLocaleString('es-CO')}`;

export default function ExperienceCard({ exp }) {
  return (
    <Link
      to={`/experiencias/${exp.id}`}
      className="card group overflow-hidden transition hover:shadow-md"
    >
      <div className="h-44 w-full overflow-hidden bg-rio-100">
        {exp.imagen ? (
          <img
            src={exp.imagen}
            alt={exp.titulo}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-rio-300">🛶</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800">{exp.titulo}</h3>
          <span className="whitespace-nowrap font-bold text-rio-700">{money(exp.precio)}</span>
        </div>
        <p className="text-sm text-slate-500">📍 {exp.ubicacion}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <RatingStars value={Number(exp.rating_promedio)} size="text-sm" />
            <span>({exp.total_resenas})</span>
          </div>
          {exp.categoria && (
            <span className="rounded-full bg-rio-50 px-2 py-0.5 text-xs text-rio-700">
              {exp.categoria}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
