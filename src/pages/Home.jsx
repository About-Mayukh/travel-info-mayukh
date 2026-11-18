import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, TrendingUp, Star, Map, MapPin } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SearchBar from '../components/spots/SearchBar';
import SpotList from '../components/spots/SpotList';
import FilterBar from '../components/spots/FilterBar';
import SpotsMap from '../components/map/SpotsMap';
import { useSpots } from '../hooks/useSpots';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from '../components/ui/Button';

const FAMOUS_AREAS = ['Darjeeling', 'Jaipur', 'Digha', 'Goa', 'Munnar'];

export function Home() {
  const navigate = useNavigate();
  const { location, setManualCity, requestLocation } = useGeolocation();

  const [activeArea, setActiveArea] = useState('');
  const [showMap, setShowMap] = useState(false);

  const {
    spots,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    minRating,
    setMinRating,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    refresh,
  } = useSpots({ area: activeArea, userLocation: location });

  const handleSearchSubmit = (query) => {
    setActiveArea(query);
  };

  const handleChipClick = (areaName) => {
    if (activeArea === areaName) {
      setActiveArea('');
    } else {
      setActiveArea(areaName);
    }
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Unlocked Search Banner */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 tracking-tight">
          Where would you like to wander?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Search any area or city to discover its prime tourist spots, road driving distance, and reviews
        </p>

        {/* Search Bar - UNLOCKED after login */}
        <SearchBar
          isLocked={false}
          initialValue={activeArea}
          onSearch={handleSearchSubmit}
          placeholder="Search area (e.g. Digha, Darjeeling, Jaipur, Goa, Munnar)..."
          className="mb-4"
        />

        {/* Quick Area Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
          {FAMOUS_AREAS.map((area) => {
            const isSelected = activeArea.toLowerCase() === area.toLowerCase();
            return (
              <button
                key={area}
                onClick={() => handleChipClick(area)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Map Toggle Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sunset-500" />
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
              {activeArea ? `Spots in "${activeArea}"` : 'Prime Tourist Spots'}
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Map}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'Hide Map' : 'Explore on Map'}
          </Button>
        </div>

        {/* Map View Toggle */}
        {showMap && (
          <div className="my-4 animate-in fade-in duration-300">
            <SpotsMap spots={spots} height="400px" />
          </div>
        )}

        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          totalResults={spots.length}
        />
      </div>

      {/* Spots Grid */}
      <SpotList
        spots={spots}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle={activeArea ? `No tourist spots found in "${activeArea}"` : 'No tourist spots available'}
        emptyDescription={
          activeArea
            ? `We couldn't find tourist spots in "${activeArea}". Try searching for Digha, Darjeeling, Jaipur, Goa, or Munnar.`
            : 'No spots match your active filters. Try resetting the category or budget filters.'
        }
      />
    </PageWrapper>
  );
}

export default Home;
