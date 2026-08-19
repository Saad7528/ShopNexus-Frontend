'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: (review: { rating: number; comment: string; author: string }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId: _productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (onReviewSubmitted) {
      onReviewSubmitted({
        rating,
        comment,
        author: 'Verified Buyer',
      });
    }

    setSubmitted(true);
    setComment('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
      <h3 className="text-lg font-bold text-white mb-2">Write a Customer Review</h3>
      <p className="text-sm text-slate-400 mb-6">
        Share your experience and thoughts regarding this product with the community.
      </p>

      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Thank you! Your verified review has been published successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-600 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-amber-400">{hoverRating || rating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your Review & Feedback
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How is the build quality?"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" /> Submit Review
          </button>
        </form>
      )}
    </div>
  );
};
