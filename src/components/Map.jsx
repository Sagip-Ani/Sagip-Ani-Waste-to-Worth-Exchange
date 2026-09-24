import { useEffect, useMemo, useRef } from 'react';
const DEFAULT_CENTER = [8.1575, 125.1278];

const parseLocation = (location) => {
  if (!location) return null;
  if (typeof location === 'object') {
    if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      return { lat: Number(location.coordinates[1]), lng: Number(location.coordinates[0]) };
    }
    if (Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))) {
      return { lat: Number(location.lat), lng: Number(location.lng) };
    }
  }

  if (typeof location !== 'string') return null;
  const value = location.trim();

  const point = value.match(/^POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)$/i);
  if (point) return { lat: Number(point[2]), lng: Number(point[1]) };

  try {
    const parsed = JSON.parse(value);
    return parseLocation(parsed);
  } catch {
    return null;
  }
};

export { parseLocation };

export default function Map({
  points = [],
  center,
  zoom = 10,
  height = '420px',
  className = '',
  onMapClick,
  selectedPoint = null,
  interactive = true
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const normalizedPoints = useMemo(
    () => points.map((point) => {
      const parsed = parseLocation(point.location) || (
        Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng))
          ? { lat: Number(point.lat), lng: Number(point.lng) }
          : null
      );
      return parsed ? { ...point, ...parsed } : null;
    }).filter(Boolean),
    [points]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !window.L) return;

    const L = window.L;
    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    map.setView(center || (normalizedPoints[0] ? [normalizedPoints[0].lat, normalizedPoints[0].lng] : DEFAULT_CENTER), zoom);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    normalizedPoints.forEach((point) => {
      const isBuyer = point.role === 'buyer' || point.type === 'buyer';
      const color = isBuyer ? '#2563eb' : '#15803d';
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 9,
        fillColor: color,
        color: '#ffffff',
        weight: 3,
        fillOpacity: 0.95
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width:160px;font-family:system-ui,sans-serif">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:${color};margin-bottom:6px">${isBuyer ? 'Buyer' : 'Supplier'}</div>
          <div style="font-weight:700;color:#111827">${escapeHtml(point.material_type || 'Material')}</div>
          <div style="font-size:12px;color:#4b5563;margin-top:4px">${Number(point.quantity ?? point.quantity_kg ?? point.quantity_needed_kg ?? 0).toLocaleString()} kg</div>
          <div style="font-size:12px;color:#4b5563;margin-top:2px">${point.distance_km != null ? `${Number(point.distance_km).toFixed(1)} km away` : 'Distance unavailable'}</div>
          ${point.label ? `<div style="font-size:11px;color:#6b7280;margin-top:5px">${escapeHtml(point.label)}</div>` : ''}
        </div>
      `);
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    if (selectedPoint && Number.isFinite(Number(selectedPoint.lat)) && Number.isFinite(Number(selectedPoint.lng))) {
      const marker = L.circleMarker([Number(selectedPoint.lat), Number(selectedPoint.lng)], {
        radius: 10,
        fillColor: '#111827',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 0.85
      }).addTo(map);
      marker.bindPopup('<strong>Selected location</strong><br/>This pin will be saved with your demand.').openPopup();
      markersRef.current.push(marker);
    }

    if (normalizedPoints.length > 1) {
      const bounds = L.latLngBounds(normalizedPoints.map((point) => [point.lat, point.lng]));
      if (selectedPoint) bounds.extend([Number(selectedPoint.lat), Number(selectedPoint.lng)]);
      map.fitBounds(bounds.pad(0.12), { maxZoom: 13 });
    } else if (selectedPoint) {
      map.setView([Number(selectedPoint.lat), Number(selectedPoint.lng)], 13);
    } else if (normalizedPoints.length === 1) {
      map.setView([normalizedPoints[0].lat, normalizedPoints[0].lng], 13);
    }
  }, [normalizedPoints, selectedPoint]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onMapClick || !interactive) return;
    const handler = (event) => onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    map.on('click', handler);
    return () => map.off('click', handler);
  }, [onMapClick, interactive]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;
    map.setView(center, zoom);
  }, [center, zoom]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200 ${className}`} style={{ height }}>
      <div ref={containerRef} className="h-full w-full" />
      {onMapClick && interactive && (
        <div className="absolute left-3 top-3 z-[500] rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-[11px] font-semibold text-gray-700 shadow-sm">
          Click the map to place your pin
        </div>
      )}
    </div>
  );
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character]));
}
