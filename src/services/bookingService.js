import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_BOOKINGS_KEY = 'wanderspot_local_bookings';

function getLocalBookings() {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local bookings', e);
  }
  return [];
}

function saveLocalBookings(bookings) {
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
}

/**
 * Creates a new booking entry
 */
export async function createBooking({ spotId, spotName, spotArea, spotImage, userId, visitDate, adults = 1, children = 0, totalPrice = 0 }) {
  if (isSupabaseConfigured() && userId) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          spot_id: spotId,
          user_id: userId,
          visit_date: visitDate,
          adults: parseInt(adults, 10),
          children: parseInt(children, 10),
          total_price: parseFloat(totalPrice),
        },
      ])
      .select('*, spots(name, area, cover_image)')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      spot_id: spotId,
      spot_name: data.spots?.name || spotName,
      spot_area: data.spots?.area || spotArea,
      spot_image: data.spots?.cover_image || spotImage,
      visit_date: data.visit_date,
      adults: data.adults,
      children: data.children,
      total_price: data.total_price,
      created_at: data.created_at,
    };
  }

  const bookings = getLocalBookings();
  const newBooking = {
    id: 'book-' + Math.random().toString(36).substring(2, 9),
    spot_id: spotId,
    spot_name: spotName || 'Scenic Tourist Spot',
    spot_area: spotArea || '',
    spot_image: spotImage || null,
    user_id: userId || 'demo-user',
    visit_date: visitDate || new Date().toISOString().split('T')[0],
    adults: parseInt(adults, 10),
    children: parseInt(children, 10),
    total_price: parseFloat(totalPrice),
    created_at: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  saveLocalBookings(bookings);
  return newBooking;
}

/**
 * Get all bookings made by a user
 */
export async function getUserBookings(userId) {
  if (isSupabaseConfigured() && userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, spots(id, name, area, cover_image, adult_price, child_price)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((b) => ({
        id: b.id,
        spot_id: b.spot_id,
        spot_name: b.spots?.name || 'Tourist Spot',
        spot_area: b.spots?.area || '',
        spot_image: b.spots?.cover_image,
        visit_date: b.visit_date,
        adults: b.adults,
        children: b.children,
        total_price: b.total_price,
        created_at: b.created_at,
      }));
    }
  }

  const bookings = getLocalBookings();
  return bookings.filter((b) => !userId || String(b.user_id) === String(userId));
}

/**
 * Cancel or delete a booking
 */
export async function deleteBooking(bookingId) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);
    if (error) throw error;
    return true;
  }

  const bookings = getLocalBookings();
  const filtered = bookings.filter((b) => String(b.id) !== String(bookingId));
  saveLocalBookings(filtered);
  return true;
}
