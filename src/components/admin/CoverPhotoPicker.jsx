import React, { useState } from 'react';
import { Search, Image as ImageIcon, ExternalLink, AlertCircle, Check } from 'lucide-react';
import { searchUnsplashPhotos, triggerUnsplashDownload, isUnsplashConfigured } from '../../services/unsplashService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export function CoverPhotoPicker({
  isOpen,
  onClose,
  initialQuery = '',
  onSelectPhoto,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const unsplashReady = isUnsplashConfigured();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchUnsplashPhotos(query, 8);
      setPhotos(results);
    } catch (e) {
      console.error('Photo search failed', e);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (photo) => {
    // Trigger download location endpoint per Unsplash terms
    if (photo.downloadLocation) {
      await triggerUnsplashDownload(photo.downloadLocation);
    }

    onSelectPhoto({
      imageUrl: photo.regularUrl,
      creditName: photo.photographerName,
      creditUrl: photo.photographerUrl,
    });
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onSelectPhoto({
        imageUrl: manualUrl.trim(),
        creditName: null,
        creditUrl: null,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Find Spot Cover Photo"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Unsplash Search Form if configured */}
        {unsplashReady ? (
          <div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Unsplash (e.g. Darjeeling hills, Jaipur fort)..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button type="submit" loading={loading} icon={Search}>
                Search
              </Button>
            </form>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Powered by Unsplash API. High-resolution editorial photography.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs">
            <span className="font-semibold block">VITE_UNSPLASH_ACCESS_KEY not configured.</span>
            You can paste any direct web image URL below.
          </div>
        )}

        {/* Results Grid */}
        {unsplashReady && (
          <div className="max-h-[340px] overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="group relative h-28 rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm hover:scale-[1.02] transition-transform"
                  >
                    <img
                      src={p.thumbUrl}
                      alt={p.altDescription}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                      <span>Choose</span>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 text-[9px] text-white/90 bg-black/60 px-1 py-0.5 rounded truncate">
                      {p.photographerName}
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No matching photos found on Unsplash for "{query}".
              </p>
            ) : null}
          </div>
        )}

        {/* Manual Image URL Option */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Or paste direct Image URL manually:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://example.com/tourist-spot.jpg"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button type="submit" size="sm" variant="outline" disabled={!manualUrl.trim()}>
                Apply URL
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default CoverPhotoPicker;
