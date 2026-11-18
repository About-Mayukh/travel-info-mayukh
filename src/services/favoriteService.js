import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_FAVS_KEY = 'wanderspot_local_favorites';

function getLocalFavs() {
  try {
    const raw = localStorage.getItem(LOCAL_FAVS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local favorites', e);
  }
  return [];
}

function saveLocalFavs(favs) {
  localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(favs));
}

/**
 * Get all spots favorited by a user
 */
export async function getUserFavorites(userId) {
  if (isSupabaseConfigured() && userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('spot_id, spots(*)')
      .eq('user_id', userId);

    if (!error && data) {
      return data.map((f) => f.spots).filter(Boolean);
    }
  }

  const favs = getLocalFavs();
  return favs.filter((f) => !userId || String(f.user_id) === String(userId)).map((f) => f.spot);
}

/**
 * Check if a spot is favorited by user
 */
export async function isFavorite(userId, spotId) {
  if (!userId || !spotId) return false;

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('favorites')
      .select('spot_id')
      .eq('user_id', userId)
      .eq('spot_id', spotId)
      .maybeSingle();

    return !error && Boolean(data);
  }

  const favs = getLocalFavs();
  return favs.some((f) => String(f.user_id) === String(userId) && String(f.spot_id) === String(spotId));
}

/**
 * Add a spot to favorites
 */
export async function addFavorite(userId, spot) {
  if (!userId || !spot) return;

  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, spot_id: spot.id }]);
    if (error && error.code !== '23505') throw error; // Ignore unique constraint violation
    return true;
  }

  const favs = getLocalFavs();
  if (!favs.some((f) => String(f.user_id) === String(userId) && String(f.spot_id) === String(spot.id))) {
    favs.push({ user_id: userId, spot_id: spot.id, spot });
    saveLocalFavs(favs);
  }
  return true;
}

/**
 * Remove a spot from favorites
 */
export async function removeFavorite(userId, spotId) {
  if (!userId || !spotId) return;

  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('spot_id', spotId);
    if (error) throw error;
    return true;
  }

  const favs = getLocalFavs();
  const filtered = favs.filter(
    (f) => !(String(f.user_id) === String(userId) && String(f.spot_id) === String(spotId))
  );
  saveLocalFavs(filtered);
  return true;
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(userId, spot) {
  const alreadyFav = await isFavorite(userId, spot.id);
  if (alreadyFav) {
    await removeFavorite(userId, spot.id);
    return false;
  } else {
    await addFavorite(userId, spot);
    return true;
  }
}
