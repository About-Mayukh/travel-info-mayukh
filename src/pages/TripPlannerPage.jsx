import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import TripPlanner from '../components/trip/TripPlanner';
import { Calendar } from 'lucide-react';

export function TripPlannerPage() {
  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
            Trip Planner & Itinerary
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Plan day-by-day travel routes, organize spots with drag-and-drop, and monitor total estimated travel budgets
        </p>
      </div>

      <TripPlanner />
    </PageWrapper>
  );
}

export default TripPlannerPage;
