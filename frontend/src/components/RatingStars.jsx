// Muestra (y opcionalmente permite elegir) una puntuación de 1 a 5 estrellas.
export default function RatingStars({ value = 0, onChange, size = 'text-xl' }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <div className={`inline-flex ${size}`}>
      {stars.map((n) => (
        <span
          key={n}
          onClick={interactive ? () => onChange(n) : undefined}
          className={`${interactive ? 'cursor-pointer' : ''} ${
            n <= Math.round(value) ? 'text-amber-400' : 'text-slate-300'
          }`}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `${n} estrellas` : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}
