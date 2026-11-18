import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({
  rating = 5,
  maxStars = 5,
  size = 'md', // 'sm', 'md', 'lg'
  onChange,
  showLabel = false,
  className = '',
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const isInteractive = Boolean(onChange);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = isInteractive
            ? starValue <= (hoverRating || rating)
            : starValue <= Math.round(rating);

          return (
            <button
              key={index}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange(starValue)}
              onMouseEnter={() => isInteractive && setHoverRating(starValue)}
              onMouseLeave={() => isInteractive && setHoverRating(0)}
              className={`p-0.5 transition-transform ${
                isInteractive
                  ? 'cursor-pointer hover:scale-110 focus:outline-none'
                  : 'cursor-default pointer-events-none'
              }`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-slate-300 dark:text-slate-600'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
