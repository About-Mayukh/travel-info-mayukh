/**
 * Framer Motion animation variants respecting prefers-reduced-motion
 */

// Helper to check for user reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const pageVariants = {
  initial: {
    opacity: 0,
    y: shouldReduceMotion() ? 0 : 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: shouldReduceMotion() ? 0 : -8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: shouldReduceMotion() ? 0 : 0.08,
      delayChildren: 0.05,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: shouldReduceMotion() ? 0 : 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: shouldReduceMotion() ? 1 : 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const heartBeat = {
  scale: [1, 1.25, 1],
  transition: { duration: 0.3 },
};

export const buttonHover = {
  scale: shouldReduceMotion() ? 1 : 1.02,
  transition: { duration: 0.15 },
};

export const buttonTap = {
  scale: shouldReduceMotion() ? 1 : 0.97,
};
