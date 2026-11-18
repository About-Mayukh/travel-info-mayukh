import React from 'react';
import { Trash2, User } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export function ReviewItem({ review, onDelete }) {
  const { user, isAdmin } = useAuth();

  const isAuthor = user && String(user.id) === String(review.user_id);
  const canDelete = isAuthor || isAdmin;

  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {review.user_avatar ? (
            <img
              src={review.user_avatar}
              alt={review.user_name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs uppercase">
              {review.user_name ? review.user_name.charAt(0) : 'U'}
            </div>
          )}
          <div>
            <h5 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {review.user_name || 'Travel Enthusiast'}
            </h5>
            <span className="text-[10px] text-slate-400">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} size="sm" />
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
        {review.comment}
      </p>
    </div>
  );
}

export default ReviewItem;
