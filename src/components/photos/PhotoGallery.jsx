import React, { useState } from 'react';
import { Camera, Heart, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import Lightbox from './Lightbox';
import PhotoUpload from './PhotoUpload';
import Button from '../ui/Button';
import { toggleLikePhoto } from '../../services/photoService';

export function PhotoGallery({ spotId, spotName, photos = [], onPhotosUpdate }) {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handlePhotoClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleToggleLike = async (photoId) => {
    try {
      const newLikes = await toggleLikePhoto(photoId);
      if (onPhotosUpdate) {
        onPhotosUpdate((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, likes: newLikes } : p))
        );
      }
    } catch (e) {
      console.error('Like toggle error', e);
    }
  };

  const handleUploadSuccess = (newPhoto) => {
    if (onPhotosUpdate) {
      onPhotosUpdate((prev) => [newPhoto, ...prev]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Gallery Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Community Gallery</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real photos captured and shared by verified visitors
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Camera}
          onClick={() => setUploadModalOpen(true)}
        >
          Add Photo
        </Button>
      </div>

      {/* Masonry-Style Photo Grid */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
          <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No traveler photos yet
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Be the first visitor to share your camera shots of {spotName}!
          </p>
          <Button
            variant="outline"
            size="sm"
            icon={Camera}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => handlePhotoClick(index)}
              className="group relative h-40 sm:h-48 rounded-xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-800 select-none"
            >
              <img
                src={photo.image_url}
                alt={`Photo of ${spotName} by ${photo.user_name || 'Traveler'}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Uploader & Likes on Hover */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="truncate max-w-[100px] font-medium drop-shadow">
                  {photo.user_name || 'Visitor'}
                </span>
                <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-full drop-shadow">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>{photo.likes || 0}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Component */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        onToggleLike={handleToggleLike}
      />

      {/* Photo Upload Modal */}
      <PhotoUpload
        spotId={spotId}
        spotName={spotName}
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}

export default PhotoGallery;
