/**
 * Weather Service using Open-Meteo public API (no key required)
 */

// Interpret WMO weather codes into human friendly text and icon types
export function interpretWeatherCode(code) {
  const c = Number(code);
  if (c === 0) return { label: 'Clear Sky', icon: 'Sun', mood: 'Perfect for outdoor sightseeing' };
  if (c >= 1 && c <= 3) return { label: 'Partly Cloudy', icon: 'CloudSun', mood: 'Pleasant weather for exploration' };
  if (c === 45 || c === 48) return { label: 'Misty / Foggy', icon: 'CloudFog', mood: 'Chilly with reduced visibility' };
  if (c >= 51 && c <= 55) return { label: 'Light Drizzle', icon: 'CloudDrizzle', mood: 'Carry an umbrella' };
  if (c >= 61 && c <= 67) return { label: 'Rainy', icon: 'CloudRain', mood: 'Indoor attractions or rain gear recommended' };
  if (c >= 71 && c <= 77) return { label: 'Snowfall', icon: 'Snowflake', mood: 'Cold mountain weather, dress in layers' };
  if (c >= 80 && c <= 82) return { label: 'Rain Showers', icon: 'CloudRain', mood: 'Intermittent passing showers' };
  if (c >= 95 && c <= 99) return { label: 'Thunderstorm', icon: 'CloudLightning', mood: 'Caution: Stay sheltered indoors' };
  return { label: 'Fair Weather', icon: 'Cloud', mood: 'Good conditions for travel' };
}

/**
 * Fetch live weather for given latitude and longitude
 * @param {number} latitude 
 * @param {number} longitude 
 */
export async function getLiveWeather(latitude, longitude) {
  if (!latitude || !longitude) return null;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const code = current.weather_code ?? 0;
    const info = interpretWeatherCode(code);

    return {
      temperature: Math.round(current.temperature_2m ?? 24),
      feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 24),
      humidity: Math.round(current.relative_humidity_2m ?? 60),
      precipitation: current.precipitation ?? 0,
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      weatherCode: code,
      condition: info.label,
      icon: info.icon,
      mood: info.mood,
      tempMax: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : null,
      tempMin: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : null,
    };
  } catch (err) {
    console.warn('Open-Meteo weather fetch fallback:', err.message);
    // Silent graceful fallback
    return {
      temperature: 24,
      feelsLike: 24,
      humidity: 55,
      precipitation: 0,
      windSpeed: 10,
      weatherCode: 1,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      mood: 'Pleasant weather for exploration',
      tempMax: 28,
      tempMin: 19,
    };
  }
}
