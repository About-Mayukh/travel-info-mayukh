import React, { useState } from 'react';
import { GripVertical, Trash2, ArrowUp, ArrowDown, MapPin, Navigation } from 'lucide-react';
import { calculateHaversineDistance } from '../../utils/distance';
import { formatCurrency } from '../../utils/format';

export function ItineraryDay({
  day,
  onRemoveSpot,
  onReorderSpots,
  onRemoveDay,
  canRemoveDay,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...day.spots];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    setDraggedIndex(index);
    onReorderSpots(day.day, updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveSpot = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= day.spots.length) return;
    const updated = [...day.spots];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onReorderSpots(day.day, updated);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
      {/* Day Header */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">
            {day.title}
          </h4>
          <span className="text-[11px] text-slate-400">
            {day.spots.length} {day.spots.length === 1 ? 'destination' : 'destinations'} planned
          </span>
        </div>

        {canRemoveDay && (
          <button
            onClick={() => onRemoveDay(day.day)}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Remove Day
          </button>
        )}
      </div>

      {/* Spots list */}
      <div className="p-4 flex flex-col gap-3 min-h-[140px]">
        {day.spots.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
            <p>No spots added to this day yet.</p>
            <p className="mt-1 text-[11px]">
              Explore spots and click <strong className="text-brand-600 dark:text-brand-400">"Book / Add to Trip"</strong>!
            </p>
          </div>
        ) : (
          day.spots.map((spot, index) => {
            // Distance from previous spot in the itinerary
            let legDistance = null;
            if (index > 0) {
              const prev = day.spots[index - 1];
              if (prev.latitude && prev.longitude && spot.latitude && spot.longitude) {
                legDistance = calculateHaversineDistance(
                  prev.latitude,
                  prev.longitude,
                  spot.latitude,
                  spot.longitude
                );
              }
            }

            return (
              <React.Fragment key={spot.id}>
                {legDistance !== null && (
                  <div className="flex items-center gap-2 pl-6 py-0.5 text-[11px] text-slate-400 font-medium">
                    <Navigation className="w-3 h-3 text-brand-500" />
                    <span>~{Math.round(legDistance)} km drive to next spot</span>
                  </div>
                )}

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    draggedIndex === index
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-md scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>

                    <img
                      src={spot.cover_image}
                      alt={spot.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {spot.name}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-brand-500" />
                          {spot.area}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                          {spot.adult_price > 0 ? formatCurrency(spot.adult_price) : 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move Up / Down & Remove Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSpot(index, index - 1)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === day.spots.length - 1}
                      onClick={() => moveSpot(index, index + 1)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveSpot(spot.id, day.day)}
                      className="p-1 ml-1 text-slate-400 hover:text-rose-500 rounded-md"
                      title="Remove from itinerary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ItineraryDay;
