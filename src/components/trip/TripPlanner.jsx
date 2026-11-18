import React from 'react';
import { Plus, Calendar, Compass } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import ItineraryDay from './ItineraryDay';
import TripSummary from './TripSummary';
import Button from '../ui/Button';

export function TripPlanner() {
  const { days, addDay, removeDay, removeSpotFromDay, reorderDaySpots } = useTrip();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Days List (Columns 1 & 2) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
              Your Day-by-Day Itinerary
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Drag destinations to adjust the order or re-sequence spots across your trip
            </p>
          </div>

          <Button variant="outline" size="sm" icon={Plus} onClick={addDay}>
            Add Day
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {days.map((day) => (
            <ItineraryDay
              key={day.day}
              day={day}
              onRemoveSpot={removeSpotFromDay}
              onReorderSpots={reorderDaySpots}
              onRemoveDay={removeDay}
              canRemoveDay={days.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Summary Sidebar (Column 3) */}
      <div className="lg:col-span-1">
        <TripSummary />
      </div>
    </div>
  );
}

export default TripPlanner;
