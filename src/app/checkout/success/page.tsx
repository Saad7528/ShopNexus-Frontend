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
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Order Confirmed</span>
        <h1 className="text-3xl font-black text-white mt-1">Payment & Order Placed!</h1>
        <p className="text-slate-400 text-sm mt-2">
          Thank you for shopping with ShopNexus. We are currently processing your order for fulfillment.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2 text-sm text-left">
        <div className="flex justify-between">
          <span className="text-slate-400">Order Tracking Number:</span>
          <span className="font-mono font-bold text-white">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Total Charged:</span>
          <span className="font-mono font-bold text-emerald-400">${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Estimated Delivery:</span>
          <span className="font-medium text-white">Within 2 - 3 Business Days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
        >
          <Home className="w-4 h-4" /> Return Home
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-white text-center">Loading receipt...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
