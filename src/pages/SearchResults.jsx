import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Map, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SearchBar from '../components/spots/SearchBar';
import SpotList from '../components/spots/SpotList';
import FilterBar from '../components/spots/FilterBar';
import SpotsMap from '../components/map/SpotsMap';
import { useSpots } from '../hooks/useSpots';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from '../components/ui/Button';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const areaQuery = searchParams.get('area') || '';

  const { location } = useGeolocation();
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
  } = useSpots({ area: areaQuery, userLocation: location });

  const handleSearch = (newQuery) => {
    setSearchParams({ area: newQuery });
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <SearchBar
          isLocked={false}
          initialValue={areaQuery}
          onSearch={handleSearch}
          placeholder="Search by area (e.g. Digha, Darjeeling, Jaipur)..."
          className="max-w-lg"
        />

        <Button
          variant="outline"
          size="sm"
          icon={Map}
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map' : 'Map View'}
        </Button>
      </div>

      {/* Area Headline */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-slate-100">
            {areaQuery ? `Prime Spots in ${areaQuery}` : 'All Destinations'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Showing verified tourist attractions with reviews and driving distance from your location
        </p>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="mb-6 animate-in fade-in duration-300">
          <SpotsMap spots={spots} height="380px" />
        </div>
      )}

      {/* Filters */}
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

      {/* Spot List */}
      <SpotList
        spots={spots}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle={`No prime spots found in "${areaQuery}"`}
        emptyDescription="Try searching for another tourist destination like Digha, Darjeeling, Jaipur, Goa, or Munnar."
      />
    </PageWrapper>
  );
}

export default SearchResults;
