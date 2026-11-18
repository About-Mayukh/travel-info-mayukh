import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../services/favoriteService';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getUserFavorites(user.id);
      setFavorites(data);
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const checkIsFavorite = (spotId) => {
    return favorites.some((s) => String(s.id) === String(spotId));
  };

  const toggleFavoriteSpot = async (spot) => {
    if (!user) return false;

    const alreadyFav = checkIsFavorite(spot.id);
    if (alreadyFav) {
      // Optimistic update
      setFavorites((prev) => prev.filter((s) => String(s.id) !== String(spot.id)));
      await removeFavorite(user.id, spot.id);
      return false;
    } else {
      // Optimistic update
      setFavorites((prev) => [spot, ...prev]);
      await addFavorite(user.id, spot);
      return true;
    }
  };

  return {
    favorites,
    loading,
    checkIsFavorite,
    toggleFavorite: toggleFavoriteSpot,
    refreshFavorites: fetchFavorites,
  };
}

export default useFavorites;
