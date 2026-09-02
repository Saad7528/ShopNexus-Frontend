'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Star,
  Camera,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Filter,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useReviewStore, IReviewItem } from '@/store/useReviewStore';
import { ReviewForm } from './ReviewForm';

interface ProductReviewsSectionProps {
  productId: string;
  productName?: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName = 'Product',
}) => {
  const { user } = useAuthStore();
  const { getProductReviews, toggleHelpfulVote, deleteReview, addSellerReply, deleteSellerReply } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'all' | 'photos'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [editingReview, setEditingReview] = useState<IReviewItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [replyEditText, setReplyEditText] = useState('');

  const currentUserId = user?._id || user?.email;
  const isAdmin = user?.role === 'admin';

  // Stable selectors from store
  const allReviews = useReviewStore((state) => state.reviews);
  const moderationMode = useReviewStore((state) => state.moderationMode);

  // Compute filtered reviews respecting privacy (pending reviews only visible to author or admin)
  const productReviews = useMemo(() => {
    const matched = allReviews.filter(
      (r) =>
        r.productId === productId ||
        r.productName?.toLowerCase().includes(productId.toLowerCase())
    );

    const now = Date.now();
    const effectiveList = matched.map((r) => {
      if (r.status === 'PENDING' && moderationMode === 'AUTO_24H') {
        const hoursPassed = (now - r.timestamp) / (1000 * 60 * 60);
        if (hoursPassed >= 24) {
          return { ...r, status: 'APPROVED' as const };
        }
      }
      return r;
    });

    return effectiveList.filter((r) => {
      if (isAdmin) return true;
      if (r.status === 'APPROVED') return true;
      if (r.status === 'PENDING' && currentUserId && r.userId === currentUserId) return true;
      return false;
    });
  }, [allReviews, moderationMode, productId, currentUserId, isAdmin]);

  // Reviews with photos count
  const photoReviewsCount = useMemo(
    () => productReviews.filter((r) => r.images && r.images.length > 0).length,
    [productReviews]
  );

  // Rating Statistics Calculations
  const stats = useMemo(() => {
    const total = productReviews.length;
    if (total === 0) {
      return { average: 5.0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    productReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] = (counts[rounded] || 0) + 1;
      sum += r.rating;
    });
    return {
      average: Number((sum / total).toFixed(1)),
      total,
      counts,
    };
  }, [productReviews]);

  // Filtered and Sorted list
  const displayReviews = useMemo(() => {
    let list = [...productReviews];

    if (activeTab === 'photos') {
      list = list.filter((r) => r.images && r.images.length > 0);
    }

    if (sortBy === 'recent') {
      list.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulVotes?.length || 0) - (a.helpfulVotes?.length || 0));
    }

    return list;
  }, [productReviews, activeTab, sortBy]);

  const handleDelete = (reviewId: string) => {
    if (!currentUserId) return;
    if (confirm('আপনি কি নিশ্চিত যে এই রিভিউটি ডিলিট করতে চান?')) {
      deleteReview(reviewId, currentUserId, isAdmin);
      setActiveMenuId(null);
    }
  };

  const handleVote = (reviewId: string) => {
    if (!currentUserId) {
      alert('সহায়ক ভোট দিতে অনুগ্রহ করে লগইন করুন।');
      return;
    }
    toggleHelpfulVote(reviewId, currentUserId);
  };

  return (
    <section className="pt-8 border-t border-slate-200 dark:border-slate-800/80 space-y-8">
      <div className="max-w-4xl space-y-6">
        {/* Section Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Customer Reviews ({stats.total})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              শতভাগ যাচাইকৃত ক্রেতাদের বাস্তব মতামত ও অভিজ্ঞতা
            </p>
          </div>
        </div>

        {/* Rating Breakdown Summary Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Overall Score */}
          <div className="md:col-span-4 text-center md:border-r border-slate-200 dark:border-slate-800/80 md:pr-6 space-y-1">
            <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.average}
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    stats.average >= s
                      ? 'fill-amber-400 text-amber-400'
                      : stats.average >= s - 0.5
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
              মোট {stats.total} জন ভেরিফাইড ক্রেতার মূল্যায়ন
            </p>
          </div>

          {/* Right: 5-Star to 1-Star Progress Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = stats.counts[starNum as keyof typeof stats.counts] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={starNum} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {starNum} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-medium text-[11px]">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Form Component (Add or Edit) */}
        {editingReview ? (
          <ReviewForm
            productId={productId}
            productName={productName}
            editReviewItem={editingReview}
            onCancelEdit={() => setEditingReview(null)}
          />
        ) : (
          <ReviewForm productId={productId} productName={productName} />
        )}

        {/* Filter and Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          {/* Tabs: All vs Photos */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সব রিভিউ ({productReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ফটো সহ রিভিউ ({photoReviewsCount})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> সর্ট করুন:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="recent">সবচেয়ে সাম্প্রতিক (Most Recent)</option>
              <option value="highest">সর্বোচ্চ রেটিং (Highest Rating)</option>
              <option value="lowest">সর্বনিম্ন রেটিং (Lowest Rating)</option>
              <option value="helpful">সর্বাধিক সহায়ক (Most Helpful)</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {displayReviews.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 text-slate-400 text-xs">
              এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি।
            </div>
          ) : (
            displayReviews.map((rev) => {
              const isAuthor = currentUserId && rev.userId === currentUserId;
              const canManage = isAuthor || isAdmin;
              const hasVotedHelpful = currentUserId
                ? rev.helpfulVotes?.includes(currentUserId)
                : false;

              return (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3.5 transition-all relative"
                >
                  {/* Header: Author Info, Badges, Date & Actions Menu */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {rev.author}
                          </span>
                          {/* Pending Approval Badge: ONLY visible to the review author or Admin */}
                          {rev.status === 'PENDING' && canManage && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> অপেক্ষমাণ (Pending Approval)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                    </div>

                    {/* Ownership Actions (Edit / Delete) - ONLY visible to Author or Admin */}
                    {canManage && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === rev.id ? null : rev.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="ম্যানেজ করুন"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === rev.id && (
                          <div className="absolute right-0 top-8 w-36 py-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-20 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingReview(rev);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                              <span>Edit Review</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(rev.id)}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Review</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Attached Photos Gallery */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {rev.images.map((imgSrc, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => setSelectedPhotoModal(imgSrc)}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-sm cursor-pointer group"
                        >
                          <Image
                            src={imgSrc}
                            alt={`Customer unboxing photo ${imgIdx + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer: Helpful Voting Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <button
                      type="button"
                      onClick={() => handleVote(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                        hasVotedHelpful
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                          : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVotedHelpful ? 'fill-current' : ''}`} />
                      <span>
                        সহায়ক ({rev.helpfulVotes?.length || 0})
                      </span>
                    </button>

                    <span className="text-[11px] text-slate-400">
                      ভেরিফাইড ডেলিভারি
                    </span>
                  </div>

                  {/* Official Merchant / Admin Reply Box */}
                  {rev.sellerReply && (
                    <div className="mt-3 p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.sellerReply.author}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-500 text-white">
                            {rev.sellerReply.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{rev.sellerReply.date}</span>
                          {isAdmin && (
                            <>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingReplyId(rev.id);
                                  setReplyEditText(rev.sellerReply?.comment || '');
                                }}
                                className="text-[10px] font-bold text-blue-500 hover:underline cursor-pointer"
                              >
                                এডিট
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('রিপ্লাই মুছে ফেলতে চান?')) {
                                    deleteSellerReply(rev.id);
                                  }
                                }}
                                className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                              >
                                মুছুন
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {editingReplyId === rev.id ? (
                        <div className="pt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={replyEditText}
                            onChange={(e) => setReplyEditText(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-500 text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingReplyId(null);
                                setReplyEditText('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                            >
                              বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (replyEditText.trim()) {
                                  addSellerReply(rev.id, replyEditText.trim(), 'ShopNexus Official Support', 'Verified Merchant');
                                  setEditingReplyId(null);
                                  setReplyEditText('');
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold shadow-sm"
                            >
                              আপডেট করুন
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.sellerReply.comment}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhotoModal && (
        <div
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <Image
              src={selectedPhotoModal}
              alt="Customer photo enlarged"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};
