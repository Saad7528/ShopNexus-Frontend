'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Search,
  Camera,
  User,
  ThumbsUp,
  Sliders,
  Send,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useReviewStore, ModerationMode, IReviewItem } from '@/store/useReviewStore';

export default function AdminReviewsPage() {
  const {
    reviews,
    moderationMode,
    setModerationMode,
    approveReview,
    rejectReview,
    deleteReview,
    addSellerReply,
    deleteSellerReply,
  } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : rev.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch =
        rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.authorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [reviews, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === 'PENDING').length,
      approved: reviews.filter((r) => r.status === 'APPROVED').length,
      rejected: reviews.filter((r) => r.status === 'REJECTED').length,
    };
  }, [reviews]);

  const handleApprove = (id: string) => {
    approveReview(id);
    showToast('রিভিউটি সফলভাবে অনুমোদন (Approved) করা হয়েছে');
  };

  const handleReject = (id: string) => {
    rejectReview(id);
    showToast('রিভিউটি বাতিল (Rejected) করা হয়েছে');
  };

  const handleDelete = (id: string, userId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই রিভিউটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
      deleteReview(id, userId, true);
      showToast('রিভিউটি ডিলিট করা হয়েছে');
    }
  };

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    addSellerReply(reviewId, replyText.trim(), 'ShopNexus Admin Team', 'Super Admin');
    setReplyText('');
    setReplyingReviewId(null);
    showToast('অফিশিয়াল রিপ্লাই যুক্ত হয়েছে');
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                Customer Reviews & Moderation <MessageSquare className="w-5 h-5 text-orange-500" />
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                গ্রাহকদের রিভিউ পর্যবেক্ষণ, অটো-অ্যাপ্রুভাল সেটিংস এবং অফিশিয়াল রিপ্লাই ম্যানেজমেন্ট
              </p>
            </div>
          </div>

          {/* Toast Notification */}
          {feedbackToast && (
            <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" /> {feedbackToast}
            </div>
          )}
        </div>

        {/* Moderation Automation Settings Banner */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  স্বয়ংক্রিয় মডারেশন ও অ্যাপ্রুভাল পলিসি (Moderation Rule Engine)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  নতুন রিভিউ জমা হওয়ার পর কীভাবে তা স্টোরফ্রন্টে লাইভ হবে তা নির্ধারণ করুন
                </p>
              </div>
            </div>

            {/* Moderation Mode Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setModerationMode('AUTO_24H');
                  showToast('মোড পরিবর্তিত হয়েছে: ২৪ ঘণ্টা পর অটো-অ্যাপ্রুভ');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  moderationMode === 'AUTO_24H'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>২৪ ঘণ্টা পর অটো-অ্যাপ্রুভ (ডিফল্ট)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModerationMode('INSTANT');
                  showToast('মোড পরিবর্তিত হয়েছে: তাৎক্ষণিক অটো-অ্যাপ্রুভ');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  moderationMode === 'INSTANT'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>তাৎক্ষণিক লাইভ (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModerationMode('MANUAL');
                  showToast('মোড পরিবর্তিত হয়েছে: ম্যানুয়াল অ্যাডমিন অ্যাপ্রুভাল');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  moderationMode === 'MANUAL'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ম্যানুয়াল অ্যাপ্রুভাল (Strict)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              সব রিভিউ ({counts.all})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> অপেক্ষমাণ ({counts.pending})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> অনুমোদিত ({counts.approved})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" /> বাতিল ({counts.rejected})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কাস্টমার, পণ্য বা কমেন্ট খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
              <p>কোনো রিভিউ পাওয়া যায়নি।</p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-orange-500/20">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {rev.author}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Verified Buyer
                        </span>
                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rev.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : rev.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {rev.status === 'APPROVED' ? 'অনুমোদিত' : rev.status === 'PENDING' ? 'অপেক্ষমাণ' : 'বাতিল'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        পণ্য: <span className="text-slate-700 dark:text-slate-300 font-semibold">{rev.productName}</span> • {rev.date}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          rev.rating >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {rev.rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {rev.images.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-sm"
                      >
                        <Image
                          src={imgSrc}
                          alt="Customer upload"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Seller Reply Box */}
                {rev.sellerReply && (
                  <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-1.5">
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
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingReviewId(rev.id);
                            setReplyText(rev.sellerReply?.comment || '');
                          }}
                          className="text-[11px] font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" /> রিপ্লাই এডিট
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                          type="button"
                          onClick={() => deleteSellerReply(rev.id)}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> মুছুন
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.sellerReply.comment}
                    </p>
                  </div>
                )}

                {/* Inline Reply Form (when active) */}
                {replyingReviewId === rev.id && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      অফিশিয়াল রিপ্লাই লিখুন:
                    </label>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="গ্রাহকের জন্য অফিশিয়াল ধন্যবাদ বা মতামত লিখুন..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingReviewId(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                      >
                        <Send className="w-3 h-3" /> রিপ্লাই পোস্ট করুন
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-orange-500" />
                    {rev.helpfulVotes?.length || 0} জন সহায়ক বলেছেন
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Approve button */}
                    {rev.status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(rev.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {/* Reject button */}
                    {rev.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleReject(rev.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}

                    {/* Reply button */}
                    <button
                      type="button"
                      onClick={() => setReplyingReviewId(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 hover:text-orange-500 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Official Reply
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id, rev.userId)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-500 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                      title="স্থায়ীভাবে মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
