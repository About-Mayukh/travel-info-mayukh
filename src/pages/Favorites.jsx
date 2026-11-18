import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Compass, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SpotList from '../components/spots/SpotList';
import Button from '../components/ui/Button';
import { useFavorites } from '../hooks/useFavorites';
import Loader from '../components/ui/Loader';

export function Favorites() {
  const navigate = useNavigate();
  const { favorites, loading, refreshFavorites } = useFavorites();

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
              My Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Spots you have saved to visit on upcoming vacations and road trips
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Compass}
          onClick={() => navigate('/home')}
        >
          Explore More Spots
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading your saved spots..." />
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">
            Your wishlist is empty
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
            Tap the heart icon on any spot card to save destinations for your next adventure.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/home')}
            icon={Compass}
          >
            Start Exploring
          </Button>
        </div>
      ) : (
        <SpotList spots={favorites} onRetry={refreshFavorites} />
      )}
    </PageWrapper>
  );
}

export default Favorites;
