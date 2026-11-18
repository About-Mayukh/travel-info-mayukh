/**
 * Formatting utilities for WanderSpot
 */

/**
 * Formats distance in meters or kilometers
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted string, e.g. "142 km" or "850 m"
 */
export function formatDistance(meters) {
  if (meters === undefined || meters === null || isNaN(meters)) return '0 km';
  
  const m = Math.round(Number(meters));
  if (m < 1000) {
    return `${m} m`;
  }
  const km = (m / 1000).toFixed(1);
  return `${km.endsWith('.0') ? km.slice(0, -2) : km} km`;
}

/**
 * Formats duration from seconds into human readable format
 * e.g. "about 3 h 10 min", "about 45 min"
 * @param {number} seconds - Travel time in seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return 'less than 1 min';
  
  const totalMins = Math.round(Number(seconds) / 60);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours === 0) {
    return `about ${mins} min`;
  }
  if (mins === 0) {
    return `about ${hours} h`;
  }
  return `about ${hours} h ${mins} min`;
}

/**
 * Formats a currency value in Indian Rupees (INR)
 * @param {number} amount 
 * @returns {string} e.g. "₹250" or "Free"
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) return 'Free';
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Formats date to a clean readable string, e.g. "18 Nov 2024"
 * @param {string|Date} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formats rating to 1 decimal place, e.g. 4.8
 * @param {number} rating 
 * @returns {string}
 */
export function formatRating(rating) {
  const num = Number(rating);
  if (isNaN(num) || num <= 0) return 'New';
  return num.toFixed(1);
}
