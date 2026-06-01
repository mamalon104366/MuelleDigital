import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '../lib/map.js';

// Permite al guía elegir el punto de encuentro: clic en el mapa o arrastrar el pin.
export default function SelectorPunto({ value, onChange, height = 280 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(value || null);

  // Coloca o mueve el marcador y notifica el cambio hacia arriba.
  const setPoint = (lngLat) => {
    const punto = { lat: +lngLat.lat.toFixed(6), lng: +lngLat.lng.toFixed(6) };
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color: '#256879', draggable: true })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
      markerRef.current.on('dragend', () => setPoint(markerRef.current.getLngLat()));
    } else {
      markerRef.current.setLngLat(lngLat);
    }
    setCoords(punto);
    onChange?.(punto);
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const start = value?.lat != null ? [value.lng, value.lat] : [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: start,
      zoom: value?.lat != null ? 14 : DEFAULT_ZOOM,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    if (value?.lat != null) {
      markerRef.current = new maplibregl.Marker({ color: '#256879', draggable: true })
        .setLngLat(start)
        .addTo(map);
      markerRef.current.on('dragend', () => setPoint(markerRef.current.getLngLat()));
    }

    map.on('click', (e) => setPoint(e.lngLat));

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
        <div ref={containerRef} style={{ height }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {coords
          ? `📍 Punto marcado: ${coords.lat}, ${coords.lng}`
          : '👆 Haz clic en el mapa para marcar el punto de encuentro (o arrastra el pin).'}
      </p>
    </div>
  );
}
