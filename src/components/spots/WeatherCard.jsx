import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudFog,
  CloudDrizzle,
  Snowflake,
  CloudLightning,
  Cloud,
  Wind,
  Droplets,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getLiveWeather } from '../../services/weatherService';

const ICON_MAP = {
  Sun: Sun,
  CloudSun: CloudSun,
  CloudRain: CloudRain,
  CloudFog: CloudFog,
  CloudDrizzle: CloudDrizzle,
  Snowflake: Snowflake,
  CloudLightning: CloudLightning,
  Cloud: Cloud,
};

export function WeatherCard({ latitude, longitude, bestTime = '' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      if (!latitude || !longitude) return;
      setLoading(true);
      try {
        const data = await getLiveWeather(latitude, longitude);
        if (isMounted) setWeather(data);
      } catch (e) {
        console.error('Weather card error', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  const WeatherIcon = weather?.icon ? (ICON_MAP[weather.icon] || Sun) : Sun;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-cyan-50/60 via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Live Weather & Best Time</span>
        </h4>
        <span className="text-[11px] font-medium text-slate-400">Open-Meteo</span>
      </div>

      {/* Best Time To Visit Banner */}
      {bestTime && (
        <div className="mt-3.5 mb-3 flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 text-xs">
          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              Best Time to Visit:
            </span>
            <span className="text-amber-900 dark:text-amber-200/90 font-medium">
              {bestTime}
            </span>
          </div>
        </div>
      )}

      {/* Current Live Weather */}
      {loading ? (
        <div className="py-4 animate-pulse flex flex-col gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
        </div>
      ) : weather ? (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 shadow-sm">
              <WeatherIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {weather.temperature}°C
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  (Feels like {weather.feelsLike}°C)
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {weather.condition}
              </p>
              <p className="text-[11px] text-slate-400 italic mt-0.5">
                {weather.mood}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-right">
            <div className="flex items-center justify-end gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" />
              <span>{weather.humidity}% Humidity</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span>{weather.windSpeed} km/h Wind</span>
            </div>
            {weather.tempMax !== null && weather.tempMin !== null && (
              <span className="text-[10px] text-slate-400">
                H: {weather.tempMax}° • L: {weather.tempMin}°
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default WeatherCard;
