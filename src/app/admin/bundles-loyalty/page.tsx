'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Gift,
  Sparkles,
  Award,
  Crown,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  User,
  Phone,
  Sliders,
  Check,
} from 'lucide-react';

interface IBundleDeal {
  id: string;
  title: string;
  badge: string;
  items: { title: string; image: string; regularPrice: number }[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  status: 'Active' | 'Draft' | 'Expired';
  salesCount: number;
}

interface ICustomerLoyalty {
  id: string;
  name: string;
  phone: string;
  tier: 'Gold VIP' | 'Silver Member' | 'Bronze Shopper';
  points: number;
  totalSpent: number;
  lastRedeemed: string;
}

const INITIAL_BUNDLES: IBundleDeal[] = [
  {
    id: 'b-1',
    title: 'Ultimate Audiophile Master Combo',
    badge: '🔥 15% OFF BUNDLE',
    items: [
      {
        title: 'Sony WH-1000XM5 Wireless ANC',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        regularPrice: 32500,
      },
      {
        title: 'Bose QuietComfort Ultra Spatial Audio',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        regularPrice: 38900,
      },
    ],
    originalTotal: 71400,
    bundlePrice: 60690,
    savings: 10710,
    status: 'Active',
    salesCount: 38,
  },
  {
    id: 'b-2',
    title: 'Titanium Creator Pro Suite',
    badge: '⭐ POPULAR COMBO',
    items: [
      {
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        regularPrice: 79900,
      },
      {
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
      },
    ],
    originalTotal: 97800,
    bundlePrice: 85900,
    savings: 11900,
    status: 'Active',
    salesCount: 52,
  },
  {
    id: 'b-3',
    title: 'Esports Competitive Duo',
    badge: '🎮 GAMER SPECIAL',
    items: [
      {
        title: 'Razer Viper V2 Pro Ultra-Lightweight',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        regularPrice: 11900,
      },
      {
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
      },
    ],
    originalTotal: 29800,
    bundlePrice: 25500,
    savings: 4300,
    status: 'Active',
    salesCount: 64,
  },
];

const INITIAL_LOYALTY_CUSTOMERS: ICustomerLoyalty[] = [
  {
    id: 'cl-1',
    name: 'Tanvir Hossain',
    phone: '+880 1712-345678',
    tier: 'Gold VIP',
    points: 4850,
    totalSpent: 285000,
    lastRedeemed: '2 days ago (৳500 used)',
  },
  {
    id: 'cl-2',
    name: 'Sarah Rahman',
    phone: '+880 1819-876543',
    tier: 'Gold VIP',
    points: 3200,
    totalSpent: 192000,
    lastRedeemed: 'Last week (৳300 used)',
  },
  {
    id: 'cl-3',
    name: 'Nusrat Jahan',
    phone: '+880 1911-223344',
    tier: 'Silver Member',
    points: 1450,
    totalSpent: 98000,
    lastRedeemed: 'Never redeemed',
  },
  {
    id: 'cl-4',
    name: 'Mahmudul Hasan',
    phone: '+880 1622-998877',
    tier: 'Bronze Shopper',
    points: 620,
    totalSpent: 39500,
    lastRedeemed: 'Never redeemed',
  },
];

export default function BundlesAndLoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'bundles' | 'loyalty'>('bundles');
  const [bundles, setBundles] = useState<IBundleDeal[]>(INITIAL_BUNDLES);
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<ICustomerLoyalty[]>(INITIAL_LOYALTY_CUSTOMERS);
  
  // Point rules state
  const [pointsPerHundred, setPointsPerHundred] = useState('5');
  const [minRedemptionPoints, setMinRedemptionPoints] = useState('100');
  
  // Create Bundle Modal
  const [isAddBundleModalOpen, setIsAddBundleModalOpen] = useState(false);
  const [newBundleTitle, setNewBundleTitle] = useState('');
  const [newBundleBadge, setNewBundleBadge] = useState('🔥 COMBO DISCOUNT');
  const [newOriginalPrice, setNewOriginalPrice] = useState('50000');
  const [newBundlePrice, setNewBundlePrice] = useState('42500');

  // Customer Points Adjustment Modal
  const [adjustingCustomer, setAdjustingCustomer] = useState<ICustomerLoyalty | null>(null);
  const [pointDelta, setPointDelta] = useState('200');

