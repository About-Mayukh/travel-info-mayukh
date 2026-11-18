import React, { useState } from 'react';
import { Send, Star, AlertCircle } from 'lucide-react';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { addReview } from '../../services/reviewService';

export function ReviewForm({ spotId, spotName, onReviewSubmitted }) {
  const { user, profile } = useAuth();
  const toast = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newReview = await addReview({
        spotId,
        rating,
        comment: comment.trim(),
        userId: user?.id,
        userName: profile?.full_name || user?.email?.split('@')[0] || 'Visitor',
        userAvatar: profile?.avatar_url || null,
      });

      toast.success('Your review has been submitted! Thank you.');
      setComment('');
      setRating(5);
      if (onReviewSubmitted) onReviewSubmitted(newReview);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
          Write a Review
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Your Rating:</span>
          <StarRating rating={rating} onChange={setRating} size="md" />
        </div>
      </div>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={`Share your personal experience at ${spotName || 'this spot'} (scenery, crowd, tips, accessibility)...`}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
      />

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={loading}
          icon={Send}
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
