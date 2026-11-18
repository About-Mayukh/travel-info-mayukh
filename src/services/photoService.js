import { supabase, isSupabaseConfigured, INITIAL_SEED_PHOTOS } from '../lib/supabase';
import { validatePhotoFile } from '../utils/validators';

const LOCAL_PHOTOS_KEY = 'wanderspot_local_photos';

function getLocalPhotos() {
  try {
    const raw = localStorage.getItem(LOCAL_PHOTOS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local photos', e);
  }
  return [...INITIAL_SEED_PHOTOS];
}

function saveLocalPhotos(photos) {
  localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(photos));
}

/**
 * Get approved photos for a spot (or all photos if isAdmin is true)
 */
export async function getPhotosBySpot(spotId, isAdmin = false) {
  if (isSupabaseConfigured()) {
    let query = supabase
      .from('photos')
      .select('id, image_url, approved, likes, created_at, user_id, profiles(full_name, avatar_url)')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('approved', true);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((p) => ({
        id: p.id,
        spot_id: spotId,
        image_url: p.image_url,
        approved: p.approved,
        likes: p.likes || 0,
        created_at: p.created_at,
        user_id: p.user_id,
        user_name: p.profiles?.full_name || 'Community Visitor',
      }));
    }
  }

  const photos = getLocalPhotos();
  return photos
    .filter((p) => String(p.spot_id) === String(spotId) && (isAdmin || p.approved))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Upload a photo for a spot
 * Handles file validation, Supabase Storage upload, and DB record creation
 */
export async function uploadPhoto({ spotId, file, userId, userName }) {
  const validation = validatePhotoFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (isSupabaseConfigured() && userId) {
    // 1. Upload to Supabase Storage bucket 'spot-photos'
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('spot-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('spot-photos')
      .getPublicUrl(filePath);

    // 3. Insert record into 'photos' table
    const { data, error: insertError } = await supabase
      .from('photos')
      .insert([
        {
          spot_id: spotId,
          user_id: userId,
          image_url: publicUrl,
          approved: true, // Default approved or pending
          likes: 0,
        },
      ])
      .select('*, profiles(full_name)')
      .single();

    if (insertError) throw insertError;
    return {
      ...data,
      user_name: userName || data.profiles?.full_name || 'Community Visitor',
    };
  }

  // Fallback demo upload using FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const photos = getLocalPhotos();
      const newPhoto = {
        id: 'photo-' + Math.random().toString(36).substring(2, 9),
        spot_id: spotId,
        user_id: userId || 'demo-user',
        user_name: userName || 'Fellow Traveller',
        image_url: reader.result,
        approved: true,
        likes: 0,
        created_at: new Date().toISOString(),
      };
      photos.unshift(newPhoto);
      saveLocalPhotos(photos);
      resolve(newPhoto);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Increment or decrement likes for a photo
 */
export async function toggleLikePhoto(photoId) {
  if (isSupabaseConfigured()) {
    // Supabase RPC or direct update
    const { data: current } = await supabase
      .from('photos')
      .select('likes')
      .eq('id', photoId)
      .single();

    const newLikes = (current?.likes || 0) + 1;
    await supabase.from('photos').update({ likes: newLikes }).eq('id', photoId);
    return newLikes;
  }

  const photos = getLocalPhotos();
  const photo = photos.find((p) => String(p.id) === String(photoId));
  if (photo) {
    photo.likes = (photo.likes || 0) + 1;
    saveLocalPhotos(photos);
    return photo.likes;
  }
  return 1;
}

/**
 * Admin: Get all photos for moderation
 */
export async function getAllPhotos() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('photos')
      .select('*, spots(name, area), profiles(full_name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((p) => ({
        id: p.id,
        spot_id: p.spot_id,
        spot_name: p.spots?.name || 'Tourist Spot',
        spot_area: p.spots?.area || '',
        user_id: p.user_id,
        user_name: p.profiles?.full_name || 'Visitor',
        image_url: p.image_url,
        approved: p.approved,
        likes: p.likes || 0,
        created_at: p.created_at,
      }));
    }
  }

  return getLocalPhotos();
}

/**
 * Admin: Approve a photo
 */
export async function approvePhoto(photoId) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('photos')
      .update({ approved: true })
      .eq('id', photoId);
    if (error) throw error;
    return true;
  }

  const photos = getLocalPhotos();
  const photo = photos.find((p) => String(p.id) === String(photoId));
  if (photo) {
    photo.approved = true;
    saveLocalPhotos(photos);
  }
  return true;
}

/**
 * Admin: Reject / Unapprove a photo
 */
export async function rejectPhoto(photoId) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('photos')
      .update({ approved: false })
      .eq('id', photoId);
    if (error) throw error;
    return true;
  }

  const photos = getLocalPhotos();
  const photo = photos.find((p) => String(p.id) === String(photoId));
  if (photo) {
    photo.approved = false;
    saveLocalPhotos(photos);
  }
  return true;
}

/**
 * Admin: Delete a photo
 */
export async function deletePhoto(photoId) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);
    if (error) throw error;
    return true;
  }

  const photos = getLocalPhotos();
  const filtered = photos.filter((p) => String(p.id) !== String(photoId));
  saveLocalPhotos(filtered);
  return true;
}
