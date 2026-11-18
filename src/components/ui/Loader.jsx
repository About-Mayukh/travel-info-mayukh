import React from 'react';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export function Loader({ size = 'md', text = 'Loading WanderSpot...' }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 min-h-[160px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="text-brand-500"
      >
        <Compass className={sizeMap[size]} />
      </motion.div>
      {text && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;
