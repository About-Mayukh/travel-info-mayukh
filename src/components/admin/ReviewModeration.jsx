import React from 'react';
import { Trash2, Star, User } from 'lucide-react';
import { formatDate } from '../../utils/format';

export function ReviewModeration({ reviews, onDelete }) {
  if (reviews.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
        No reviews currently submitted.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3">Spot</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Comment</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
          {reviews.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 max-w-[140px] truncate">
                {r.spot_name || 'Spot'}
              </td>
              <td className="px-4 py-3 max-w-[120px] truncate">
                {r.user_name || 'User'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {r.rating}
                </span>
              </td>
              <td className="px-4 py-3 max-w-[280px]">
                <p className="line-clamp-2 italic text-slate-600 dark:text-slate-300">
                  "{r.comment}"
                </p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                {formatDate(r.created_at)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  onClick={() => onDelete(r.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete review as spam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewModeration;
