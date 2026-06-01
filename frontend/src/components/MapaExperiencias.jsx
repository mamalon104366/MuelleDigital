import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '../lib/map.js';

// Mapa con todos los puntos de encuentro (para el panel admin).
export default function MapaExperiencias({ experiencias = [], height = 360 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const conPunto = experiencias.filter((e) => e.lat != null && e.lng != null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: DEFAULT_ZOOM,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // (Re)dibuja los marcadores cuando cambian las experiencias
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = [];
    const bounds = new maplibregl.LngLatBounds();
    conPunto.forEach((e) => {
      const lngLat = [Number(e.lng), Number(e.lat)];
      const m = new maplibregl.Marker({ color: '#256879' })
        .setLngLat(lngLat)
        .setPopup(new maplibregl.Popup({ offset: 24 }).setText(`${e.titulo} — ${e.punto_encuentro || ''}`))
        .addTo(map);
      markers.push(m);
      bounds.extend(lngLat);
    });
    if (conPunto.length === 1) map.flyTo({ center: bounds.getCenter(), zoom: 13 });
    else if (conPunto.length > 1) map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 0 });

    return () => markers.forEach((m) => m.remove());
  }, [experiencias]);

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
