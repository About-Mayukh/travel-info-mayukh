import { supabase, isSupabaseConfigured, INITIAL_SEED_REVIEWS } from '../lib/supabase';

const LOCAL_REVIEWS_KEY = 'wanderspot_local_reviews';

function getLocalReviews() {
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local reviews', e);
  }
  return [...INITIAL_SEED_REVIEWS];
}

function saveLocalReviews(reviews) {
  localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
}

/**
 * Get all reviews for a specific tourist spot
 */
export async function getReviewsBySpot(spotId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, user_id, profiles(full_name, avatar_url)')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((r) => ({
        id: r.id,
        spot_id: spotId,
        user_id: r.user_id,
        user_name: r.profiles?.full_name || 'Travel Enthusiast',
        user_avatar: r.profiles?.avatar_url || null,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));
    }
  }

  const reviews = getLocalReviews();
  return reviews
    .filter((r) => String(r.spot_id) === String(spotId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Add a new review to a spot
 */
export async function addReview({ spotId, rating, comment, userId, userName, userAvatar }) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          spot_id: spotId,
          user_id: userId,
          rating: parseInt(rating, 10),
          comment,
        },
      ])
      .select('id, rating, comment, created_at, user_id, profiles(full_name, avatar_url)')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      spot_id: spotId,
      user_id: data.user_id,
      user_name: data.profiles?.full_name || userName || 'Travel Enthusiast',
      user_avatar: data.profiles?.avatar_url || userAvatar,
      rating: data.rating,
      comment: data.comment,
      created_at: data.created_at,
    };
  }

  const reviews = getLocalReviews();
  const newReview = {
    id: 'rev-' + Math.random().toString(36).substring(2, 9),
    spot_id: spotId,
    user_id: userId || 'demo-user',
    user_name: userName || 'Fellow Traveller',
    user_avatar: userAvatar || null,
    rating: parseInt(rating, 10),
    comment,
    created_at: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  saveLocalReviews(reviews);
  return newReview;
}

/**
 * Delete a review (by user or admin)
 */
export async function deleteReview(reviewId) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    if (error) throw error;
    return true;
  }

  const reviews = getLocalReviews();
  const filtered = reviews.filter((r) => String(r.id) !== String(reviewId));
  saveLocalReviews(filtered);
  return true;
}

/**
 * Admin: Get all reviews across all spots for moderation
 */
export async function getAllReviews() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, user_id, spot_id, spots(name, area), profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((r) => ({
        id: r.id,
        spot_id: r.spot_id,
        spot_name: r.spots?.name || 'Tourist Spot',
        spot_area: r.spots?.area || '',
        user_id: r.user_id,
        user_name: r.profiles?.full_name || 'User',
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));
    }
  }

  return getLocalReviews();
}
