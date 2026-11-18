import { calculateHaversineDistance } from '../utils/distance';
import { formatDistance, formatDuration } from '../utils/format';
import { calculateTravelCost } from '../utils/price';

// Cache in-memory: key = `${userLat.toFixed(3)},${userLng.toFixed(3)};${spotLat.toFixed(3)},${spotLng.toFixed(3)}`
const routeCache = new Map();

/**
 * Calculates road distance and driving duration from user location to tourist spot using OSRM.
 * Implements a strict 5-second timeout and silently falls back to Haversine straight-line distance.
 * 
 * @param {Object} params
 * @param {number} params.userLat
 * @param {number} params.userLng
 * @param {number} params.spotLat
 * @param {number} params.spotLng
 * @returns {Promise<{
 *   isRoadDistance: boolean,
 *   distanceMeters: number,
 *   distanceKm: number,
 *   durationSeconds: number,
 *   formattedDistance: string,
 *   formattedDuration: string,
 *   haversineKm: number,
 *   travelCost: number
 * }>}
 */
export async function getRoadRoute({ userLat, userLng, spotLat, spotLng }) {
  const haversineKm = calculateHaversineDistance(userLat, userLng, spotLat, spotLng);

  if (!userLat || !userLng || !spotLat || !spotLng) {
    return {
      isRoadDistance: false,
      distanceMeters: 0,
      distanceKm: 0,
      durationSeconds: 0,
      formattedDistance: '0 km',
      formattedDuration: '0 min',
      haversineKm: 0,
      travelCost: 0,
    };
  }

  // Generate cache key
  const cacheKey = `${userLat.toFixed(3)},${userLng.toFixed(3)};${spotLat.toFixed(3)},${spotLng.toFixed(3)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }

  // Controller for 5-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // Note: OSRM expects longitude FIRST, then latitude
    const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${spotLng},${spotLat}?overview=false`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM HTTP status ${response.status}`);
    }

    const json = await response.json();
    if (!json.routes || json.routes.length === 0) {
      throw new Error('No driving route found');
    }

    const route = json.routes[0];
    const distanceMeters = route.distance; // meters
    const durationSeconds = route.duration; // seconds
    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
    const travelCost = calculateTravelCost(distanceKm);

    const result = {
      isRoadDistance: true,
      distanceMeters,
      distanceKm,
      durationSeconds,
      formattedDistance: formatDistance(distanceMeters),
      formattedDuration: formatDuration(durationSeconds),
      haversineKm,
      travelCost,
    };

    routeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    // Silent fallback to Haversine straight-line distance
    // In driving conditions, road distance is typically ~1.3x straight line
    const approxRoadKm = Math.round(haversineKm * 1.3 * 10) / 10;
    // Assume average 45 km/h driving speed in mixed Indian terrain
    const approxDurationSeconds = Math.round((approxRoadKm / 45) * 3600);
    const travelCost = calculateTravelCost(approxRoadKm);

    const fallbackResult = {
      isRoadDistance: false,
      distanceMeters: approxRoadKm * 1000,
      distanceKm: approxRoadKm,
      durationSeconds: approxDurationSeconds,
      formattedDistance: `${haversineKm} km`,
      formattedDuration: formatDuration(approxDurationSeconds),
      haversineKm,
      travelCost,
      fallbackReason: err.name === 'AbortError' ? 'timeout' : 'network',
    };

    routeCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
}
