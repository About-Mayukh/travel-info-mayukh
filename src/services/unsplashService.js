/**
 * Unsplash Service (Admin cover photo search)
 * Strictly adheres to Unsplash API guidelines including download attribution triggers
 */

const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/**
 * Returns whether Unsplash integration is configured
 */
export function isUnsplashConfigured() {
  return Boolean(unsplashAccessKey && unsplashAccessKey.trim() !== '');
}

/**
 * Search photos on Unsplash by query (spot name + area)
 * @param {string} query 
 * @param {number} perPage 
 * @returns {Promise<Array<{
 *   id: string,
 *   regularUrl: string,
 *   thumbUrl: string,
 *   altDescription: string,
 *   photographerName: string,
 *   photographerUrl: string,
 *   downloadLocation: string
 * }>>}
 */
export async function searchUnsplashPhotos(query, perPage = 8) {
  if (!isUnsplashConfigured()) {
    return [];
  }

  try {
    const cleanQuery = encodeURIComponent(query.trim());
    const url = `https://api.unsplash.com/search/photos?query=${cleanQuery}&per_page=${perPage}&orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
    });

    if (!response.ok) {
      console.warn('Unsplash API returned status', response.status);
      return [];
    }

    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
      id: item.id,
      regularUrl: item.urls?.regular,
      thumbUrl: item.urls?.thumb || item.urls?.small,
      altDescription: item.alt_description || item.description || 'Travel spot photo',
      photographerName: item.user?.name || 'Photographer',
      photographerUrl: item.user?.links?.html
        ? `${item.user.links.html}?utm_source=wanderspot&utm_medium=referral`
        : 'https://unsplash.com/?utm_source=wanderspot&utm_medium=referral',
      downloadLocation: item.links?.download_location,
    }));
  } catch (err) {
    console.error('Error fetching Unsplash photos', err);
    return [];
  }
}

/**
 * Triggers Unsplash download endpoint as required by Unsplash API terms of service
 * @param {string} downloadLocation 
 */
export async function triggerUnsplashDownload(downloadLocation) {
  if (!downloadLocation || !isUnsplashConfigured()) return;

  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${unsplashAccessKey}`,
      },
    });
  } catch (err) {
    console.warn('Could not record Unsplash download endpoint trigger', err);
  }
}
