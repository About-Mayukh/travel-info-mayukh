import React from 'react';
import { Calendar, Compass, MapPin, IndianRupee, Printer, RotateCcw } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../utils/format';
import Button from '../ui/Button';

export function TripSummary() {
  const {
    totalSpotsCount,
    totalTicketCost,
    totalDistanceKm,
    estimatedTravelCost,
    grandTotalCost,
    clearTrip,
  } = useTrip();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col gap-4 sticky top-24">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <span>Trip Summary & Budget</span>
        </h3>
        <p className="text-xs text-slate-400">
          Estimated costs and total driving distance across your itinerary
        </p>
      </div>

      <div className="flex flex-col gap-3 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Planned Spots:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {totalSpotsCount} locations
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Total Road Distance:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            ~{totalDistanceKm} km
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Total Entry Tickets:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(totalTicketCost)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Est. Road Fuel & Toll:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(estimatedTravelCost)}
          </span>
        </div>

        <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
          <span>Estimated Trip Budget:</span>
          <span className="text-lg font-black text-brand-600 dark:text-brand-400">
            {formatCurrency(grandTotalCost)}
          </span>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={Printer}
          onClick={handlePrint}
          className="w-full"
        >
          Print / Export Plan
        </Button>

        {totalSpotsCount > 0 && (
          <button
            onClick={clearTrip}
            className="text-xs text-slate-400 hover:text-rose-500 py-1.5 flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Itinerary</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TripSummary;
