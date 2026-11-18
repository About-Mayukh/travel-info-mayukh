import React, { useState, useEffect } from 'react';
import { Search, Lock, X, MapPin } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar({
  isLocked = false,
  initialValue = '',
  onSearch,
  placeholder = 'Search by area (e.g. Digha, Darjeeling, Jaipur, Goa, Munnar)...',
  className = '',
  autoFocus = false,
}) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, 350);
  const toast = useToast();

  useEffect(() => {
    if (!isLocked && onSearch && debouncedQuery !== undefined) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, isLocked, onSearch]);

  const handleLockedClick = (e) => {
    e.preventDefault();
    toast.info('Please log in to search');
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  if (isLocked) {
    return (
      <div
        onClick={handleLockedClick}
        role="button"
        tabIndex={0}
        aria-label="Locked search bar"
        className={`relative flex items-center w-full max-w-2xl px-5 py-4 rounded-2xl border border-slate-300/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-lg shadow-slate-200/40 dark:shadow-black/20 cursor-not-allowed group transition-all opacity-85 hover:opacity-100 ${className}`}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-amber-500 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-sm sm:text-base font-medium select-none flex-1">
            Search tourist spots (Locked — Log in to search)
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Login Required
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative flex items-center w-full px-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-md shadow-slate-200/50 dark:shadow-black/30 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all">
        <Search className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0 ml-1" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
