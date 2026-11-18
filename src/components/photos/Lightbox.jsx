import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, ZoomIn, ZoomOut, User } from 'lucide-react';

export function Lightbox({
  photos = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onIndexChange,
  onToggleLike,
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  const currentPhoto = photos[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  // Reset zoom on slide change
  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  const handleNext = () => {
    if (photos.length <= 1) return;
    const next = (currentIndex + 1) % photos.length;
    if (onIndexChange) onIndexChange(next);
  };

  const handlePrev = () => {
    if (photos.length <= 1) return;
    const prev = (currentIndex - 1 + photos.length) % photos.length;
    if (onIndexChange) onIndexChange(prev);
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-md"
        />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {currentPhoto.user_name || 'Community Visitor'}
              </p>
              <p className="text-[11px] text-white/60">
                Photo {currentIndex + 1} of {photos.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Container */}
        <div className="relative max-w-5xl max-h-[80vh] mx-auto p-4 flex items-center justify-center overflow-hidden">
          <motion.img
            key={currentPhoto.id || currentIndex}
            src={currentPhoto.image_url}
            alt="Travel spot community upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: isZoomed ? 1.45 : 1,
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsZoomed(!isZoomed)}
            className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl transition-transform"
          />
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Next (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Bottom Bar: Like Button */}
        {onToggleLike && (
          <div className="absolute bottom-5 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white">
            <button
              onClick={() => onToggleLike(currentPhoto.id)}
              className="flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="text-xs font-bold">{currentPhoto.likes || 0} Likes</span>
            </button>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

export default Lightbox;
