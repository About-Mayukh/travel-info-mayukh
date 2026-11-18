import React from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertCircle, RefreshCw } from 'lucide-react';
import SpotCard from './SpotCard';
import { SpotCardSkeleton } from '../ui/Skeleton';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../ui/Button';

export function SpotList({
  spots = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No tourist spots found',
  emptyDescription = 'Try adjusting your search query, clearing filters, or searching for famous areas like Digha, Darjeeling, Jaipur, Goa, or Munnar.',
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpotCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Failed to load spots
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
          {error}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-500 flex items-center justify-center mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">
          {emptyTitle}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-4">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {spots.map((spot) => (
        <motion.div key={spot.id} variants={fadeInUp}>
          <SpotCard spot={spot} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SpotList;
