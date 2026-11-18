import React, { useState, useEffect } from 'react';
import { User, Calendar, Heart, Camera, MessageSquare, Trash2, MapPin } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SpotList from '../components/spots/SpotList';
import ReviewItem from '../components/reviews/ReviewItem';
import Loader from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { getUserBookings, deleteBooking } from '../services/bookingService';
import { getAllReviews, deleteReview } from '../services/reviewService';
import { getAllPhotos, deletePhoto } from '../services/photoService';
import { formatCurrency, formatDate } from '../utils/format';
import { useToast } from '../components/ui/Toast';

export function Profile() {
  const { user, profile } = useAuth();
  const { favorites } = useFavorites();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'favorites', 'photos', 'reviews'
  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      if (!user) return;
      setLoading(true);
      try {
        const [userBookings, allRevs, allPics] = await Promise.all([
          getUserBookings(user.id),
          getAllReviews(),
          getAllPhotos(),
        ]);

        if (isMounted) {
          setBookings(userBookings);
          setMyReviews(allRevs.filter((r) => String(r.user_id) === String(user.id)));
          setMyPhotos(allPics.filter((p) => String(p.user_id) === String(user.id)));
        }
      } catch (err) {
        console.error('Error loading profile data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success('Booking cancelled.');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setMyReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success('Review removed.');
    } catch {
      toast.error('Failed to remove review');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deletePhoto(photoId);
      setMyPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success('Photo removed.');
    } catch {
      toast.error('Failed to remove photo');
    }
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', count: bookings.length, icon: Calendar },
    { id: 'favorites', label: 'Wishlist', count: favorites.length, icon: Heart },
    { id: 'photos', label: 'My Photos', count: myPhotos.length, icon: Camera },
    { id: 'reviews', label: 'My Reviews', count: myReviews.length, icon: MessageSquare },
  ];

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 text-center sm:text-left">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white flex items-center justify-center font-display font-extrabold text-2xl uppercase shadow-md shadow-brand-500/20">
          {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-display font-black text-2xl text-slate-900 dark:text-slate-100">
              {profile?.full_name || 'Travel Explorer'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {profile?.role || 'user'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          <p className="text-xs text-slate-400 mt-2">
            Member of WanderSpot community exploring destinations across India.
          </p>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <Loader text="Loading your travel activity..." />
      ) : (
        <div>
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {bookings.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No spot reservations yet. Browse spots and click "Book / Add to Trip"!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {b.spot_image && (
                          <img
                            src={b.spot_image}
                            alt={b.spot_name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {b.spot_name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-brand-500" />
                            {b.spot_area}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span>Date: {formatDate(b.visit_date)}</span>
                            <span>•</span>
                            <span>
                              {b.adults} Adults {b.children > 0 && `, ${b.children} Children`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                          {formatCurrency(b.total_price)}
                        </span>
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAVORITES */}
          {activeTab === 'favorites' && (
            <SpotList spots={favorites} emptyTitle="No favorites saved" />
          )}

          {/* TAB 3: PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              {myPhotos.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  You haven't uploaded any tourist photos yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {myPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="group relative rounded-xl overflow-hidden h-44 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    >
                      <img
                        src={p.image_url}
                        alt="Upload"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div>
              {myReviews.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  You haven't written any spot reviews yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {myReviews.map((rev) => (
                    <ReviewItem
                      key={rev.id}
                      review={rev}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

export default Profile;
