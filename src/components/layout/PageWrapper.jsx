import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/pageTransition';

export function PageWrapper({ children, className = '' }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-[calc(100vh-4rem)] flex flex-col ${className}`}
    >
      {children}
    </motion.main>
  );
}

export default PageWrapper;
