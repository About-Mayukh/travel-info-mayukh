import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  Star,
  ExternalLink,
  Map,
  Sparkles,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BookingPanel from '../components/spots/BookingPanel';
import DistanceInfo from '../components/spots/DistanceInfo';
import WeatherCard from '../components/spots/WeatherCard';
import PhotoGallery from '../components/photos/PhotoGallery';
import ReviewList from '../components/reviews/ReviewList';
import SpotsMap from '../components/map/SpotsMap';
import Loader from '../components/ui/Loader';
import { getSpotById } from '../services/spotService';
import { getReviewsBySpot } from '../services/reviewService';
import { getPhotosBySpot } from '../services/photoService';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../components/ui/Toast';
import { getRoadRoute } from '../services/routingService';

export function SpotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { location, setManualCity, requestLocation } = useGeolocation();
  const { checkIsFavorite, toggleFavorite } = useFavorites();

  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState('booking'); // 'booking' or 'photos'
  const [routeData, setRouteData] = useState(null);

  // Fetch spot, reviews, and photos
  useEffect(() => {
    let isMounted = true;
    async function loadSpotData() {
      setLoading(true);
      try {
        const spotData = await getSpotById(id);
        if (!spotData) {
          toast.error('Spot not found');
          navigate('/home');
          return;
        }

        const [revs, pics] = await Promise.all([
          getReviewsBySpot(id),
          getPhotosBySpot(id),
        ]);

        if (isMounted) {
          setSpot(spotData);
          setReviews(revs);
          setPhotos(pics);
        }
      } catch (err) {
        console.error('Error loading spot details', err);
        toast.error('Failed to load spot details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSpotData();
    return () => {
      isMounted = false;
    };
  }, [id, navigate, toast]);

  // Compute road route
  useEffect(() => {
    if (spot && location?.lat && location?.lng) {
      getRoadRoute({
        userLat: location.lat,
        userLng: location.lng,
        spotLat: spot.latitude,
        spotLng: spot.longitude,
      }).then(setRouteData).catch(console.error);
    }
  }, [spot, location]);

  const isFav = spot ? checkIsFavorite(spot.id) : false;

  const handleShare = async () => {
    const shareData = {
      title: `${spot.name} - WanderSpot`,
      text: `Check out ${spot.name} in ${spot.area} on WanderSpot!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // Fallback to copy link
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Spot link copied to clipboard!');
    } catch {
      toast.info(`Spot URL: ${window.location.href}`);
    }
  };

  if (loading || !spot) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <Loader text="Loading tourist spot details..." />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-brand-600 shadow-sm transition-colors"
            title="Share spot"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Favorite Wishlist Button */}
          <button
            onClick={() => toggleFavorite(spot)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95 shadow-sm transition-all"
            title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${
                isFav
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Spot Cover Banner & Hero Header */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-lg border border-slate-200/80 dark:border-slate-800 mb-8 bg-slate-900">
        <img
          src={spot.cover_image}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Unsplash Attribution */}
        {spot.cover_credit_name && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/90 flex items-center gap-1">
            <span>Photo by</span>
            <a
              href={spot.cover_credit_url || 'https://unsplash.com'}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline hover:text-white"
            >
              {spot.cover_credit_name}
            </a>
            <span>on</span>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline hover:text-white"
            >
              Unsplash
            </a>
          </div>
        )}

        {/* Hero Overlay Info */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-brand-600 text-white shadow-sm">
                {spot.category || 'Tourist Spot'}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {spot.area}
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-md">
              {spot.name}
            </h1>
          </div>

          {/* Rating Pill */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <div>
              <span className="font-bold text-base text-white">
                {spot.average_rating || 5.0}
              </span>
              <span className="text-xs text-white/70 ml-1">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spot Description Overview */}
      <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
          About this destination
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {spot.description}
        </p>
      </div>

      {/* Mobile Tabs Switcher (Two columns on desktop, tabs on mobile per Section 3) */}
      <div className="lg:hidden flex rounded-xl p-1 bg-slate-200 dark:bg-slate-800 mb-6">
        <button
          onClick={() => setActiveMobileTab('booking')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === 'booking'
              ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Booking & Travel Info
        </button>
        <button
          onClick={() => setActiveMobileTab('photos')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeMobileTab === 'photos'
              ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Visitor Photos ({photos.length})
        </button>
      </div>

      {/* TWO SIDES LAYOUT (Two columns on desktop, tabs on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* SIDE 1: BOOKING SIDE */}
        <div
          className={`lg:col-span-5 flex flex-col gap-6 ${
            activeMobileTab === 'booking' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Road Distance and Travel Time Info */}
          <DistanceInfo
            spotLat={spot.latitude}
            spotLng={spot.longitude}
            userLocation={location}
            onLocationChange={setManualCity}
            onRequestGPS={requestLocation}
          />

          {/* Ticket Booking Reservation Panel */}
          <BookingPanel
            spot={spot}
            distanceKm={routeData?.distanceKm || 0}
            travelCost={routeData?.travelCost || 0}
          />

          {/* Weather & Best Time to Visit Card */}
          <WeatherCard
            latitude={spot.latitude}
            longitude={spot.longitude}
            bestTime={spot.best_time}
          />

          {/* Location Map */}
          <div>
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <Map className="w-4 h-4 text-brand-500" />
              <span>Location on Map</span>
            </h4>
            <SpotsMap singleSpot={spot} height="220px" zoomLevel={14} />
          </div>
        </div>

        {/* SIDE 2: PHOTOS SIDE */}
        <div
          className={`lg:col-span-7 flex flex-col gap-6 ${
            activeMobileTab === 'photos' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <PhotoGallery
            spotId={spot.id}
            spotName={spot.name}
            photos={photos}
            onPhotosUpdate={setPhotos}
          />
        </div>
      </div>

      {/* BELOW BOTH SIDES: REVIEWS LIST AND WRITE A REVIEW FORM */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <ReviewList
          spotId={spot.id}
          spotName={spot.name}
          reviews={reviews}
          onReviewsUpdate={setReviews}
        />
      </div>
    </PageWrapper>
  );
}

export default SpotDetail;
