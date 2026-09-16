'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Truck } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';
import { toBengaliNumber } from '@/lib/translations';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'NEX-892147';
  const total = searchParams.get('total') || '299.99';

  const { language } = useLanguageStore();
  const mounted = useHydrated();
  const isBn = mounted && language === 'bn';

  const formattedTotal = isBn
    ? `৳${toBengaliNumber(Number(total).toLocaleString('en-US'))} টাকা`
    : `৳${Number(total).toLocaleString()} BDT`;

  return (
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-2xl text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          {isBn ? 'অর্ডার নিশ্চিত হয়েছে' : 'Order Confirmed'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          {isBn ? 'পেমেন্ট সম্পন্ন ও অর্ডার গৃহীত হয়েছে!' : 'Payment & Order Placed!'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
          {isBn
            ? 'শপনেক্সাসে কেনাকাটার জন্য আপনাকে আন্তরিক ধন্যবাদ। আমরা আপনার অর্ডারটি প্রস্তুত ও ডেলিভারির জন্য প্রসেস করছি।'
            : 'Thank you for shopping with ShopNexus. We are currently processing your order for fulfillment.'}
        </p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-2.5 text-xs sm:text-sm text-left">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">
            {isBn ? 'অর্ডার ইনভয়েস আইডি:' : 'Order Invoice ID:'}
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">
            {isBn ? 'পরিশোধিত মোট মূল্য:' : 'Total Charged:'}
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formattedTotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">
            {isBn ? 'সম্ভাব্য ডেলিভারি:' : 'Estimated Delivery:'}
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {isBn ? '২৪ - ৪৮ ঘণ্টার মধ্যে' : 'Within 24 - 48 Hours'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href={`/track?id=${encodeURIComponent(orderId)}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
        >
          <Truck className="w-4 h-4" /> {isBn ? 'লাইভ পার্সেল ট্র্যাকিং' : 'Live Parcel Tracking'}
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          {isBn ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-slate-500 dark:text-white text-center">Loading receipt...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
