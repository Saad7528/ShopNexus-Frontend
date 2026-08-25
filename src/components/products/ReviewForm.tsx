'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Send, CheckCircle2, ImagePlus, X, ShieldCheck } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: (review: { rating: number; comment: string; author: string; images?: string[] }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId: _productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState<string>('');
  const [showImagePrompt, setShowImagePrompt] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAddImage = () => {
    if (newImageInput.trim() && imageUrls.length < 3) {
      setImageUrls([...imageUrls, newImageInput.trim()]);
      setNewImageInput('');
      setShowImagePrompt(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (onReviewSubmitted) {
      onReviewSubmitted({
        rating,
        comment,
        author: author.trim() || 'Verified Buyer',
        images: imageUrls,
      });
    }

    setSubmitted(true);
    setComment('');
    setAuthor('');
    setImageUrls([]);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Write a Verified Review</h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" /> Verified Buyer
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        Share your experience, audio/build impressions, and photos with the community.
      </p>

      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Thank you! Your verified review and photo feedback have been recorded.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-1">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Farhan Rahman"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Your Review & Feedback
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love about this item? How is the build quality and packaging?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Photo attachment preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Attach Photos (Max 3)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
                  <Image src={url} alt="Review attachment" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 dark:bg-slate-950/80 rounded-full text-rose-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {imageUrls.length < 3 && (
                <button
                  type="button"
                  onClick={() => setShowImagePrompt(!showImagePrompt)}
                  className="w-14 h-14 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 bg-slate-50 dark:bg-slate-950/40 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Add</span>
                </button>
              )}
            </div>

            {showImagePrompt && (
              <div className="flex gap-2 mt-2">
                <input
                  type="url"
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  placeholder="Paste Image URL..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  Attach
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Submit Verified Review
          </button>
        </form>
      )}
    </div>
  );
};
