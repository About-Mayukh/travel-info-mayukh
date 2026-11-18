import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantStyles[variant]} ${className}`}
    />
  );
}

export function SpotCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm p-3 flex flex-col gap-3">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="px-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <Skeleton className="w-12 h-5 rounded-md" />
        </div>
        <Skeleton className="w-1/3 h-4 rounded-md" />
        <Skeleton className="w-full h-12 rounded-lg mt-1" />
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
