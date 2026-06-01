import { useState } from 'react';

// Imagen con respaldo: si la URL falla, muestra un degradado de marca.
export default function ImageWithFallback({ src, alt = '', className = '' }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <div className={`bg-gradient-to-br from-rio-700 to-rio-900 ${className}`} aria-label={alt} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}
