import { supabase, isSupabaseConfigured, INITIAL_SEED_SPOTS } from '../lib/supabase';
import { getReviewsBySpot } from './reviewService';

const LOCAL_SPOTS_KEY = 'wanderspot_local_spots';

function getLocalSpots() {
  try {
    const raw = localStorage.getItem(LOCAL_SPOTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local spots', e);
  }
  return [...INITIAL_SEED_SPOTS];
}

function saveLocalSpots(spots) {
  localStorage.setItem(LOCAL_SPOTS_KEY, JSON.stringify(spots));
}

/**
 * Attaches calculated rating statistics and top 2 reviews to a spot
 */
async function enrichSpotWithReviews(spot) {
  try {
    const reviews = await getReviewsBySpot(spot.id);
    const count = reviews.length;
    const avg = count > 0 
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / count)
      : 5.0; // Default rating for initial spots
    
    return {
      ...spot,
      average_rating: Math.round(avg * 10) / 10,
      review_count: count > 0 ? count : (spot.review_count || 12),
      top_reviews: reviews.slice(0, 2),
    };
  } catch (e) {
    return {
      ...spot,
      average_rating: spot.average_rating || 4.8,
      review_count: spot.review_count || 12,
      top_reviews: [],
    };
  }
}

/**
 * Fetch all tourist spots
 */
export async function getAllSpots() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('spots')
      .select('*, reviews(rating, comment, id, created_at)')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((spot) => {
        const revs = spot.reviews || [];
        const count = revs.length;
        const avg = count > 0 ? revs.reduce((acc, r) => acc + (r.rating || 5), 0) / count : 4.8;
        return {
          ...spot,
          average_rating: Math.round(avg * 10) / 10,
          review_count: count,
          top_reviews: revs.slice(0, 2),
        };
      });
    }
  }

  const spots = getLocalSpots();
  return Promise.all(spots.map(enrichSpotWithReviews));
}

/**
 * Search spots by area with debounced query
 * Matches spots.area case-insensitively
 */
export async function getSpotsByArea(areaQuery = '') {
  const query = areaQuery.trim().toLowerCase();
  if (!query) return [];

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('spots')
      .select('*, reviews(rating, comment, id, created_at)')
      .ilike('area', `%${query}%`);

    if (!error && data && data.length > 0) {
      return data.map((spot) => {
        const revs = spot.reviews || [];
        const count = revs.length;
        const avg = count > 0 ? revs.reduce((acc, r) => acc + (r.rating || 5), 0) / count : 4.8;
        return {
          ...spot,
          average_rating: Math.round(avg * 10) / 10,
          review_count: count,
          top_reviews: revs.slice(0, 2),
        };
      });
    }
  }

  const spots = getLocalSpots();
  const filtered = spots.filter(
    (s) => s.area.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
  );
  return Promise.all(filtered.map(enrichSpotWithReviews));
}

/**
 * Get distinct list of areas currently in the catalog
 */
export async function getDistinctAreas() {
  const spots = await getAllSpots();
  const areas = Array.from(new Set(spots.map((s) => s.area))).filter(Boolean);
  return areas.sort();
}

/**
 * Get a single spot by its ID
 */
export async function getSpotById(spotId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('spots')
      .select('*, reviews(id, rating, comment, created_at, profiles(full_name, avatar_url))')
      .eq('id', spotId)
      .single();

    if (!error && data) {
      const revs = data.reviews || [];
      const count = revs.length;
      const avg = count > 0 ? revs.reduce((acc, r) => acc + (r.rating || 5), 0) / count : 4.8;
      return {
        ...data,
        average_rating: Math.round(avg * 10) / 10,
        review_count: count,
        top_reviews: revs.slice(0, 2),
      };
    }
  }

  const spots = getLocalSpots();
  const found = spots.find((s) => String(s.id) === String(spotId));
  if (!found) return null;
  return enrichSpotWithReviews(found);
}

/**
 * Get top rated spots for home screen
 */
export async function getTopRatedSpots(limit = 6) {
  const spots = await getAllSpots();
  return spots
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, limit);
}

/**
 * Get trending spots (sorted by activity/review count)
 */
export async function getTrendingSpots(limit = 6) {
  const spots = await getAllSpots();
  return spots
    .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    .slice(0, limit);
}

/**
 * Admin: Create a new spot
 */
export async function createSpot(spotData) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('spots')
      .insert([spotData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const spots = getLocalSpots();
  const newSpot = {
    ...spotData,
    id: 'spot-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
  };
  spots.unshift(newSpot);
  saveLocalSpots(spots);
  return newSpot;
}

/**
 * Admin: Update an existing spot
 */
export async function updateSpot(id, updates) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('spots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const spots = getLocalSpots();
  const idx = spots.findIndex((s) => String(s.id) === String(id));
  if (idx === -1) throw new Error('Spot not found');
  spots[idx] = { ...spots[idx], ...updates };
  saveLocalSpots(spots);
  return spots[idx];
}

/**
 * Admin: Delete a spot
 */
export async function deleteSpot(id) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('spots')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  const spots = getLocalSpots();
  const filtered = spots.filter((s) => String(s.id) !== String(id));
  saveLocalSpots(filtered);
  return true;
}
