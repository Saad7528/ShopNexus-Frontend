'use client';

import React, { useState } from 'react';
import { Tag, Check, Loader2, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const POPULAR_COUPONS = [
  { code: 'NEXUS20', label: '20% OFF', desc: 'All Orders' },
  { code: 'WELCOME10', label: '10% OFF', desc: 'First Order' },
  { code: 'SAVE50', label: '$50 OFF', desc: 'Orders > $200' },
];

export const CouponApply: React.FC = () => {
  const { appliedCoupon, discount, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyPromoCode = async (promoCode: string) => {
    const trimmed = promoCode.toUpperCase().trim();
    if (!trimmed) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // 1. Try Backend verification first
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/coupons/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: trimmed, cartTotal: subtotal }),
        });

        if (res.ok) {
          const data = await res.json();
          applyCoupon(data.data.code, data.data.discountAmount);
          setSuccess(`Coupon ${data.data.code} applied! -$${data.data.discountAmount.toFixed(2)}`);
          setCode('');
          return;
        }
      } catch (_apiErr) {
        // Backend not currently reachable, fall back to smart local promo engine
      }

      // 2. Client-side verified promo codes
      if (trimmed === 'NEXUS20') {
        const discountAmt = parseFloat((subtotal * 0.2).toFixed(2));
        applyCoupon('NEXUS20', discountAmt);
        setSuccess('Promo code NEXUS20 applied! (20% OFF)');
        setCode('');
        return;
      } else if (trimmed === 'SAVE50') {
        if (subtotal < 200) {
          throw new Error('SAVE50 requires a minimum order subtotal of $200.00.');
        }
        applyCoupon('SAVE50', 50.0);
        setSuccess('Promo code SAVE50 applied! ($50.00 OFF)');
        setCode('');
        return;
      } else if (trimmed === 'WELCOME10') {
        const discountAmt = parseFloat((subtotal * 0.1).toFixed(2));
        applyCoupon('WELCOME10', discountAmt);
        setSuccess('Promo code WELCOME10 applied! (10% OFF)');
        setCode('');
        return;
      }

      throw new Error('Invalid coupon code. Click one of the available promo codes below.');
    } catch (err: any) {
      setError(err.message || 'Failed to apply coupon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromoCode(code);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-emerald-300 uppercase tracking-wider">{appliedCoupon}</span>
            <span className="text-emerald-400 font-semibold ml-2">(-${discount.toFixed(2)})</span>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          title="Remove coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code (e.g. NEXUS20)"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 uppercase font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] disabled:opacity-40 text-xs font-bold text-white rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-1.5"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
        </button>
      </form>

      {/* Popular Promo Code suggestions */}
      <div className="pt-1">
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
          <Sparkles className="w-3 h-3 text-orange-600 dark:text-orange-400" /> Available Deals:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_COUPONS.map((promo) => (
            <button
              key={promo.code}
              type="button"
              onClick={() => applyPromoCode(promo.code)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-slate-200 dark:border-slate-700 hover:border-orange-500/40 text-[11px] text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-300 transition-all font-mono cursor-pointer"
            >
              <span className="font-bold text-slate-900 dark:text-white">{promo.code}</span>
              <span className="text-[10px] text-orange-600 dark:text-orange-400">({promo.label})</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-[11px] text-rose-500 dark:text-rose-400 pl-1 font-medium">{error}</p>}
      {success && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 pl-1 font-medium">{success}</p>}
    </div>
  );
};
