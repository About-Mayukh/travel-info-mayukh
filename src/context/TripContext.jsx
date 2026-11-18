import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateHaversineDistance } from '../utils/distance';
import { calculateTravelCost } from '../utils/price';

const TripContext = createContext(null);
const LOCAL_TRIP_KEY = 'wanderspot_trip_itinerary';

const DEFAULT_DAYS = [
  { day: 1, title: 'Day 1 - Arrival & Exploration', spots: [] },
  { day: 2, title: 'Day 2 - Highlights & Sights', spots: [] },
  { day: 3, title: 'Day 3 - Leisure & Local Markets', spots: [] },
];

export function TripProvider({ children }) {
  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TRIP_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load trip', e);
    }
    return DEFAULT_DAYS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_TRIP_KEY, JSON.stringify(days));
    } catch (e) {
      console.warn('Failed to save trip', e);
    }
  }, [days]);

  const addSpotToDay = (spot, targetDayNumber = 1) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day === targetDayNumber) {
          // Check if already in this day
          if (d.spots.some((s) => s.id === spot.id)) return d;
          return { ...d, spots: [...d.spots, spot] };
        }
        return d;
      })
    );
  };

  const removeSpotFromDay = (spotId, targetDayNumber) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day === targetDayNumber) {
          return { ...d, spots: d.spots.filter((s) => s.id !== spotId) };
        }
        return d;
      })
    );
  };

  const reorderDaySpots = (targetDayNumber, newSpots) => {
    setDays((prev) =>
      prev.map((d) => (d.day === targetDayNumber ? { ...d, spots: newSpots } : d))
    );
  };

  const addDay = () => {
    setDays((prev) => {
      const nextDayNum = prev.length + 1;
      return [
        ...prev,
        { day: nextDayNum, title: `Day ${nextDayNum} - New Itinerary`, spots: [] },
      ];
    });
  };

  const removeDay = (dayNum) => {
    setDays((prev) => {
      if (prev.length <= 1) return prev;
      return prev
        .filter((d) => d.day !== dayNum)
        .map((d, index) => ({
          ...d,
          day: index + 1,
          title: d.title.replace(/Day \d+/, `Day ${index + 1}`),
        }));
    });
  };

  const clearTrip = () => {
    setDays(DEFAULT_DAYS);
  };

  // Compute trip totals
  let totalTicketCost = 0;
  let totalDistanceKm = 0;
  let totalSpotsCount = 0;

  days.forEach((d) => {
    totalSpotsCount += d.spots.length;
    d.spots.forEach((spot, idx) => {
      totalTicketCost += Number(spot.adult_price || 0);

      // Distance between consecutive spots in the same day
      if (idx > 0) {
        const prev = d.spots[idx - 1];
        if (prev.latitude && prev.longitude && spot.latitude && spot.longitude) {
          totalDistanceKm += calculateHaversineDistance(
            prev.latitude,
            prev.longitude,
            spot.latitude,
            spot.longitude
          );
        }
      }
    });
  });

  const estimatedTravelCost = calculateTravelCost(totalDistanceKm);
  const grandTotalCost = totalTicketCost + estimatedTravelCost;

  const value = {
    days,
    addSpotToDay,
    removeSpotFromDay,
    reorderDaySpots,
    addDay,
    removeDay,
    clearTrip,
    totalTicketCost,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    estimatedTravelCost,
    grandTotalCost,
    totalSpotsCount,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
