import { useState, useEffect, useMemo } from 'react';
import { getAllSpots, getSpotsByArea } from '../services/spotService';
import { calculateHaversineDistance } from '../utils/distance';

export function useSpots({ area = '', userLocation = null } = {}) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and sorting
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'rating', 'price-low', 'price-high', 'distance'

  useEffect(() => {
    let isMounted = true;
    async function fetchSpots() {
      setLoading(true);
      setError(null);
      try {
        let data = [];
        if (area && area.trim()) {
          data = await getSpotsByArea(area);
        } else {
          data = await getAllSpots();
        }
        if (isMounted) {
          setSpots(data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch tourist spots');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSpots();
    return () => {
      isMounted = false;
    };
  }, [area]);

  // Enrich with Haversine distance from user location for quick list view
  const enrichedSpots = useMemo(() => {
    return spots.map((spot) => {
      let straightDistance = null;
      if (userLocation && userLocation.lat && userLocation.lng) {
        straightDistance = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          spot.latitude,
          spot.longitude
        );
      }
      return {
        ...spot,
        distanceKm: straightDistance,
      };
    });
  }, [spots, userLocation]);

  // Apply filters and sorting
  const filteredSpots = useMemo(() => {
    return enrichedSpots
      .filter((spot) => {
        // Category filter
        if (selectedCategory !== 'all' && spot.category !== selectedCategory) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && (spot.average_rating || 0) < minRating) {
          return false;
        }
        // Price filter
        if (maxPrice < 1000 && (Number(spot.adult_price) || 0) > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.average_rating || 0) - (a.average_rating || 0);
        }
        if (sortBy === 'price-low') {
          return (Number(a.adult_price) || 0) - (Number(b.adult_price) || 0);
        }
        if (sortBy === 'price-high') {
          return (Number(b.adult_price) || 0) - (Number(a.adult_price) || 0);
        }
        if (sortBy === 'distance') {
          return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
        }
        // default: recommended (combination of rating & reviews)
        return (b.review_count || 0) * (b.average_rating || 1) - (a.review_count || 0) * (a.average_rating || 1);
      });
  }, [enrichedSpots, selectedCategory, minRating, maxPrice, sortBy]);

  return {
    spots: filteredSpots,
    rawCount: spots.length,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    minRating,
    setMinRating,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    refresh: async () => {
      const data = area ? await getSpotsByArea(area) : await getAllSpots();
      setSpots(data);
    },
  };
}

export default useSpots;
