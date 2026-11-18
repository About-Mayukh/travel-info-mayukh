import React, { useState } from 'react';
import { MessageSquare, Star, Plus } from 'lucide-react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import Button from '../ui/Button';
import { deleteReview } from '../../services/reviewService';
import { useToast } from '../ui/Toast';

export function ReviewList({ spotId, spotName, reviews = [], onReviewsUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success('Review removed.');
      if (onReviewsUpdate) {
        onReviewsUpdate((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const handleReviewAdded = (newReview) => {
    if (onReviewsUpdate) {
      onReviewsUpdate((prev) => [newReview, ...prev]);
    }
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Traveler Reviews ({reviews.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ratings and impressions left by the community
          </p>
        </div>

        <Button
          variant={showForm ? 'secondary' : 'outline'}
          size="sm"
          icon={Plus}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close Form' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Submission Form Toggle */}
      {showForm && (
        <ReviewForm
          spotId={spotId}
          spotName={spotName}
          onReviewSubmitted={handleReviewAdded}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white/40 dark:bg-slate-900/40">
          <Star className="w-8 h-8 text-amber-400 mb-2" />
          <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No reviews yet
          </h5>
          <p className="text-xs text-slate-400 mt-1 mb-3">
            Have you been to {spotName}? Be the first to rate it!
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Leave First Review
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((rev) => (
            <ReviewItem key={rev.id} review={rev} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewList;
