import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Navigation, Heart, Quote, ArrowRight } from 'lucide-react';
import { useCardTilt } from '../../animations/cardTilt';
import { useFavorites } from '../../hooks/useFavorites';
import { formatCurrency, formatDistance } from '../../utils/format';

const CATEGORY_COLORS = {
  beach: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  hill: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  heritage: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  wildlife: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800',
  religious: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

export function SpotCard({ spot }) {
  const navigate = useNavigate();
  const { tiltStyle, handleMouseMove, handleMouseLeave } = useCardTilt({ maxTilt: 7 });
  const { checkIsFavorite, toggleFavorite } = useFavorites();

  const isFav = checkIsFavorite(spot.id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    await toggleFavorite(spot);
  };

  const handleCardClick = () => {
    navigate(`/spot/${spot.id}`);
  };

  const categoryStyle =
    CATEGORY_COLORS[spot.category?.toLowerCase()] ||
    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  return (
    <motion.div
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer overflow-hidden transition-shadow duration-300 select-none"
    >
      {/* Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={spot.cover_image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
          alt={spot.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-sm pointer-events-auto ${categoryStyle}`}
          >
            {spot.category || 'Spot'}
          </span>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="pointer-events-auto p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay: Area & Distance */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>{spot.area}</span>
          </div>

          {spot.distanceKm !== undefined && spot.distanceKm !== null && (
            <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
              <Navigation className="w-3 h-3 text-sunset-400" />
              <span>{Math.round(spot.distanceKm)} km away</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col flex-1 gap-2.5 justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
              {spot.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 font-bold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{spot.average_rating || 5.0}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({spot.review_count || 0})
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {spot.description}
          </p>

          {/* Top 2 Reviews Preview */}
          {spot.top_reviews && spot.top_reviews.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
              {spot.top_reviews.slice(0, 2).map((rev, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded-lg"
                >
                  <Quote className="w-3 h-3 text-brand-500 shrink-0 mt-0.5 not-italic" />
                  <span className="line-clamp-1">"{rev.comment}"</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Tickets From
            </span>
            <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
              {spot.adult_price > 0 ? `${formatCurrency(spot.adult_price)} / person` : 'Free Entry'}
            </span>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SpotCard;
