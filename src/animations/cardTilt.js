import { useState, useCallback } from 'react';
import { shouldReduceMotion } from './variants';

/**
 * Custom hook to calculate 3D tilt transformation on hover
 */
export function useCardTilt({ maxTilt = 8 } = {}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion()) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt degrees)
      const rotateX = ((centerY - y) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTilt({
        x: rotateX,
        y: rotateY,
        scale: 1.02,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, scale: 1 });
  }, []);

  return {
    tiltStyle: {
      transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1)`,
      transition: 'transform 0.15s ease-out',
    },
    handleMouseMove,
    handleMouseLeave,
  };
}

export default useCardTilt;
