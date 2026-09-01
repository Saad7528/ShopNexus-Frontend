'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Send,
  CheckCircle2,
  Camera,
  Upload,
  X,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  Coins,
  Edit3,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useReviewStore, IReviewItem } from '@/store/useReviewStore';

interface ReviewFormProps {
  productId: string;
  productName?: string;
  editReviewItem?: IReviewItem | null;
  onCancelEdit?: () => void;
  onReviewSubmitted?: (review: { rating: number; comment: string; author: string; images?: string[] }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName = 'Product',
  editReviewItem = null,
  onCancelEdit,
  onReviewSubmitted,
}) => {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const { addReview, editReview } = useReviewStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState<number>(editReviewItem?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(editReviewItem?.comment || '');
  const [images, setImages] = useState<string[]>(editReviewItem?.images || []);
  const [submittedInfo, setSubmittedInfo] = useState<{
    coins: number;
    status: 'APPROVED' | 'PENDING';
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Check if current user is logged in & has purchased this product
  const hasPurchased = React.useMemo(() => {
    if (!user) return false;
    // Admins always have access to test
    if (user.role === 'admin') return true;
    return orders.some((order) =>
      order.items?.some(
        (item) =>
          item.id === productId ||
          (item as unknown as { _id?: string })._id === productId ||
          item.name?.toLowerCase().includes(productId.toLowerCase()) ||
          (item as unknown as { slug?: string }).slug === productId
      )
    );
  }, [user, orders, productId]);

  // Handle native file upload from camera or device gallery
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFileError(null);

    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) {
      setFileError('সর্বোচ্চ ৩টি ছবি আপলোড করা যাবে।');
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setFileError(`'${file.name}' ফাইলের সাইজ ৫ এমবি-র বেশি। ছোট সাইজের ছবি নির্বাচন করুন।`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    if (editReviewItem) {
      // Edit existing review
      const currentUserId = user._id || user.email;
      const success = editReview(
        editReviewItem.id,
        currentUserId,
        rating,
        comment.trim(),
        images,
        user.role === 'admin'
      );
      if (success && onCancelEdit) {
        onCancelEdit();
      }
      return;
    }

    // Add new review
    const result = addReview({
      productId,
      productName,
      userId: user._id || user.email,
      author: user.name || 'Verified Buyer',
      authorEmail: user.email,
      authorAvatar: user.avatar,
      rating,
      comment: comment.trim(),
      images,
    });

    if (onReviewSubmitted) {
      onReviewSubmitted({
        rating,
        comment: comment.trim(),
        author: user.name || 'Verified Buyer',
        images,
      });
    }

    setSubmittedInfo({ coins: result.coinsEarned, status: result.status });
    setComment('');
    setImages([]);
    setFileError(null);
    setTimeout(() => setSubmittedInfo(null), 6000);
  };

  // Case 1 & 2: User is not logged in or has not purchased this product (Compact Highlighted Card)
  if ((!user || !hasPurchased) && !editReviewItem) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl space-y-2.5 text-center shadow-sm">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          <span className="inline-block font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-200 dark:border-orange-500/20 mr-1.5 shadow-sm">
            ✨ ShopNexus-এ প্রতিটি রিভিউ শতভাগ আসল রাখা হয়
          </span>
          আপনি এই পণ্যটি অর্ডার সম্পন্ন করার পর এখানে স্বয়ংক্রিয়ভাবে রিভিউ ও রিয়েল ফটো আপলোড করার অপশন আনলক হবে।
        </p>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
          <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
          <span>পণ্যটি ক্রয় করলেই রিভিউ ও স্টার রেটিং আনলক হবে</span>
        </div>
      </div>
    );
  }

  // Case 3: Verified Buyer (or Edit Mode)
  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-emerald-500/30 dark:border-emerald-500/30 backdrop-blur-xl shadow-sm space-y-4">
      {/* Header with Verified Badge and Reward Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {editReviewItem ? 'Edit Your Review' : 'Write a Verified Customer Review'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            আপনার অভিজ্ঞতা এবং আসল ছবি শেয়ার করুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!editReviewItem && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Coins className="w-3 h-3 text-amber-500" /> +10 Coins Reward
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
          </span>
        </div>
      </div>

      {submittedInfo ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold space-y-1 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            <span>ধন্যবাদ! আপনার ভেরিফাইড রিভিউ এবং পণ্যের ছবি সফলভাবে গৃহীত হয়েছে।</span>
          </div>
          <div className="flex items-center gap-1.5 pl-7 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            <Coins className="w-3.5 h-3.5" />
            <span>অভিনন্দন! আপনার ওয়ালেটে +{submittedInfo.coins} নেক্সাস কয়েন বোনাস যুক্ত হয়েছে।</span>
          </div>
          {submittedInfo.status === 'PENDING' && (
            <p className="pl-7 text-[10px] text-slate-500 dark:text-slate-400">
              (অ্যাডমিন ভেরিফিকেশন ও অ্যাপ্রুভালের পর এটি পণ্য পেজে সবার জন্য প্রকাশিত হবে।)
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              আপনার রেটিং (Overall Rating) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 text-slate-400 dark:text-slate-600 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* User Review Text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              আপনার মতামত ও পর্যালোচনা (Review & Experience) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="পণ্যটির গুণগত মান, প্যাকেজিং, এবং পারফরম্যান্স সম্পর্কে আপনার মতামত লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:outline-none text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Native Camera & Device Gallery Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-orange-500" /> পণ্যের আসল ছবি যুক্ত করুন (সর্বোচ্চ ৩টি)
              </label>
              <span className="text-[11px] font-semibold text-slate-400">{images.length}/3 Photos</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-sm"
                >
                  <Image src={imgSrc} alt={`Review photo ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-rose-600 rounded-full text-white transition-colors cursor-pointer"
                    title="ছবি মুছে ফেলুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 px-3.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-slate-950/40 hover:bg-orange-500/5 dark:hover:bg-orange-500/5 flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1 text-orange-500">
                    <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <Upload className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-bold">ক্যামেরা / গ্যালারি</span>
                </button>
              )}
            </div>

            {fileError && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            {editReviewItem && onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                বাতিল করুন
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105"
            >
              {editReviewItem ? <Edit3 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{editReviewItem ? 'Update Review' : 'Submit Verified Review'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
