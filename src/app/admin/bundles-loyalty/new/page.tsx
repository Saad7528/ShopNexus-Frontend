'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ALL_PRODUCTS } from '@/data/products';
import { IBundleItem, IBundleDeal } from '@/data/bundles';
import { useBundleStore } from '@/store/useBundleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import {
  Gift,
  Plus,
  ArrowLeft,
  Sparkles,
  Search,
  Check,
  Tag,
  Trash2,
  AlertCircle,
  Coins,
  Percent,
  CheckCircle2,
  Wand2,
  Package,
  Layers,
  ShoppingBag,
  Info,
} from 'lucide-react';

const BADGE_PRESETS = [
  '🔥 15% OFF BUNDLE',
  '⭐ POPULAR COMBO',
  '🎮 GAMER SPECIAL',
  '⚡ LIMITED TIME COMBO',
  '🎁 FESTIVE GIFT PACK',
  '👑 VIP EXCLUSIVE BUNDLE',
  '🔥 COMBO DISCOUNT',
];

export default function NewComboBundlePage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';
  const { addBundle } = useBundleStore();

  // Basic Details
  const [bundleTitle, setBundleTitle] = useState('');
  const [isAutoTitleEnabled, setIsAutoTitleEnabled] = useState(true);
  const [bundleBadge, setBundleBadge] = useState('🔥 15% OFF BUNDLE');
  const [customBadge, setCustomBadge] = useState('');
  const [bundleDescription, setBundleDescription] = useState(
    'বিশেষ প্যাকেজ অফার: একসাথে একাধিক প্রিমিয়াম গ্যাজেট কিনুন এবং আকর্ষণীয় ডিসকাউন্ট ও অতিরিক্ত রিওয়ার্ড পয়েন্ট উপভোগ করুন।'
  );
  const [bundlePromoCode, setBundlePromoCode] = useState('COMBO15');
  const [bundlePurchaseInstruction, setBundlePurchaseInstruction] = useState(
    'চেকআউটে অটো ডিসকাউন্ট প্রযোজ্য অথবা কুপন কোড ব্যবহার করে অর্ডার সম্পন্ন করুন।'
  );
  const [bundleStatus, setBundleStatus] = useState<'Active' | 'Draft' | 'Expired'>('Active');

  // Selected Products in Bundle (Initial: Empty array)
  const [selectedItems, setSelectedItems] = useState<IBundleItem[]>([]);

  // Product Catalog Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pricing & Discounts (Pure controlled strings to prevent 032 leading zero bug)
  const [discountPercentInput, setDiscountPercentInput] = useState('15');
  const [bundlePriceInput, setBundlePriceInput] = useState('');

  // Reward Points (Auto vs Custom)
  const [rewardPointsInput, setRewardPointsInput] = useState('');
  const [isCustomRewardPoints, setIsCustomRewardPoints] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(ALL_PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter available catalog
  const filteredCatalog = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Combined Regular Price (Sum of selected items)
  const combinedRegularPrice = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.regularPrice, 0);
  }, [selectedItems]);

  // Helper to generate concise title from selected items
  const generateTitleFromItems = (items: IBundleItem[]) => {
    if (items.length === 0) return '';
    const names = items.map((i) => {
      const words = i.title.split(' ');
      return words.slice(0, 3).join(' ');
    });
    return `${names.join(' + ')} Combo Suite`;
  };

  // Effective Bundle Price Number for calculation & submission
  const effectiveBundlePriceNum = useMemo(() => {
    if (bundlePriceInput !== '' && !isNaN(parseFloat(bundlePriceInput))) {
      return Math.max(0, Math.round(parseFloat(bundlePriceInput)));
    }
    const pct = parseFloat(discountPercentInput) || 0;
    return combinedRegularPrice > 0
      ? Math.max(0, Math.round(combinedRegularPrice * (1 - pct / 100)))
      : 0;
  }, [bundlePriceInput, discountPercentInput, combinedRegularPrice]);

  // Total Savings & Savings %
  const totalSavings = Math.max(0, combinedRegularPrice - effectiveBundlePriceNum);
  const actualDiscountPercent =
    combinedRegularPrice > 0 ? Math.round((totalSavings / combinedRegularPrice) * 100) : 0;

  // Auto Reward Points (10 pts per ৳100)
  const autoRewardPoints = useMemo(() => {
    return Math.max(0, Math.round(effectiveBundlePriceNum / 100) * 10);
  }, [effectiveBundlePriceNum]);

  // Effective Reward Points (Custom or Auto)
  const effectiveRewardPoints = useMemo(() => {
    if (isCustomRewardPoints && rewardPointsInput !== '' && !isNaN(parseInt(rewardPointsInput))) {
      return Math.max(0, parseInt(rewardPointsInput));
    }
    return autoRewardPoints;
  }, [isCustomRewardPoints, rewardPointsInput, autoRewardPoints]);

  // Add a product to the bundle
  const handleAddItem = (prod: (typeof ALL_PRODUCTS)[0]) => {
    const isAlreadyAdded = selectedItems.some((it) => it.id === prod._id);
    if (isAlreadyAdded) {
      showToast(
        isBn
          ? '⚠️ এই প্রোডাক্টটি ইতোমধ্যে কম্বোতে যুক্ত আছে!'
          : '⚠️ This product is already added to the bundle!'
      );
      return;
    }

    const newItem: IBundleItem = {
      id: prod._id,
      title: prod.title,
      image: prod.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      regularPrice: prod.discountPrice || prod.price,
      category: prod.category,
    };

    const nextItems = [...selectedItems, newItem];
    setSelectedItems(nextItems);

    const nextCombined = nextItems.reduce((acc, it) => acc + it.regularPrice, 0);
    const pct = parseFloat(discountPercentInput) || 15;
    const nextPrice = Math.max(0, Math.round(nextCombined * (1 - pct / 100)));
    setBundlePriceInput(nextPrice > 0 ? nextPrice.toString() : '');

    if (isAutoTitleEnabled) {
      setBundleTitle(generateTitleFromItems(nextItems));
    }
  };

  // Remove a product from the bundle
  const handleRemoveItem = (index: number) => {
    const nextItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(nextItems);

    const nextCombined = nextItems.reduce((acc, it) => acc + it.regularPrice, 0);
    if (nextCombined === 0) {
      setBundlePriceInput('');
    } else {
      const pct = parseFloat(discountPercentInput) || 15;
      const nextPrice = Math.max(0, Math.round(nextCombined * (1 - pct / 100)));
      setBundlePriceInput(nextPrice > 0 ? nextPrice.toString() : '');
    }

    if (isAutoTitleEnabled) {
      setBundleTitle(generateTitleFromItems(nextItems));
    }
  };

  // Handle Preset Discount Click
  const handleApplyPresetDiscount = (pct: number) => {
    setDiscountPercentInput(pct.toString());
    if (combinedRegularPrice > 0) {
      const nextPrice = Math.max(0, Math.round(combinedRegularPrice * (1 - pct / 100)));
      setBundlePriceInput(nextPrice.toString());
    } else {
      setBundlePriceInput('');
    }
    setBundleBadge(`🔥 ${pct}% OFF BUNDLE`);
  };

  // Handle Custom % Change
  const handleCustomPercentChange = (val: string) => {
    setDiscountPercentInput(val);
    const pct = parseFloat(val);
    if (!isNaN(pct) && combinedRegularPrice > 0) {
      const nextPrice = Math.max(0, Math.round(combinedRegularPrice * (1 - pct / 100)));
      setBundlePriceInput(nextPrice.toString());
    }
  };

  // Handle Direct Bundle Price Change
  const handleBundlePriceChange = (val: string) => {
    setBundlePriceInput(val);
    if (val === '') {
      setDiscountPercentInput('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && combinedRegularPrice > 0) {
      const pct = Math.max(0, Math.round(((combinedRegularPrice - num) / combinedRegularPrice) * 100));
      setDiscountPercentInput(pct.toString());
    }
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bundleTitle.trim()) {
      showToast(
        isBn
          ? '❌ অনুগ্রহ করে কম্বো বান্ডেলের নাম প্রদান করুন!'
          : '❌ Please enter a combo bundle title!'
      );
      return;
    }

    if (selectedItems.length === 0) {
      showToast(
        isBn
          ? '❌ বান্ডেলে অন্তত ১টি বা একাধিক প্রোডাক্ট যোগ করুন!'
          : '❌ Please add at least 1 product to the bundle!'
      );
      return;
    }

    setIsSubmitting(true);

    const activeBadge = customBadge.trim() ? customBadge.trim() : bundleBadge;

    const newBundle: IBundleDeal = {
      id: `b-${Date.now()}`,
      title: bundleTitle.trim(),
      badge: activeBadge,
      description: bundleDescription.trim(),
      promoCode: bundlePromoCode.trim().toUpperCase(),
      purchaseInstruction: bundlePurchaseInstruction.trim(),
      items: selectedItems,
      originalTotal: combinedRegularPrice,
      bundlePrice: effectiveBundlePriceNum,
      savings: totalSavings,
      rewardPoints: effectiveRewardPoints,
      status: bundleStatus,
      salesCount: 0,
    };

    addBundle(newBundle);

    showToast(
      isBn
        ? '✅ নতুন কম্বো বান্ডেল সফলভাবে তৈরি হয়েছে!'
        : '✅ Combo bundle created successfully!'
    );
    setTimeout(() => {
      router.push('/admin/bundles-loyalty');
    }, 600);
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-2xl border border-slate-700/50 dark:border-slate-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <Link
              href="/admin/bundles-loyalty"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm"
              title={isBn ? 'বান্ডেল তালিকায় ফিরে যান' : 'Back to Bundles & Loyalty'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Gift className="w-3 h-3" /> {isBn ? 'বান্ডেল আর্কিটেক্ট' : 'Bundle Architect'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isBn ? 'নতুন কম্বো বান্ডেল তৈরি করুন' : 'Create New Combo Bundle'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'প্রোডাক্ট নির্বাচন করুন, আকর্ষনীয় কম্বো ডিসকাউন্ট ও কুপন কোড সেট করে লাইভ করুন।'
                  : 'Select products, configure combo discounts, coupon codes, and publish.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/bundles-loyalty"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors shadow-sm"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? isBn
                    ? 'প্রকাশিত হচ্ছে...'
                    : 'Publishing Deal...'
                  : isBn
                  ? 'কম্বো বান্ডেল প্রকাশ করুন'
                  : 'Publish Combo Bundle'}
              </span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT MAIN CONTENT (~65% / 8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Combo Title & Auto-Generator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-orange-500" /> {isBn ? 'কম্বো বান্ডেলের নাম *' : 'Combo Bundle Title *'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = generateTitleFromItems(selectedItems);
                    if (generated) setBundleTitle(generated);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{isBn ? 'প্রোডাক্ট থেকে অটো-নাম তৈরি করুন' : 'Auto-Generate from Products'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={bundleTitle}
                  onChange={(e) => {
                    setBundleTitle(e.target.value);
                    setIsAutoTitleEnabled(false);
                  }}
                  placeholder={isBn ? 'যেমন: আল্টিমেট অডিওফাইল মাস্টার কম্বো' : 'e.g. Ultimate Audiophile Master Combo'}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>
                  {isBn
                    ? 'গ্রাহকরা স্টোরফ্রন্টে এবং কম্বো সেকশনে এই নামটি দেখতে পাবেন।'
                    : 'Customers will see this title on the storefront and bundle offer sections.'}
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isAutoTitleEnabled}
                    onChange={(e) => setIsAutoTitleEnabled(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>{isBn ? 'প্রোডাক্ট পরিবর্তনে অটো-টাইটেল সিঙ্ক' : 'Sync title when products change'}</span>
                </label>
              </div>
            </div>

            {/* 2. Included Products & Catalog Picker */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />{' '}
                    {isBn
                      ? `এই বান্ডেলে অন্তর্ভুক্ত প্রোডাক্টসমূহ (${selectedItems.length})`
                      : `Products Included in this Bundle (${selectedItems.length})`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'কম্বোতে অন্তর্ভুক্ত প্রোডাক্টগুলো নির্বাচন করুন ও সাজান।'
                      : 'Select and organize products included in this bundle.'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-black text-xs">
                  {isBn ? `${selectedItems.length} টি প্রোডাক্ট নির্বাচিত` : `${selectedItems.length} Products Selected`}
                </span>
              </div>

              {/* Selected Items List */}
              {selectedItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isBn ? 'কোনো প্রোডাক্ট এখনও যোগ করা হয়নি' : 'No products added yet'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isBn
                      ? 'নিচের স্টোর ক্যাটালগ থেকে প্রোডাক্টের পাশে থাকা “+ Add” বাটনে ক্লিক করে যুক্ত করুন।'
                      : 'Click the "+ Add" button next to any product from the catalog below to add it.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shrink-0 overflow-hidden relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-contain p-0.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.category || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pl-2">
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white whitespace-nowrap">
                          {isBn ? `৳${toBengaliNumber(item.regularPrice.toLocaleString('en-US'))}` : `৳${item.regularPrice.toLocaleString()}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove from bundle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Product Catalog Browser */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-500" /> {isBn ? 'স্টোর ক্যাটালগ থেকে প্রোডাক্ট নির্বাচন করুন' : 'Select Products from Store Catalog'}
                  </h4>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">
                    {isBn ? `${toBengaliNumber(filteredCatalog.length)} টি প্রোডাক্ট উপলব্ধ` : `${filteredCatalog.length} available products`}
                  </span>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isBn ? 'নাম বা ব্র্যান্ড দিয়ে সার্চ করুন...' : 'Search products by name or brand...'}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scrollable Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {filteredCatalog.map((prod) => {
                    const isAdded = selectedItems.some((it) => it.id === prod._id);
                    return (
                      <div
                        key={prod._id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isAdded
                            ? 'bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/40'
                            : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shrink-0 overflow-hidden relative">
                            <Image
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'}
                              alt={prod.title}
                              fill
                              sizes="40px"
                              className="object-contain p-0.5"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {prod.title}
                            </h5>
                            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {isBn ? `৳${toBengaliNumber((prod.discountPrice || prod.price).toLocaleString('en-US'))}` : `৳${(prod.discountPrice || prod.price).toLocaleString()}`}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              const idx = selectedItems.findIndex((it) => it.id === prod._id);
                              if (idx !== -1) handleRemoveItem(idx);
                            } else {
                              handleAddItem(prod);
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            isAdded
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Description & Marketing Copy */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-orange-500" /> Combo Description & Value Pitch
              </label>

              <textarea
                value={bundleDescription}
                onChange={(e) => setBundleDescription(e.target.value)}
                rows={3}
                placeholder="Describe why buying these products together is the best choice..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 4. Checkout & Promo Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-orange-500" /> Promo Code & Purchase Instructions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Promotional Voucher Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={bundlePromoCode}
                    onChange={(e) => setBundlePromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AUDIOPRO15"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    {isBn ? 'গ্রাহক ক্রয়ের নির্দেশিকা' : 'Customer Purchase Instruction'}
                  </label>
                  <input
                    type="text"
                    value={bundlePurchaseInstruction}
                    onChange={(e) => setBundlePurchaseInstruction(e.target.value)}
                    placeholder={
                      isBn
                        ? 'যেমন: চেকআউটে অটো ডিসকাউন্ট প্রযোজ্য'
                        : 'e.g. Auto discount applied at checkout'
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR (~35% / 4 cols) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Status & Visibility Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {isBn ? 'প্রকাশনার স্থিতি' : 'Publishing Status'}
              </h3>

              <div className="grid grid-cols-3 gap-2">
                {(['Active', 'Draft', 'Expired'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBundleStatus(st)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      bundleStatus === st
                        ? st === 'Active'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                          : st === 'Draft'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400'
                          : 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {st === 'Active'
                      ? isBn
                        ? 'সক্রিয়'
                        : 'Active'
                      : st === 'Draft'
                      ? isBn
                        ? 'ড্রাফট'
                        : 'Draft'
                      : isBn
                      ? 'মেয়াদোত্তীর্ণ'
                      : 'Expired'}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-500">
                {bundleStatus === 'Active'
                  ? isBn
                    ? '🟢 Active: স্টোরফ্রন্ট এবং কম্বো বান্ডেল অফার পেজে লাইভ থাকবে।'
                    : '🟢 Active: Live and visible on storefront & combo pages.'
                  : bundleStatus === 'Draft'
                  ? isBn
                    ? '🟡 Draft: সেভ থাকবে কিন্তু কাস্টমারদের কাছে দৃশ্যমান হবে না।'
                    : '🟡 Draft: Saved internally but hidden from customers.'
                  : isBn
                  ? '🔴 Expired: অফারের মেয়াদ শেষ বলে প্রদর্শিত হবে।'
                  : '🔴 Expired: Displayed as expired or archived.'}
              </p>
            </div>

            {/* Promotional Badge Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />{' '}
                {isBn ? 'প্রমোশনাল ব্যাজ' : 'Promotional Badge'}
              </label>

              {/* Preset Badges */}
              <div className="flex flex-wrap gap-2">
                {BADGE_PRESETS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => {
                      setBundleBadge(badge);
                      setCustomBadge('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      bundleBadge === badge && !customBadge
                        ? 'bg-orange-500/15 border-orange-500 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>

              {/* Custom Badge Input */}
              <div className="pt-2">
                <input
                  type="text"
                  value={customBadge}
                  onChange={(e) => setCustomBadge(e.target.value)}
                  placeholder={
                    isBn
                      ? 'বা কাস্টম ব্যাজ লিখুন (যেমন: ⚡ মেগা ডিল)...'
                      : 'Or type custom badge (e.g. ⚡ MEGA DEAL)...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>

            {/* Pricing & Discount Architecture Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Percent className="w-3.5 h-3.5 text-orange-500" />{' '}
                {isBn ? 'মূল্য ও ডিসকাউন্ট হিসাব' : 'Pricing & Discount Breakdown'}
              </h3>

              {/* Combined Regular Sum */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isBn ? 'নিয়মিত মোট মূল্য' : 'Combined Regular Total'}
                  </span>
                  <span className="font-mono font-black text-slate-500 dark:text-slate-400 line-through text-sm whitespace-nowrap">
                    {isBn ? `৳${toBengaliNumber(combinedRegularPrice.toLocaleString('en-US'))}` : `৳${combinedRegularPrice.toLocaleString()}`} {isBn ? 'টাকা' : 'BDT'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  {isBn ? toBengaliNumber(selectedItems.length) : selectedItems.length} {isBn ? 'টি প্রোডাক্ট' : 'Products'}
                </span>
              </div>

              {/* Discount Inputs & Quick Presets */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'ডিসকাউন্ট শতাংশ (%) নির্ধারণ করুন' : 'Select or Enter Discount Percentage (%)'}
                </label>

                {/* Quick Presets */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPresetDiscount(pct)}
                      className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                        discountPercentInput === pct.toString()
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-500/40'
                      }`}
                    >
                      {isBn ? `${toBengaliNumber(pct)}%` : `${pct}%`}
                    </button>
                  ))}
                </div>

                {/* Custom % Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                    {isBn ? 'কাস্টম %' : 'Custom %'}
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={discountPercentInput}
                    onChange={(e) => handleCustomPercentChange(e.target.value)}
                    placeholder="e.g. 7.5 or 18"
                    className="w-full pl-24 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              </div>

              {/* Bundle Offer Price (৳) - Clean controlled string without leading 0 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'বান্ডেল অফার মূল্য (৳)' : 'Bundle Offer Price (৳)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-orange-500">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={bundlePriceInput}
                    onChange={(e) => handleBundlePriceChange(e.target.value)}
                    placeholder={
                      combinedRegularPrice > 0
                        ? isBn
                          ? 'অফার মূল্য লিখুন...'
                          : 'Enter offer price...'
                        : '0'
                    }
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-black text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              </div>

              {/* Customizable Reward Points Input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />{' '}
                    {isBn ? 'রিওয়ার্ড পয়েন্টস / নেক্সাস কয়েন' : 'Reward Points / Nexus Coins'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomRewardPoints(false);
                      setRewardPointsInput(autoRewardPoints.toString());
                    }}
                    className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> {isBn ? 'অটো (৳১০০ = ১০ পয়েন্ট)' : 'Auto (৳100 = 10 pts)'}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-amber-500">
                    🪙
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={
                      isCustomRewardPoints
                        ? rewardPointsInput
                        : rewardPointsInput !== ''
                        ? rewardPointsInput
                        : autoRewardPoints > 0
                        ? autoRewardPoints
                        : ''
                    }
                    onChange={(e) => {
                      setIsCustomRewardPoints(true);
                      setRewardPointsInput(e.target.value);
                    }}
                    placeholder={autoRewardPoints > 0 ? autoRewardPoints.toString() : '0'}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  {isCustomRewardPoints
                    ? isBn
                      ? '✏️ কাস্টম রিওয়ার্ড পয়েন্ট সেট করা আছে।'
                      : '✏️ Custom reward points set manually.'
                    : isBn
                    ? '⚡ অটো-ক্যালকুলেশন সক্রিয় (মার্জিন কম হলে ইচ্ছেমতো পয়েন্ট বসাতে পারবেন)।'
                    : '⚡ Auto-calculation active (10 pts per ৳100 spent).'}
                </p>
              </div>

              {/* Customer Value & Savings Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />{' '}
                    {isBn ? 'কাস্টমারের মোট সাশ্রয়:' : 'Customer Total Savings:'}
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                    {isBn ? `৳${toBengaliNumber(totalSavings.toLocaleString('en-US'))} (${toBengaliNumber(actualDiscountPercent)}% ছাড়)` : `৳${totalSavings.toLocaleString()} (${actualDiscountPercent}% OFF)`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />{' '}
                    {isBn ? 'অর্জিত রিওয়ার্ড পয়েন্টস:' : 'Reward Points Earned:'}
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    +{isBn ? toBengaliNumber(effectiveRewardPoints) : effectiveRewardPoints} {isBn ? 'পয়েন্ট' : 'Points'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-black text-xs shadow-xl shadow-orange-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? isBn
                    ? 'বান্ডেল সেভ হচ্ছে...'
                    : 'Saving Bundle Deal...'
                  : isBn
                  ? 'কম্বো বান্ডেল প্রকাশ করুন'
                  : 'Publish Combo Bundle'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
