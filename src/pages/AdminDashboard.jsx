import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  MapPin,
  Camera,
  MessageSquare,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import StatsCards from '../components/admin/StatsCards';
import SpotForm from '../components/admin/SpotForm';
import PhotoModeration from '../components/admin/PhotoModeration';
import ReviewModeration from '../components/admin/ReviewModeration';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import {
  getAllSpots,
  createSpot,
  updateSpot,
  deleteSpot,
} from '../services/spotService';
import {
  getAllPhotos,
  approvePhoto,
  rejectPhoto,
  deletePhoto,
} from '../services/photoService';
import {
  getAllReviews,
  deleteReview,
} from '../services/reviewService';
import { useToast } from '../components/ui/Toast';
import { formatCurrency } from '../utils/format';

export function AdminDashboard() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('spots'); // 'spots', 'photos', 'reviews'
  const [spots, setSpots] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for Spot creation / edit
  const [spotModalOpen, setSpotModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [spotsData, photosData, reviewsData] = await Promise.all([
        getAllSpots(),
        getAllPhotos(),
        getAllReviews(),
      ]);
      setSpots(spotsData);
      setPhotos(photosData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Failed to load admin data', err);
      toast.error('Failed to load admin management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Spot handlers
  const handleOpenAddSpot = () => {
    setEditingSpot(null);
    setSpotModalOpen(true);
  };

  const handleOpenEditSpot = (spot) => {
    setEditingSpot(spot);
    setSpotModalOpen(true);
  };

  const handleSaveSpot = async (spotData) => {
    try {
      if (editingSpot) {
        await updateSpot(editingSpot.id, spotData);
        toast.success(`Updated spot: ${spotData.name}`);
      } else {
        await createSpot(spotData);
        toast.success(`Created new tourist spot: ${spotData.name}`);
      }
      setSpotModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error saving spot');
    }
  };

  const handleDeleteSpot = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteSpot(id);
      setSpots((prev) => prev.filter((s) => s.id !== id));
      toast.success('Spot deleted.');
    } catch {
      toast.error('Failed to delete spot');
    }
  };

  // Photo handlers
  const handleApprovePhoto = async (id) => {
    try {
      await approvePhoto(id);
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved: true } : p))
      );
      toast.success('Photo approved.');
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleRejectPhoto = async (id) => {
    try {
      await rejectPhoto(id);
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved: false } : p))
      );
      toast.info('Photo unapproved.');
    } catch {
      toast.error('Rejection failed');
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Photo removed permanently.');
    } catch {
      toast.error('Failed to delete photo');
    }
  };

  // Review handlers
  const handleDeleteReview = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review removed as spam.');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const stats = {
    spotsCount: spots.length,
    photosCount: photos.length,
    reviewsCount: reviews.length,
    usersCount: 8, // Aggregate estimate
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
              Admin Control Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage tourist spot catalog, curate community photos, and moderate reviews
          </p>
        </div>

        {activeTab === 'spots' && (
          <Button variant="primary" icon={Plus} onClick={handleOpenAddSpot}>
            Add New Spot
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('spots')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'spots'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Spots Manager ({spots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'photos'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photo Moderation ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Review Moderation ({reviews.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <Loader text="Loading administration tools..." />
      ) : (
        <div>
          {/* TAB 1: SPOTS MANAGEMENT */}
          {activeTab === 'spots' && (
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Spot</th>
                      <th className="px-4 py-3.5">Area</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Coordinates</th>
                      <th className="px-4 py-3.5">Adult Ticket</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {spots.map((spot) => (
                      <tr
                        key={spot.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3 flex items-center gap-2.5">
                          <img
                            src={spot.cover_image}
                            alt={spot.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {spot.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {spot.best_time || 'All season'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{spot.area}</td>
                        <td className="px-4 py-3 capitalize">{spot.category}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">
                          {spot.latitude?.toFixed(4)}, {spot.longitude?.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                          {spot.adult_price > 0 ? formatCurrency(spot.adult_price) : 'Free'}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditSpot(spot)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                              title="Edit spot"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSpot(spot.id, spot.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete spot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO MODERATION */}
          {activeTab === 'photos' && (
            <PhotoModeration
              photos={photos}
              onApprove={handleApprovePhoto}
              onReject={handleRejectPhoto}
              onDelete={handleDeletePhoto}
            />
          )}

          {/* TAB 3: REVIEW MODERATION */}
          {activeTab === 'reviews' && (
            <ReviewModeration
              reviews={reviews}
              onDelete={handleDeleteReview}
            />
          )}
        </div>
      )}

      {/* Add / Edit Spot Modal */}
      <Modal
        isOpen={spotModalOpen}
        onClose={() => setSpotModalOpen(false)}
        title={editingSpot ? `Edit "${editingSpot.name}"` : 'Add New Tourist Spot'}
        maxWidth="max-w-2xl"
      >
        <SpotForm
          initialSpot={editingSpot}
          onSave={handleSaveSpot}
          onCancel={() => setSpotModalOpen(false)}
        />
      </Modal>
    </PageWrapper>
  );
}

export default AdminDashboard;
