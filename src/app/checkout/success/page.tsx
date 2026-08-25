'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, Home, ShieldCheck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'NEX-892147';
  const total = searchParams.get('total') || '299.99';

  return (
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-2xl text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Order Confirmed</span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Payment & Order Placed!</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
          Thank you for shopping with ShopNexus. We are currently processing your order for fulfillment.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-2 text-sm text-left">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Order Invoice ID:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Total Charged:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">৳{Number(total).toLocaleString()} BDT</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
          <span className="font-medium text-slate-900 dark:text-white">Within 24 - 48 Hours</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/profile"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
        >
          <Package className="w-4 h-4" /> View Order in Profile
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
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
