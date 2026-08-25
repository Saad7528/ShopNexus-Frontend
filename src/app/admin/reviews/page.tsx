'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface ICustomerReview {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

const INITIAL_REVIEWS: ICustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.dev@gmail.com',
    productName: 'Sony WH-1000XM5 Wireless ANC Headphones',
    rating: 5,
    comment: 'The noise cancellation is unmatched in this price range. Super comfortable headband and spatial audio is mind-blowing!',
    photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    status: 'Approved',
    createdAt: '2 hours ago',
  },
  {
    id: 'rev-2',
    customerName: 'Sarah Rahman',
    customerEmail: 'sarah.audio@gmail.com',
    productName: 'Apple Watch Ultra 2 Titanium Smartwatch',
    rating: 5,
    comment: 'Real aerospace grade titanium! Battery lasts over 3 days on single charge. Verified delivery in 24 hours inside Dhaka.',
    photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    status: 'Approved',
    createdAt: '5 hours ago',
  },
  {
    id: 'rev-3',
    customerName: 'Kazi Mahbub',
    customerEmail: 'mahbub.photo@yahoo.com',
    productName: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    rating: 4,
    comment: 'Full aluminum heavy chassis. South facing RGB looks amazing with custom keycaps. Photo attached of my desk setup!',
    photoUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    status: 'Pending',
    createdAt: '20 mins ago',
  },
  {
    id: 'rev-4',
    customerName: 'Spam Bot 99',
    customerEmail: 'spambot@fake.com',
    productName: 'Razer Viper V2 Pro Gaming Mouse',
    rating: 1,
    comment: 'Visit free-crypto-bonuses.com for 500 dollars free cash instant deposit!!',
    status: 'Rejected',
    createdAt: '1 day ago',
  },
];

export default function AdminReviewsModerationPage() {
  const [reviews, setReviews] = useState<ICustomerReview[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateStatus = (id: string, status: ICustomerReview['status'], customerName: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Review by ${customerName} marked as "${status}"!`);
  };

  const handleDeleteReview = (id: string, customerName: string) => {
    if (confirm(`Delete review from ${customerName}?`)) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast(`Review deleted.`);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === 'Pending').length;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5" />
              Customer Trust & Social Proof
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Review Moderation & Photos</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Approve customer product reviews, inspect verified buyer delivery photos, and moderate spam feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> {pendingCount} Pending Approvals
              </span>
            )}
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMsg}
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 p-1 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-xs w-full relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search reviewer or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 block">{rev.productName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">({rev.rating}/5 Stars)</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      rev.status === 'Approved'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : rev.status === 'Rejected'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  "{rev.comment}"
                </p>

                {/* Customer Photo Attachment Preview */}
                {rev.photoUrl && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Attached Customer Photo:
                    </span>
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <Image src={rev.photoUrl} alt="Customer Review Photo" fill className="object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer Details & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.customerName}</div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{rev.customerEmail} • {rev.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  {rev.status !== 'Approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev.id, 'Approved', rev.customerName)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}

                  {rev.status !== 'Rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev.id, 'Rejected', rev.customerName)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev.id, rev.customerName)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
