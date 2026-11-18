/**
 * Geocoding Service using OpenStreetMap Nominatim
 * Compliance requirements:
 * 1. Search ONLY on button click or Enter keypress (NO autocomplete/as-you-type requests)
 * 2. Rate-limited to at most 1 request per second
 * 3. Clear User-Agent identifying the app
 */

let lastRequestTimestamp = 0;

/**
 * Resolves a city or town name into geographic coordinates (latitude & longitude)
 * @param {string} cityName 
 * @returns {Promise<{ lat: number, lng: number, displayName: string } | null>}
 */
export async function geocodeCity(cityName) {
  const query = cityName.trim();
  if (!query) return null;

  // Rate limit: enforce at least 1000ms delay between calls
  const now = Date.now();
  const timeSinceLast = now - lastRequestTimestamp;
  if (timeSinceLast < 1050) {
    await new Promise((resolve) => setTimeout(resolve, 1050 - timeSinceLast));
  }
  lastRequestTimestamp = Date.now();

  try {
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }

    const first = data[0];
    return {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      displayName: first.display_name,
    };
  } catch (err) {
    console.error('Nominatim geocode failed', err);
    return null;
  }
}
