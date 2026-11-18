import React from 'react';
import { Filter, SlidersHorizontal, Star, IndianRupee, Navigation } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Spots' },
  { id: 'beach', label: '🏖️ Beach' },
  { id: 'hill', label: '⛰️ Hill Station' },
  { id: 'heritage', label: '🏛️ Heritage' },
  { id: 'wildlife', label: '🐅 Wildlife' },
  { id: 'religious', label: '🛕 Religious' },
];

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  minRating,
  onMinRatingChange,
  maxPrice,
  onMaxPriceChange,
  totalResults = 0,
}) {
  return (
    <div className="flex flex-col gap-4 py-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-6">
      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-brand-600 text-white shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sorting & Advanced Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Min Rating:</span>
            <select
              value={minRating}
              onChange={(e) => onMinRatingChange(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value={0}>Any</option>
              <option value={4.0}>4.0+</option>
              <option value={4.5}>4.5+</option>
              <option value={4.8}>4.8+</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Budget:</span>
            <select
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value={1000}>All Prices</option>
              <option value={0}>Free Only (₹0)</option>
              <option value={100}>Under ₹100</option>
              <option value={200}>Under ₹200</option>
              <option value={500}>Under ₹500</option>
            </select>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Nearest Distance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <span className="text-slate-400 hidden sm:inline ml-1">
            ({totalResults} {totalResults === 1 ? 'spot' : 'spots'})
          </span>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
