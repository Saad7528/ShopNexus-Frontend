'use client';

import React, { useState } from 'react';

import { Tag, Check, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const CouponApply: React.FC = () => {
  const { appliedCoupon, discount, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // 1. Try Backend verification first
      const res = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase().trim(), cartTotal: subtotal }),
      });

      if (res.ok) {
        const data = await res.json();
        applyCoupon(data.data.code, data.data.discountAmount);
        setSuccess(`Coupon ${data.data.code} applied! -$${data.data.discountAmount}`);
        setCode('');
        return;
      }

      // 2. Client-side fallback coupons for demo
      const upper = code.toUpperCase().trim();
      if (upper === 'NEXUS20') {
        const discountAmt = parseFloat((subtotal * 0.2).toFixed(2));
        applyCoupon('NEXUS20', discountAmt);
        setSuccess('Promo code NEXUS20 applied! (20% OFF)');
        setCode('');
        return;
      } else if (upper === 'SAVE50' && subtotal >= 200) {
        applyCoupon('SAVE50', 50);
        setSuccess('Promo code SAVE50 applied! ($50 OFF)');
        setCode('');
        return;
      } else if (upper === 'WELCOME10') {
        const discountAmt = parseFloat((subtotal * 0.1).toFixed(2));
        applyCoupon('WELCOME10', discountAmt);
        setSuccess('Promo code WELCOME10 applied! (10% OFF)');
        setCode('');
        return;
      }

      throw new Error('Invalid coupon code. Try "NEXUS20" for 20% off!');
    } catch (err: any) {
      setError(err.message || 'Failed to apply coupon');
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300 uppercase tracking-wider">{appliedCoupon}</span>
          <span className="text-emerald-400 font-medium">(-${discount.toFixed(2)})</span>
        </div>
        <button
          onClick={removeCoupon}
          className="text-slate-400 hover:text-rose-400 transition-colors p-1"
          title="Remove coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code (e.g. NEXUS20)"
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
        </button>
      </form>

      {error && <p className="text-[11px] text-rose-400 pl-1">{error}</p>}
      {success && <p className="text-[11px] text-emerald-400 pl-1">{success}</p>}
    </div>
  );
};
