import React from 'react';
import { Compass, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            WanderSpot
          </span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>Map tiles &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-brand-500">OpenStreetMap contributors</a></span>
          <span>•</span>
          <span>Weather by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline hover:text-brand-500">Open-Meteo</a></span>
          <span>•</span>
          <span>Routing via <a href="https://project-osrm.org/" target="_blank" rel="noreferrer" className="underline hover:text-brand-500">OSRM</a></span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
          <span>for passionate explorers</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
