'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Percent,
  Calendar,
  Zap,
  Clock,
  ArrowLeft,
  X,
  ShoppingCart,
  Send,
  Mail,
  User,
} from 'lucide-react';

interface ICoupon {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

interface IAbandonedCart {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  items: string;
  cartValue: number;
  abandonedAgo: string;
  recovered: boolean;
}

const INITIAL_COUPONS: ICoupon[] = [
  {
    id: 'c-1',
    code: 'NEXUS10',
    discountPercentage: 10,
    minOrderAmount: 2500, // ৳ 2,500
    usageLimit: 1000,
    usedCount: 342,
    expiresAt: '2026-12-31',
    isActive: true,
  },
  {
    id: 'c-2',
    code: 'FLASH20',
    discountPercentage: 20,
    minOrderAmount: 5000, // ৳ 5,000
    usageLimit: 500,
    usedCount: 189,
    expiresAt: '2026-09-01',
    isActive: true,
  },
  {
    id: 'c-3',
    code: 'VIP50',
    discountPercentage: 50,
    minOrderAmount: 20000, // ৳ 20,000
    usageLimit: 50,
    usedCount: 50,
    expiresAt: '2026-08-01',
    isActive: false,
  },
];

const INITIAL_ABANDONED_CARTS: IAbandonedCart[] = [
  {
    id: 'ab-1',
    customerName: 'Ashfaqur Rahman',
    email: 'ashfaq.tech@gmail.com',
    phone: '+880 1711-445566',
    items: 'Sony WH-1000XM5 ANC (1x)',
    cartValue: 32500,
    abandonedAgo: '3 hours ago',
    recovered: false,
  },
  {
    id: 'ab-2',
    customerName: 'Mehnaz Parveen',
    email: 'mehnaz.bd@gmail.com',
    phone: '+880 1819-223311',
    items: 'Keychron Q1 Pro (1x), Razer Viper Mouse (1x)',
    cartValue: 29800,
    abandonedAgo: '6 hours ago',
    recovered: false,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>(INITIAL_COUPONS);
  const [abandonedCarts, setAbandonedCarts] = useState<IAbandonedCart[]>(INITIAL_ABANDONED_CARTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercentage: '15',
    minOrderAmount: '2000',
    usageLimit: '500',
    expiresAt: '2026-12-31',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) {
      alert('Please enter a coupon code.');
      return;
    }

    const created: ICoupon = {
      id: `c-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountPercentage: parseInt(newCoupon.discountPercentage) || 10,
      minOrderAmount: parseFloat(newCoupon.minOrderAmount) || 0,
      usageLimit: parseInt(newCoupon.usageLimit) || 100,
      usedCount: 0,
      expiresAt: newCoupon.expiresAt || '2026-12-31',
      isActive: true,
    };

    setCoupons([created, ...coupons]);
    setIsCreateModalOpen(false);
    showToast(`Coupon "${created.code}" created successfully!`);
    setNewCoupon({
      code: '',
      discountPercentage: '15',
      minOrderAmount: '2000',
      usageLimit: '500',
      expiresAt: '2026-12-31',
    });
  };

  const handleSendRecovery = (id: string, name: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, recovered: true } : c))
    );
    showToast(`Dispatched automated 10% recovery coupon code to ${name}!`);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Coupon status updated!');
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast(`Coupon "${code}" deleted.`);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              Promotions & Cart Recovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Coupons & Marketing Engine</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create Bangladeshi Taka (৳ BDT) discount coupons, set cart thresholds, and recover abandoned checkouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Coupon Code
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMsg}
          </div>
        )}

        {/* Active Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-white tracking-tight px-3 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300">
                  {coupon.code}
                </span>

                <button
                  type="button"
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                    coupon.isActive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Discount Rate:</span>
                  <span className="font-bold text-emerald-400 text-sm">{coupon.discountPercentage}% OFF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Min Order (৳ BDT):</span>
                  <span className="font-mono text-white font-semibold">৳{coupon.minOrderAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Redeemed:</span>
                  <span className="font-semibold text-slate-200">
                    {coupon.usedCount} / {coupon.usageLimit} uses
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expires On:</span>
                  <span className="font-mono text-slate-300">{coupon.expiresAt}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">ShopNexus Engine</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🛒 ABANDONED CART RECOVERY SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">Abandoned Cart Recovery Hub</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Recover potential sales by sending 1-click discount vouchers to users who dropped off before checkout.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold self-start sm:self-auto">
              2 Unfinished Checkouts Today
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {abandonedCarts.map((cart) => (
              <div key={cart.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs">{cart.customerName}</div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {cart.abandonedAgo}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  <div className="text-slate-300 font-semibold">{cart.items}</div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block mt-0.5">
                    Cart Value: ৳{cart.cartValue.toLocaleString()} BDT
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{cart.email}</span>
                  {cart.recovered ? (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      ✓ Offer Dispatched
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendRecovery(cart.id, cart.customerName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      <Send className="w-3 h-3" /> Send 10% Voucher
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Coupon Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-white">Create New Coupon</h2>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Coupon Code (e.g. FLASH25) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SUMMER25"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Discount % *
                    </label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discountPercentage}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Min Order (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newCoupon.expiresAt}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    Save Coupon (৳ BDT)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