  const handleCreateBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBundleTitle) return;

    const orig = parseInt(newOriginalPrice) || 0;
    const bund = parseInt(newBundlePrice) || 0;

    const newDeal: IBundleDeal = {
      id: `b-${Date.now()}`,
      title: newBundleTitle,
      badge: newBundleBadge,
      items: [
        {
          title: 'Sony WH-1000XM5 Wireless ANC',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
          regularPrice: orig / 2,
        },
        {
          title: 'Keychron Q1 Pro Custom Keyboard',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
          regularPrice: orig / 2,
        },
      ],
      originalTotal: orig,
      bundlePrice: bund,
      savings: Math.max(0, orig - bund),
      status: 'Active',
      salesCount: 0,
    };

    setBundles((prev) => [newDeal, ...prev]);
    setIsAddBundleModalOpen(false);
    setNewBundleTitle('');
  };

  const handleSavePointsAdjustment = () => {
    if (!adjustingCustomer) return;
    const delta = parseInt(pointDelta) || 0;

    setLoyaltyCustomers((prev) =>
      prev.map((c) =>
        c.id === adjustingCustomer.id ? { ...c, points: Math.max(0, c.points + delta) } : c
      )
    );
    setAdjustingCustomer(null);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> High-Conversion Growth Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Bundle Offers & Loyalty Points Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              আকর্ষণীয় প্রোডাক্ট কম্বো বান্ডেল তৈরি করুন এবং কাস্টমার রিওয়ার্ড পয়েন্ট ও ভিআইপি টায়ার পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'bundles' ? (
              <button
                type="button"
                onClick={() => setIsAddBundleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Combo Bundle</span>
              </button>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" /> 1 Point = ৳1 Store Credit
              </span>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('bundles')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'bundles'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Bundle & Combo Deals ({bundles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loyalty')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'loyalty'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Loyalty Points & VIP Tiers</span>
          </button>
        </div>

        {/* TAB 1: BUNDLE OFFERS */}
        {activeTab === 'bundles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {bundles.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all group"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[10px] border border-orange-500/20">
                        {deal.badge}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {deal.salesCount} Combos Sold
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                      {deal.title}
                    </h3>

                    {/* Included Products Visual Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                      {deal.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="pt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through font-mono block">
                          ৳{deal.originalTotal.toLocaleString()}
                        </span>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          ৳{deal.bundlePrice.toLocaleString()} BDT
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                          Save ৳{deal.savings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live on Storefront
                    </span>
                    <button
                      type="button"
                      onClick={() => setBundles((prev) => prev.filter((b) => b.id !== deal.id))}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Delete Combo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LOYALTY POINTS & VIP TIERS */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            {/* VIP Tiers Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Bronze */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Bronze Shopper
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Entry Level
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  1x Standard Point Earning
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Spend ৳0 - ৳50,000. Earns 5 points per ৳100 spent (5% cashback credit).
                </p>
              </div>

              {/* Silver */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-300" /> Silver Enthusiast
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-blue-500">
                    1.25x Points
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  1.25x Multiplier & Early Access
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Spend ৳50,000+. Unlocks 6.25 points per ৳100 and exclusive flash sale access.
                </p>
              </div>

              {/* Gold VIP */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" /> Gold VIP Elite
                  </span>
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    1.5x + FREE SHIPPING
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  1.5x Multiplier & Free Express Delivery
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Spend ৳150,000+. Unlocks 7.5 points per ৳100, lifetime free delivery, and dedicated WhatsApp support.
                </p>
              </div>
            </div>

            {/* Customer Points Ledger Table */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" /> Top Customer Loyalty Points Ledger
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    কাস্টমারদের পয়েন্ট ব্যালেন্স ও ক্যাশব্যাক হিস্ট্রি দেখুন এবং প্রয়োজনে ম্যানুয়ালি পয়েন্ট এডজাস্ট করুন।
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Customer Name & Phone</th>
                      <th className="px-5 py-3.5">VIP Tier Badge</th>
                      <th className="px-5 py-3.5">Lifetime Total Spent</th>
                      <th className="px-5 py-3.5">Points Balance (৳ Credit)</th>
                      <th className="px-5 py-3.5">Last Redemption</th>
                      <th className="px-5 py-3.5 text-right">Points Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {loyaltyCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                          <span className="text-[10px] font-mono text-slate-400">{c.phone}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                              c.tier === 'Gold VIP'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                : c.tier === 'Silver Member'
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {c.tier === 'Gold VIP' && <Crown className="w-3 h-3 text-amber-500" />}
                            {c.tier}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          ৳{c.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                            {c.points.toLocaleString()} pts
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">(= ৳{c.points} BDT)</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[11px]">{c.lastRedeemed}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustingCustomer(c);
                              setPointDelta('200');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-[11px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          >
                            <Sliders className="w-3 h-3 text-orange-500" />
                            <span>Adjust Points</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ➕ CREATE NEW COMBO BUNDLE MODAL */}
        {isAddBundleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Create Combo Bundle Deal</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      একাধিক প্রোডাক্ট যুক্ত করে আকর্ষণীয় কম্বো ডিসকাউন্ট সেট করুন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddBundleModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBundle} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    Bundle Title (কম্বো প্যাকেজের নাম):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master ANC Audio & Keyboard Combo"
                    value={newBundleTitle}
                    onChange={(e) => setNewBundleTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    Promo Badge Label:
                  </label>
                  <input
                    type="text"
                    value={newBundleBadge}
                    onChange={(e) => setNewBundleBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Combined Regular Price (৳):
                    </label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Special Combo Price (৳):
                    </label>
                    <input
                      type="number"
                      value={newBundlePrice}
                      onChange={(e) => setNewBundlePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-bold focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddBundleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Combo Bundle</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🔢 ADJUST CUSTOMER POINTS MODAL */}
        {adjustingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" /> Adjust Points: {adjustingCustomer.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setAdjustingCustomer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Points:</span>
                  <span className="font-mono font-bold text-amber-600">{adjustingCustomer.points} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VIP Tier:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{adjustingCustomer.tier}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <label className="block text-[11px] uppercase font-bold text-slate-500">
                  Points Credit / Debit (+ or -):
                </label>
                <input
                  type="number"
                  placeholder="+200 or -100"
                  value={pointDelta}
                  onChange={(e) => setPointDelta(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingCustomer(null)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePointsAdjustment}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white text-xs font-bold shadow-md shadow-orange-500/25"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
