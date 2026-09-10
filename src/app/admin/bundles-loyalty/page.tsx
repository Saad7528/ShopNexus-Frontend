'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Gift,
  Sparkles,
  Award,
  Crown,
  Plus,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Coins,
  Sliders,
  Tag,
  Package,
} from 'lucide-react';

import { useBundleStore } from '@/store/useBundleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { showConfirmDialog } from '@/store/useDialogStore';

interface ICustomerLoyalty {
  id: string;
  name: string;
  phone: string;
  tier: 'Gold VIP' | 'Silver Member' | 'Bronze Shopper';
  points: number;
  totalSpent: number;
  lastRedeemed: string;
}

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
  const { language } = useLanguageStore();
  const isBn = language === 'bn';
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'bundles' | 'loyalty'>('bundles');
  const { bundles, deleteBundle } = useBundleStore();
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<ICustomerLoyalty[]>(INITIAL_LOYALTY_CUSTOMERS);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch live customer users for Loyalty table
  React.useEffect(() => {
    const fetchLoyaltyUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: ICustomerLoyalty[] = data.data
            .filter((u: any) => u.role === 'customer' || !u.role)
            .map((u: any) => {
              const points = u.nexusCoins || 500;
              const tier: ICustomerLoyalty['tier'] =
                points >= 3000 ? 'Gold VIP' : points >= 1000 ? 'Silver Member' : 'Bronze Shopper';
              return {
                id: u._id,
                name: u.name,
                phone: u.phoneNumber || '+880 1700-000000',
                tier,
                points,
                totalSpent: points * 25,
                lastRedeemed: u.vipFirstOrderUsed ? '1 day ago (৳200 VIP used)' : 'Never redeemed',
              };
            });

          if (mapped.length > 0) {
            setLoyaltyCustomers((prev) => {
              const ids = new Set(mapped.map((m) => m.id));
              return [...mapped, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }
      } catch (err) {
        console.error('Error fetching loyalty users:', err);
      }
    };

    fetchLoyaltyUsers();
  }, [API_URL, token]);

  // Customer Points Adjustment Modal
  const [adjustingCustomer, setAdjustingCustomer] = useState<ICustomerLoyalty | null>(null);
  const [pointDelta, setPointDelta] = useState('200');

  // Customer points adjustment handler
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
              <Sparkles className="w-3.5 h-3.5" /> {isBn ? 'হাই-কনভার্সন গ্রোথ ইঞ্জিন' : 'High-Conversion Growth Engine'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'বান্ডেল অফার ও লয়্যালটি পয়েন্টস ম্যানেজার' : 'Bundle Offers & Loyalty Points Manager'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'আকর্ষণীয় প্রোডাক্ট কম্বো বান্ডেল তৈরি করুন এবং কাস্টমার রিওয়ার্ড পয়েন্ট ও ভিআইপি টায়ার পরিচালনা করুন।'
                : 'Create high-converting combo bundles and manage customer loyalty reward points and VIP tiers.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === 'bundles' ? (
              <Link
                href="/admin/bundles-loyalty/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'নতুন কম্বো বান্ডেল তৈরি করুন' : 'Create New Combo Bundle'}</span>
              </Link>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" /> {isBn ? '১ পয়েন্ট = ৳১ স্টোর ক্রেডিট' : '1 Point = ৳1 Store Credit'}
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
            <span>
              {isBn ? 'বান্ডেল ও কম্বো ডিল' : 'Bundle & Combo Deals'} ({isBn ? toBengaliNumber(bundles.length) : bundles.length})
            </span>
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
            <span>{isBn ? 'লয়্যালটি পয়েন্ট ও ভিআইপি' : 'Loyalty Points & VIP Tiers'}</span>
          </button>
        </div>

        {/* TAB 1: BUNDLE OFFERS */}
        {activeTab === 'bundles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-4">
                    {/* Top Badges & Sales */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[11px] border border-orange-500/20 inline-flex items-center gap-1">
                        {deal.badge}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
                          {isBn ? `${toBengaliNumber(deal.salesCount)} টি কম্বো বিক্রিত` : `${deal.salesCount} Combos Sold`}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {deal.description}
                      </p>
                    </div>

                    {/* Included Products Visual List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>
                          {isBn ? 'বান্ডেলের আইটেমসমূহ' : 'Items in Bundle'} ({isBn ? toBengaliNumber(deal.items.length) : deal.items.length})
                        </span>
                        <span className="text-amber-500 font-semibold flex items-center gap-1 whitespace-nowrap">
                          <Coins className="w-3 h-3" /> +{isBn ? toBengaliNumber(deal.rewardPoints) : deal.rewardPoints} {isBn ? 'পয়েন্ট' : 'Pts'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {deal.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                          >
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain p-0.5"
                                sizes="32px"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[10px] text-slate-900 dark:text-white truncate">
                                {item.title}
                              </div>
                              <div className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                                {isBn ? `৳${toBengaliNumber(item.regularPrice.toLocaleString('en-US'))}` : `৳${item.regularPrice.toLocaleString()}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code & Instructions */}
                    {(deal.promoCode || deal.purchaseInstruction) && (
                      <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/15 space-y-1">
                        {deal.promoCode && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                            <Tag className="w-3.5 h-3.5" />
                            <span>
                              {isBn ? 'কুপন কোড: ' : 'Coupon Code: '}
                              <strong className="font-mono bg-orange-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {deal.promoCode}
                              </strong>
                            </span>
                          </div>
                        )}
                        {deal.purchaseInstruction && (
                          <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                            {deal.purchaseInstruction}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Pricing Breakdown */}
                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800/60">
                      <div>
                        <span className="text-[11px] text-slate-400 line-through font-mono block whitespace-nowrap">
                          {isBn ? `৳${toBengaliNumber(deal.originalTotal.toLocaleString('en-US'))}` : `৳${deal.originalTotal.toLocaleString()}`}
                        </span>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
                          {isBn ? `৳${toBengaliNumber(deal.bundlePrice.toLocaleString('en-US'))}` : `৳${deal.bundlePrice.toLocaleString()}`}{' '}
                          <span className="text-xs text-orange-500">{isBn ? 'টাকা' : 'BDT'}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-block whitespace-nowrap">
                          {isBn ? `সাশ্রয় ৳${toBengaliNumber(deal.savings.toLocaleString('en-US'))}` : `Save ৳${deal.savings.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar with Actions */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span
                      className={`font-bold flex items-center gap-1.5 text-[11px] ${
                        deal.status === 'Active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : deal.status === 'Draft'
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {deal.status === 'Active'
                        ? isBn
                          ? 'স্টোরফ্রন্টে লাইভ'
                          : 'Live on Storefront'
                        : deal.status === 'Draft'
                        ? isBn
                          ? 'ড্রাফট (লুকানো)'
                          : 'Draft (Hidden)'
                        : isBn
                        ? 'মেয়াদোত্তীর্ণ'
                        : 'Expired'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* EDIT BUNDLE BUTTON - DEDICATED ROUTE */}
                      <Link
                        href={`/admin/bundles-loyalty/edit/${deal.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/20 transition-all cursor-pointer active:scale-95"
                        title="Edit Combo Bundle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'সম্পাদনা' : 'Edit Bundle'}</span>
                      </Link>

                      {/* DELETE BUNDLE BUTTON */}
                      <button
                        type="button"
                        onClick={async () => {
                          const isConfirmed = await showConfirmDialog({
                            title: isBn ? 'বান্ডেল অফার মুছবেন?' : 'Delete Combo Bundle?',
                            message: isBn
                              ? `আপনি কি "${deal.title}" বান্ডেলটি স্থায়ীভাবে মুছে ফেলতে চান?`
                              : `Are you sure you want to delete "${deal.title}"?`,
                            type: 'danger',
                            confirmText: isBn ? 'হ্যাঁ, মুছুন' : 'Delete',
                            cancelText: isBn ? 'বাতিল' : 'Cancel',
                          });
                          if (isConfirmed) {
                            deleteBundle(deal.id);
                          }
                        }}
                        className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Combo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                    <Award className="w-4 h-4" /> {isBn ? 'ব্রোঞ্জ শপার' : 'Bronze Shopper'}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {isBn ? 'এন্ট্রি লেভেল' : 'Entry Level'}
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {isBn ? '১x স্ট্যান্ডার্ড পয়েন্ট অর্জন' : '1x Standard Point Earning'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? '৳০ - ৳৫০,০০০ খরচ। প্রতি ৳১০০ খরচে ৫ পয়েন্ট (৫% ক্যাশব্যাক ক্রেডিট)।'
                    : 'Spend ৳0 - ৳50,000. Earns 5 points per ৳100 spent (5% cashback credit).'}
                </p>
              </div>

              {/* Silver */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-300" /> {isBn ? 'সিলভার মেম্বার' : 'Silver Enthusiast'}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-blue-500">
                    {isBn ? '১.২৫x পয়েন্ট' : '1.25x Points'}
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {isBn ? '১.২৫x পয়েন্ট ও আর্লি এক্সেস' : '1.25x Multiplier & Early Access'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? '৳৫০,০০০+ খরচ। প্রতি ৳১০০ খরচে ৬.২৫ পয়েন্ট ও এক্সক্লুসিভ ফ্ল্যাশ সেল এক্সেস।'
                    : 'Spend ৳50,000+. Unlocks 6.25 points per ৳100 and exclusive flash sale access.'}
                </p>
              </div>

              {/* Gold VIP */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" /> {isBn ? 'গোল্ড ভিআইপি এলিট' : 'Gold VIP Elite'}
                  </span>
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    {isBn ? '১.৫x + ফ্রি ডেলিভারি' : '1.5x + FREE SHIPPING'}
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {isBn ? '১.৫x পয়েন্ট ও ফ্রি এক্সপ্রেস ডেলিভারি' : '1.5x Multiplier & Free Express Delivery'}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isBn
                    ? '৳১,৫০,০০০+ খরচ। প্রতি ৳১০০ তে ৭.৫ পয়েন্ট, ফ্রি হোম ডেলিভারি ও ডেডিকেটেড সাপোর্ট।'
                    : 'Spend ৳150,000+. Unlocks 7.5 points per ৳100, lifetime free delivery, and dedicated WhatsApp support.'}
                </p>
              </div>
            </div>

            {/* Customer Points Ledger Table */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />{' '}
                    {isBn ? 'টপ কাস্টমার লয়্যালটি পয়েন্টস লেজার' : 'Top Customer Loyalty Points Ledger'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'কাস্টমারদের পয়েন্ট ব্যালেন্স ও ক্যাশব্যাক হিস্ট্রি দেখুন এবং প্রয়োজনে ম্যানুয়ালি পয়েন্ট এডজাস্ট করুন।'
                      : 'View customer point balances, cashback history, and adjust points manually when needed.'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">{isBn ? 'গ্রাহকের নাম ও ফোন' : 'Customer Name & Phone'}</th>
                      <th className="px-5 py-3.5">{isBn ? 'ভিআইপি টায়ার' : 'VIP Tier Badge'}</th>
                      <th className="px-5 py-3.5">{isBn ? 'সর্বমোট খরচ' : 'Lifetime Total Spent'}</th>
                      <th className="px-5 py-3.5">{isBn ? 'পয়েন্ট ব্যালেন্স (৳ ক্রেডিট)' : 'Points Balance (৳ Credit)'}</th>
                      <th className="px-5 py-3.5">{isBn ? 'সর্বশেষ ব্যবহার' : 'Last Redemption'}</th>
                      <th className="px-5 py-3.5 text-right">{isBn ? 'অ্যাকশন' : 'Points Action'}</th>
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
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {isBn ? `৳${toBengaliNumber(c.totalSpent.toLocaleString('en-US'))}` : `৳${c.totalSpent.toLocaleString()}`}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm whitespace-nowrap">
                            {isBn ? toBengaliNumber(c.points.toLocaleString('en-US')) : c.points.toLocaleString()} {isBn ? 'পয়েন্ট' : 'pts'}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">(= {isBn ? `৳${toBengaliNumber(c.points.toLocaleString('en-US'))}` : `৳${c.points}`} BDT)</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">{c.lastRedeemed}</td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustingCustomer(c);
                              setPointDelta('200');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-[11px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          >
                            <Sliders className="w-3 h-3 text-orange-500" />
                            <span>{isBn ? 'পয়েন্ট অ্যাডজাস্ট' : 'Adjust Points'}</span>
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

        {/* 🔢 ADJUST CUSTOMER POINTS MODAL */}
        {adjustingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />{' '}
                  {isBn
                    ? `পয়েন্ট সমন্বয়: ${adjustingCustomer.name}`
                    : `Adjust Points: ${adjustingCustomer.name}`}
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
                  <span className="text-slate-400">{isBn ? 'বর্তমান পয়েন্ট:' : 'Current Points:'}</span>
                  <span className="font-mono font-bold text-amber-600">
                    {isBn ? toBengaliNumber(adjustingCustomer.points) : adjustingCustomer.points} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isBn ? 'ভিআইপি টায়ার:' : 'VIP Tier:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{adjustingCustomer.tier}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <label className="block text-[11px] uppercase font-bold text-slate-500">
                  {isBn ? 'পয়েন্ট ক্রেডিট / ডেবিট (+ অথবা -):' : 'Points Credit / Debit (+ or -):'}
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
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSavePointsAdjustment}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white text-xs font-bold shadow-md shadow-orange-500/25"
                >
                  {isBn ? 'সমন্বয় প্রয়োগ করুন' : 'Apply Adjustment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
