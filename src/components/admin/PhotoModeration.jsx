import React from 'react';
import { Check, X, Trash2, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import { formatDate } from '../../utils/format';

export function PhotoModeration({ photos, onApprove, onReject, onDelete }) {
  if (photos.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
        No community photos found to moderate.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col shadow-sm"
        >
          <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
            <img
              src={photo.image_url}
              alt="Community upload"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  photo.approved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {photo.approved ? 'Approved' : 'Pending / Hidden'}
              </span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col flex-1 justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {photo.spot_name || 'Tourist Spot'}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                By {photo.user_name || 'Visitor'} • {formatDate(photo.created_at)}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                {!photo.approved ? (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Check}
                    onClick={() => onApprove(photo.id)}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={X}
                    onClick={() => onReject(photo.id)}
                  >
                    Hide
                  </Button>
                )}
              </div>

              <button
                onClick={() => onDelete(photo.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotoModeration;
