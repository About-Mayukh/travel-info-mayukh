import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SpotMarker from './SpotMarker';

// Helper component to auto-fit map bounds when spots change
function MapBoundsUpdater({ spots, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (spots && spots.length > 1) {
      const validCoords = spots
        .filter((s) => s.latitude && s.longitude)
        .map((s) => [s.latitude, s.longitude]);

      if (validCoords.length > 1) {
        map.fitBounds(validCoords, { padding: [40, 40], maxZoom: 14 });
        return;
      }
    }

    if (center) {
      map.setView(center, zoom || 12);
    }
  }, [map, spots, center, zoom]);

  return null;
}

export function SpotsMap({
  spots = [],
  singleSpot = null,
  centerCoords = null,
  zoomLevel = 12,
  height = '420px',
  className = '',
}) {
  const displaySpots = useMemo(() => {
    if (singleSpot) return [singleSpot];
    return spots;
  }, [singleSpot, spots]);

  // Determine center point
  const mapCenter = useMemo(() => {
    if (centerCoords) return centerCoords;
    if (singleSpot && singleSpot.latitude && singleSpot.longitude) {
      return [singleSpot.latitude, singleSpot.longitude];
    }
    if (spots.length > 0 && spots[0].latitude && spots[0].longitude) {
      return [spots[0].latitude, spots[0].longitude];
    }
    return [26.9855, 75.8513]; // Default to Jaipur center
  }, [centerCoords, singleSpot, spots]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapBoundsUpdater spots={displaySpots} center={mapCenter} zoom={zoomLevel} />
        {displaySpots.map((spot) => (
          <SpotMarker key={spot.id} spot={spot} />
        ))}
      </MapContainer>
    </div>
  );
}

export default SpotsMap;
