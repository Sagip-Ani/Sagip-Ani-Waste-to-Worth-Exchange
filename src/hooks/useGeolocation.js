import { useCallback, useEffect, useState } from 'react';

export function useGeolocation({ auto = true } = {}) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setLoading(false);
      },
      (geoError) => {
        setError(geoError.message || 'Location permission was denied.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    if (auto) requestLocation();
  }, [auto, requestLocation]);

  return { position, loading, error, requestLocation, setPosition };
}
