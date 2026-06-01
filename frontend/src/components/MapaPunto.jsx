import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { MAP_STYLE, DEFAULT_CENTER } from '../lib/map.js';

// Muestra (solo lectura) el punto de encuentro de una experiencia en el mapa.
export default function MapaPunto({ lat, lng, label, height = 220, zoom = 14 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const hasPoint = lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));

  useEffect(() => {
    if (!hasPoint || !containerRef.current || mapRef.current) return;

    const center = [Number(lng), Number(lat)];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center,
      zoom,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const marker = new maplibregl.Marker({ color: '#256879' }).setLngLat(center);
    if (label) marker.setPopup(new maplibregl.Popup({ offset: 24 }).setText(label));
    marker.addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [hasPoint, lat, lng, label, zoom]);

  if (!hasPoint) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400"
        style={{ height }}
      >
        📍 Este punto de encuentro aún no tiene ubicación en el mapa.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
