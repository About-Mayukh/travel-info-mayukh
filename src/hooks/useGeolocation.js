import { useState, useEffect, useCallback } from 'react';
import { geocodeCity } from '../services/geocodeService';

// Default central fallback coordinate (Kolkata / Central India)
const DEFAULT_COORDS = {
  lat: 22.5726,
  lng: 88.3639,
  city: 'Kolkata (Default)',
  isManualFallback: false,
};

export function useGeolocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('wanderspot_user_location');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_COORDS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Request browser geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setPermissionDenied(true);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: 'Current GPS Location',
          isManualFallback: false,
        };
        setLocation(coords);
        setPermissionDenied(false);
        setLoading(false);
        try {
          localStorage.setItem('wanderspot_user_location', JSON.stringify(coords));
        } catch (e) {
          // ignore
        }
      },
      (err) => {
        console.warn('Geolocation error/denied:', err.message);
        setPermissionDenied(true);
        setError(err.message || 'Location access denied');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Set manual city fallback via Nominatim (search on button click or Enter only)
  const setManualCity = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geocodeCity(cityName);
      if (result) {
        const newCoords = {
          lat: result.lat,
          lng: result.lng,
          city: cityName,
          isManualFallback: true,
        };
        setLocation(newCoords);
        setPermissionDenied(false);
        try {
          localStorage.setItem('wanderspot_user_location', JSON.stringify(newCoords));
        } catch (e) {
          // ignore
        }
        return true;
      } else {
        setError(`Could not find coordinates for "${cityName}".`);
        return false;
      }
    } catch (err) {
      setError(err.message || 'Geocoding failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt automatic geolocation if no saved coordinates exists
    const saved = localStorage.getItem('wanderspot_user_location');
    if (!saved && navigator.geolocation) {
      requestLocation();
    }
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    permissionDenied,
    requestLocation,
    setManualCity,
  };
}

export default useGeolocation;
