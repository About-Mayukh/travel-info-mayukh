import React, { useState, useEffect } from 'react';
import { Navigation, Car, Clock, MapPin, LocateFixed, Search } from 'lucide-react';
import { getRoadRoute } from '../../services/routingService';
import { formatCurrency } from '../../utils/format';
import { DRIVING_RATE_PER_KM } from '../../utils/price';
import Button from '../ui/Button';

export function DistanceInfo({
  spotLat,
  spotLng,
  userLocation,
  onLocationChange,
  onRequestGPS,
}) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function calculateRoute() {
      if (!userLocation || !userLocation.lat || !userLocation.lng) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const info = await getRoadRoute({
          userLat: userLocation.lat,
          userLng: userLocation.lng,
          spotLat,
          spotLng,
        });
        if (isMounted) {
          setRouteInfo(info);
        }
      } catch (e) {
        console.error('Route calculation error', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    calculateRoute();
    return () => {
      isMounted = false;
    };
  }, [userLocation, spotLat, spotLng]);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim() && onLocationChange) {
      onLocationChange(cityInput.trim());
      setShowLocationSearch(false);
      setCityInput('');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/60 p-5 shadow-sm">
      {/* Header and User Location */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
            Road Distance & Travel Time
          </h4>
        </div>
        <button
          onClick={() => setShowLocationSearch(!showLocationSearch)}
          className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{userLocation?.city || 'Change Origin'}</span>
        </button>
      </div>

      {/* Nominatim City Search Fallback Drawer */}
      {showLocationSearch && (
        <form onSubmit={handleCitySubmit} className="my-3 flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter your origin city (e.g. Kolkata, Delhi, Siliguri)..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button type="submit" size="sm" icon={Search}>
            Set
          </Button>
          {onRequestGPS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onRequestGPS();
                setShowLocationSearch(false);
              }}
              title="Use Current GPS"
            >
              <LocateFixed className="w-3.5 h-3.5" />
            </Button>
          )}
        </form>
      )}

      {/* Route metrics */}
      {loading ? (
        <div className="py-4 animate-pulse flex flex-col gap-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
        </div>
      ) : routeInfo ? (
        <div className="mt-4 flex flex-col gap-3">
          {/* Main Road Distance Headline */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sunset-500 shrink-0" />
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                {routeInfo.isRoadDistance
                  ? `Road distance: ${routeInfo.formattedDistance}, ${routeInfo.formattedDuration}`
                  : `Approx. straight-line distance: ${routeInfo.formattedDistance}`}
              </span>
            </div>
            {routeInfo.isRoadDistance && (
              <span className="text-xs text-slate-400">
                (Straight-line: {routeInfo.haversineKm} km)
              </span>
            )}
          </div>

          {/* Fallback label if OSRM was replaced by Haversine */}
          {!routeInfo.isRoadDistance && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
              Road driving network server unreachable; calculated via great-circle Haversine formula.
            </p>
          )}

          {/* Travel cost estimate badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <span className="font-semibold text-brand-900 dark:text-brand-300 block">
                Estimated Road Travel Cost:
              </span>
              <span className="text-[11px] text-slate-500">
                Based on ~₹{DRIVING_RATE_PER_KM}/km fuel, toll & vehicle running
              </span>
            </div>
            <span className="text-base font-extrabold text-brand-700 dark:text-brand-300">
              {formatCurrency(routeInfo.travelCost)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 mt-3">
          Could not compute distance. Please grant location access or search your origin city.
        </p>
      )}
    </div>
  );
}

export default DistanceInfo;
