import React, { useState } from 'react';
import { Calendar, Users, Ticket, Check, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { useToast } from '../ui/Toast';
import { createBooking } from '../../services/bookingService';
import { calculateTicketPrice } from '../../utils/price';
import { formatCurrency } from '../../utils/format';
import Button from '../ui/Button';

export function BookingPanel({ spot, distanceKm = 0, travelCost = 0 }) {
  const { user, profile } = useAuth();
  const { addSpotToDay } = useTrip();
  const toast = useToast();

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [visitDate, setVisitDate] = useState(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const ticketPrice = calculateTicketPrice(
    adults,
    children,
    spot.adult_price || 0,
    spot.child_price || 0
  );

  const grandTotal = ticketPrice + (travelCost || 0);

  const handleBooking = async () => {
    if (!visitDate) {
      toast.warning('Please select a visit date.');
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        spotId: spot.id,
        spotName: spot.name,
        spotArea: spot.area,
        spotImage: spot.cover_image,
        userId: user?.id,
        visitDate,
        adults,
        children,
        totalPrice: grandTotal,
      });

      // Also add spot to Day 1 of trip planner
      addSpotToDay(spot, 1);

      setBooked(true);
      toast.success(`Reserved tickets for ${spot.name}! Added to your Trip Planner.`);
      setTimeout(() => setBooked(false), 4000);
    } catch (err) {
      toast.error(err.message || 'Booking reservation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md shadow-slate-200/50 dark:shadow-black/20 flex flex-col gap-5">
      {/* Price Header */}
      <div className="flex items-baseline justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
            Entry Ticket
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
              {spot.adult_price > 0 ? formatCurrency(spot.adult_price) : 'Free Entry'}
            </span>
            {spot.adult_price > 0 && (
              <span className="text-xs text-slate-400 font-medium">/ adult</span>
            )}
          </div>
        </div>
        {spot.child_price > 0 && (
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Child Ticket</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {formatCurrency(spot.child_price)}
            </span>
          </div>
        )}
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-brand-500" />
          <span>Visit Date</span>
        </label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Visitors Stepper */}
      <div className="grid grid-cols-2 gap-4">
        {/* Adults Stepper */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Adults (12+ yrs)
          </span>
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              disabled={adults <= 1}
              className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {adults}
            </span>
            <button
              type="button"
              onClick={() => setAdults(adults + 1)}
              className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Children Stepper */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Children (below 12)
          </span>
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setChildren(Math.max(0, children - 1))}
              disabled={children <= 0}
              className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {children}
            </span>
            <button
              type="button"
              onClick={() => setChildren(children + 1)}
              className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cost Summary Breakdown */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Tickets Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(ticketPrice)}
          </span>
        </div>
        {travelCost > 0 && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Est. Travel Cost ({Math.round(distanceKm)} km)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(travelCost)}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
          <span>Total Trip Estimate</span>
          <span className="text-base text-brand-600 dark:text-brand-400">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      {/* Book / Add to Trip Button */}
      <Button
        variant={booked ? 'secondary' : 'sunset'}
        size="lg"
        loading={loading}
        onClick={handleBooking}
        icon={booked ? Check : Ticket}
        className="w-full font-bold shadow-lg"
      >
        {booked ? 'Reserved & Added to Trip!' : 'Book / Add to Trip'}
      </Button>

      <p className="text-[11px] text-center text-slate-400">
        Demo Booking: No real payment required. Reserves spot in your itinerary.
      </p>
    </div>
  );
}

export default BookingPanel;
