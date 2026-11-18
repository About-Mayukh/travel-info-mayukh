/**
 * Validation utilities for WanderSpot
 */

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

/**
 * Validates an image file before upload
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePhotoFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select an image file.' };
  }

  if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPEG, PNG, WEBP, or GIF image.'
    };
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size is ${sizeInMB} MB. Maximum allowed image size is 5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Validates an email address format
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validates a rating value between 1 and 5
 * @param {number} rating 
 * @returns {boolean}
 */
export function validateRating(rating) {
  const num = parseInt(rating, 10);
  return !isNaN(num) && num >= 1 && num <= 5;
}

/**
 * Validates latitude and longitude coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export function validateCoordinates(lat, lng) {
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return (
    !isNaN(numLat) && numLat >= -90 && numLat <= 90 &&
    !isNaN(numLng) && numLng >= -180 && numLng <= 180
  );
}
