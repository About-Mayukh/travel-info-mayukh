import React from 'react';
import { Users, MapPin, MessageSquare, Camera } from 'lucide-react';

export function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Spots',
      value: stats.spotsCount || 0,
      icon: MapPin,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
      title: 'Community Reviews',
      value: stats.reviewsCount || 0,
      icon: MessageSquare,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      title: 'Visitor Photos',
      value: stats.photosCount || 0,
      icon: Camera,
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/50',
    },
    {
      title: 'Registered Users',
      value: stats.usersCount || 1,
      icon: Users,
      color: 'text-sunset-500 dark:text-sunset-400',
      bgColor: 'bg-sunset-50 dark:bg-sunset-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {card.value}
              </h3>
            </div>
            <div className={`p-3.5 rounded-2xl ${card.bgColor} ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
