'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ALL_PRODUCTS } from '@/data/products';
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
  Tag,
  Package,
  FileText,
  AlertCircle,
  HelpCircle,
  Clock,
  Eye,
  Info,
  ChevronDown,
} from 'lucide-react';

interface IBundleItem {
  id?: string;
  title: string;
  image: string;
  regularPrice: number;
  category?: string;
}

interface IBundleDeal {
  id: string;
  title: string;
  badge: string;
  description?: string;
  promoCode?: string;
  purchaseInstruction?: string;
  items: IBundleItem[];
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
    description: 'হাই-ফাই মিউজিক ও নয়েজ ক্যান্সেলেশনের সেরা কম্বিনেশন। একসাথে কিনলে ১০,৭১০ টাকা সাশ্রয়!',
    promoCode: 'AUDIOPRO15',
    purchaseInstruction: 'চেকআউটে অটো ডিসকাউন্ট প্রযোজ্য অথবা কোড AUDIOPRO15 ব্যবহার করুন',
    items: [
      {
        id: 'p1',
        title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        regularPrice: 32500,
        category: 'Audio',
      },
      {
        id: 'p2',
        title: 'Bose QuietComfort Ultra Spatial Audio Headphones',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        regularPrice: 38900,
        category: 'Audio',
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
    description: 'স্মার্ট লাইফস্টাইল ও প্রোডাক্টিভিটি বুস্ট করার জন্য প্রিমিয়াম স্মার্টওয়াচ এবং মেকানিক্যাল কিবোর্ড।',
    promoCode: 'CREATORVIP',
    purchaseInstruction: 'এক ক্লিকে কম্বো অর্ডার করুন এবং ফ্রি ডেলিভারি উপভোগ করুন',
    items: [
      {
        id: 'p-smartwatch',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        regularPrice: 79900,
        category: 'Wearables',
      },
      {
        id: 'p-keychron',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
        category: 'Gaming',
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
    description: 'আল্ট্রা-লাইটওয়েট ওয়্যারলেস গেমিং মাউস ও মেকানিক্যাল কাস্টম কিবোর্ড কম্বো।',
    promoCode: 'ESPORTS10',
    purchaseInstruction: 'গেমিং বান্ডেল ডিসকাউন্টের সাথে পাবেন ৩ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি',
    items: [
      {
        id: 'p-mouse',
        title: 'Razer Viper V2 Pro Ultra-Lightweight',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        regularPrice: 11900,
        category: 'Gaming',
      },
      {
        id: 'p-keychron',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
        category: 'Gaming',
      },
    ],
    originalTotal: 29800,
    bundlePrice: 25500,
    savings: 4300,
    status: 'Active',
    salesCount: 64,
  },
];

const BADGE_PRESETS = [
  '🔥 15% OFF BUNDLE',
  '⭐ POPULAR COMBO',
  '🎮 GAMER SPECIAL',
  '⚡ LIMITED TIME COMBO',
  '🎁 FESTIVE GIFT PACK',
  '👑 VIP EXCLUSIVE BUNDLE',
  '🔥 COMBO DISCOUNT',
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
  
  // Create / Edit Bundle Modal State
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
  
  // Bundle Form Fields
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleBadge, setBundleBadge] = useState('🔥 15% OFF BUNDLE');
  const [bundleDescription, setBundleDescription] = useState('');
  const [bundlePromoCode, setBundlePromoCode] = useState('');
  const [bundlePurchaseInstruction, setBundlePurchaseInstruction] = useState('');
  const [bundleStatus, setBundleStatus] = useState<'Active' | 'Draft' | 'Expired'>('Active');
  const [selectedItems, setSelectedItems] = useState<IBundleItem[]>([]);
  const [originalTotalInput, setOriginalTotalInput] = useState<string>('0');
  const [bundlePriceInput, setBundlePriceInput] = useState<string>('0');
  
  // Product Search inside Bundle Modal
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showProductPicker, setShowProductPicker] = useState(false);

  // Customer Points Adjustment Modal
  const [adjustingCustomer, setAdjustingCustomer] = useState<ICustomerLoyalty | null>(null);
  const [pointDelta, setPointDelta] = useState('200');

  // Categories list for product picker
  const categories = useMemo(() => {
    const cats = new Set(ALL_PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered available products for picker
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((prod) => {
      const matchSearch =
        !productSearchQuery ||
        prod.title.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(productSearchQuery.toLowerCase());
      const matchCat =
        selectedCategoryFilter === 'All' || prod.category === selectedCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [productSearchQuery, selectedCategoryFilter]);

  // Open modal in CREATE mode
  const handleOpenCreateModal = () => {
    setEditingBundleId(null);
    setBundleTitle('');
    setBundleBadge('🔥 15% OFF BUNDLE');
    setBundleDescription('');
    setBundlePromoCode('');
    setBundlePurchaseInstruction('চেকআউটে অটো ডিসকাউন্ট প্রযোজ্য অথবা কোড ব্যবহার করে কিনুন');
    setBundleStatus('Active');
    
    // Default with first 2 products from catalog as a starter
    const starterItems: IBundleItem[] = ALL_PRODUCTS.slice(0, 2).map((p) => ({
      id: p._id,
      title: p.title,
      image: p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      regularPrice: p.discountPrice || p.price,
      category: p.category,
    }));
    
    setSelectedItems(starterItems);
    const sum = starterItems.reduce((acc, it) => acc + it.regularPrice, 0);
    setOriginalTotalInput(sum.toString());
    setBundlePriceInput(Math.round(sum * 0.85).toString()); // 15% off by default
    setShowProductPicker(false);
    setIsBundleModalOpen(true);
  };

  // Open modal in EDIT mode
  const handleOpenEditModal = (bundle: IBundleDeal) => {
    setEditingBundleId(bundle.id);
    setBundleTitle(bundle.title);
    setBundleBadge(bundle.badge);
    setBundleDescription(bundle.description || '');
    setBundlePromoCode(bundle.promoCode || '');
    setBundlePurchaseInstruction(bundle.purchaseInstruction || '');
    setBundleStatus(bundle.status);
    setSelectedItems([...bundle.items]);
    setOriginalTotalInput(bundle.originalTotal.toString());
    setBundlePriceInput(bundle.bundlePrice.toString());
    setShowProductPicker(false);
    setIsBundleModalOpen(true);
  };

  // Add a product from catalog to the bundle
  const handleAddProductToBundle = (product: (typeof ALL_PRODUCTS)[0]) => {
    const newItem: IBundleItem = {
      id: product._id,
      title: product.title,
      image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      regularPrice: product.discountPrice || product.price,
      category: product.category,
    };

    const updated = [...selectedItems, newItem];
    setSelectedItems(updated);

    // Recalculate original total sum
    const newSum = updated.reduce((acc, it) => acc + it.regularPrice, 0);
    setOriginalTotalInput(newSum.toString());
    
    // Auto-update combo price with current discount % or 15% discount
    const currentOrig = parseInt(originalTotalInput) || 1;
    const currentBund = parseInt(bundlePriceInput) || 1;
    const currentRatio = currentBund < currentOrig ? currentBund / currentOrig : 0.85;
    setBundlePriceInput(Math.round(newSum * currentRatio).toString());
  };

  // Remove a product from the bundle
  const handleRemoveProductFromBundle = (index: number) => {
    const updated = selectedItems.filter((_, idx) => idx !== index);
    setSelectedItems(updated);

    const newSum = updated.reduce((acc, it) => acc + it.regularPrice, 0);
    setOriginalTotalInput(newSum.toString());
    
    const currentOrig = parseInt(originalTotalInput) || 1;
    const currentBund = parseInt(bundlePriceInput) || 1;
    const currentRatio = currentBund < currentOrig ? currentBund / currentOrig : 0.85;
    setBundlePriceInput(Math.round(newSum * currentRatio).toString());
  };

  // Apply quick discount percentage
  const handleApplyQuickDiscount = (percentage: number) => {
    const orig = parseInt(originalTotalInput) || 0;
    const discounted = Math.round(orig * (1 - percentage / 100));
    setBundlePriceInput(discounted.toString());
    setBundleBadge(`🔥 ${percentage}% OFF BUNDLE`);
  };

  // Save (Create or Update) Bundle
  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleTitle.trim()) return;

    const orig = parseInt(originalTotalInput) || 0;
    const bund = parseInt(bundlePriceInput) || 0;
    const savings = Math.max(0, orig - bund);

    if (editingBundleId) {
      // Update existing bundle
      setBundles((prev) =>
        prev.map((b) =>
          b.id === editingBundleId
            ? {
                ...b,
                title: bundleTitle,
                badge: bundleBadge,
                description: bundleDescription,
                promoCode: bundlePromoCode.toUpperCase(),
                purchaseInstruction: bundlePurchaseInstruction,
                items: selectedItems.length > 0 ? selectedItems : b.items,
                originalTotal: orig,
                bundlePrice: bund,
                savings: savings,
                status: bundleStatus,
              }
            : b
        )
      );
    } else {
      // Create new bundle
      const newDeal: IBundleDeal = {
        id: `b-${Date.now()}`,
        title: bundleTitle,
        badge: bundleBadge,
        description: bundleDescription,
        promoCode: bundlePromoCode.toUpperCase(),
        purchaseInstruction: bundlePurchaseInstruction,
        items: selectedItems.length > 0 ? selectedItems : [
          {
            id: 'item-1',
            title: 'Sample Product 1',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            regularPrice: orig / 2,
          },
        ],
        originalTotal: orig,
        bundlePrice: bund,
        savings: savings,
        status: bundleStatus,
        salesCount: 0,
      };

      setBundles((prev) => [newDeal, ...prev]);
    }

    setIsBundleModalOpen(false);
  };

  // Customer points adjustment
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

  const calculatedSavings = Math.max(0, (parseInt(originalTotalInput) || 0) - (parseInt(bundlePriceInput) || 0));
  const calculatedSavingsPercent =
    parseInt(originalTotalInput) > 0
      ? Math.round((calculatedSavings / parseInt(originalTotalInput)) * 100)
      : 0;

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
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
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
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {deal.salesCount} Combos Sold
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                        {deal.title}
                      </h3>
                      {deal.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {deal.description}
                        </p>
                      )}
                    </div>

                    {/* Included Products Visual Grid */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                        <span>Included Items ({deal.items.length})</span>
                        <span>Individual Price</span>
                      </div>
                      <div className="space-y-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/60 max-h-48 overflow-y-auto">
                        {deal.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-800">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
                              ৳{item.regularPrice.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code & Instructions Box (if set) */}
                    {(deal.promoCode || deal.purchaseInstruction) && (
                      <div className="p-2.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-[11px] space-y-1">
                        {deal.promoCode && (
                          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Coupon Code: <strong className="font-mono bg-orange-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">{deal.promoCode}</strong></span>
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
                        <span className="text-[11px] text-slate-400 line-through font-mono block">
                          ৳{deal.originalTotal.toLocaleString()}
                        </span>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          ৳{deal.bundlePrice.toLocaleString()} <span className="text-xs text-orange-500">BDT</span>
                        </div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-block">
                          Save ৳{deal.savings.toLocaleString()}
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
                        ? 'Live on Storefront'
                        : deal.status === 'Draft'
                        ? 'Draft (Hidden)'
                        : 'Expired'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* EDIT BUNDLE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(deal)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/20 transition-all cursor-pointer active:scale-95"
                        title="Edit Combo Bundle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Bundle</span>
                      </button>

                      {/* DELETE BUNDLE BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${deal.title}"?`)) {
                            setBundles((prev) => prev.filter((b) => b.id !== deal.id));
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

        {/* ➕ / ✏️ CREATE & EDIT COMBO BUNDLE MODAL */}
        {isBundleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {editingBundleId ? 'Edit Combo Bundle Deal' : 'Create Combo Bundle Deal'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      প্রোডাক্ট নির্বাচন করুন, টাইটেল, মূল্য, কুপন কোড ও ক্রয়ের বিস্তারিত নির্দেশাবলী সেট করুন।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBundleModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBundle} className="space-y-6 text-xs">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 1. Bundle Basic Information
                  </h4>

                  {/* Bundle Title */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Bundle Title (কম্বো প্যাকেজের নাম) <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master ANC Audio & Keyboard Combo"
                      value={bundleTitle}
                      onChange={(e) => setBundleTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none font-bold text-sm"
                    />
                  </div>

                  {/* Promo Badge & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Promo Badge Label:
                      </label>
                      <input
                        type="text"
                        value={bundleBadge}
                        onChange={(e) => setBundleBadge(e.target.value)}
                        placeholder="e.g. 🔥 15% OFF BUNDLE"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold focus:border-orange-500 focus:outline-none"
                      />
                      {/* Badge Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {BADGE_PRESETS.slice(0, 4).map((badge) => (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => setBundleBadge(badge)}
                            className="px-2 py-0.5 text-[10px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Bundle Status:
                      </label>
                      <select
                        value={bundleStatus}
                        onChange={(e) => setBundleStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:border-orange-500 focus:outline-none"
                      >
                        <option value="Active">🟢 Active (Live on Storefront)</option>
                        <option value="Draft">🟡 Draft (Hidden)</option>
                        <option value="Expired">🔴 Expired</option>
                      </select>
                    </div>
                  </div>

                  {/* Bundle Description */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Bundle Details / Description (প্যাকেজের বিবরণ):
                    </label>
                    <textarea
                      rows={2}
                      value={bundleDescription}
                      onChange={(e) => setBundleDescription(e.target.value)}
                      placeholder="এই কম্বো প্যাকেজে কী কী বিশেষ সুবিধা এবং অফার রয়েছে তা লিখুন..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Promo Code & Purchase Instructions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Promo / Coupon Code (ঐচ্ছিক):
                      </label>
                      <div className="relative">
                        <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={bundlePromoCode}
                          onChange={(e) => setBundlePromoCode(e.target.value)}
                          placeholder="e.g. COMBO15 or AUDIOPRO"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white uppercase font-mono font-bold focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Purchase Instructions / Terms:
                      </label>
                      <input
                        type="text"
                        value={bundlePurchaseInstruction}
                        onChange={(e) => setBundlePurchaseInstruction(e.target.value)}
                        placeholder="e.g. এক ক্লিকে কম্বো অর্ডার করুন অথবা চেকআউটে কোড দিন"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Products Selector & Manager */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> 2. Selected Products in Bundle ({selectedItems.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowProductPicker(!showProductPicker)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/30 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showProductPicker ? 'Close Catalog Picker' : 'Add Products from Store'}</span>
                    </button>
                  </div>

                  {/* Product Picker Drawer/Dropdown */}
                  {showProductPicker && (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={productSearchQuery}
                            onChange={(e) => setProductSearchQuery(e.target.value)}
                            placeholder="Search store products by name or brand..."
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Catalog List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                        {filteredProducts.map((p) => {
                          const isAlreadySelected = selectedItems.some((it) => it.id === p._id);
                          return (
                            <div
                              key={p._id}
                              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-orange-500/40 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                                  <Image
                                    src={p.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'}
                                    alt={p.title}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                                    {p.title}
                                  </div>
                                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                    ৳{(p.discountPrice || p.price).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddProductToBundle(p)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                                  isAlreadySelected
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                                }`}
                              >
                                {isAlreadySelected ? '+ Add More' : '+ Add'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Items List */}
                  {selectedItems.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-center space-y-1">
                      <AlertCircle className="w-5 h-5 mx-auto" />
                      <p className="font-bold">No products added yet</p>
                      <p className="text-[10px]">কম্বো বান্ডেল তৈরি করতে উপরের বাটন দিয়ে ১ বা একাধিক প্রোডাক্ট যুক্ত করুন।</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                              {idx + 1}
                            </span>
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-800">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {item.title}
                              </div>
                              <span className="text-[10px] text-slate-400">{item.category || 'Store Product'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              ৳{item.regularPrice.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProductFromBundle(idx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Remove item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Pricing & Savings Calculator */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" /> 3. Pricing & Bundle Discount Calculator
                  </h4>

                  {/* Quick Discount Presets */}
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">
                      Quick Discount Presets (স্বয়ংক্রিয় ডিসকাউন্ট বসান):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[10, 15, 20, 25, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyQuickDiscount(pct)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-xs transition-all"
                        >
                          {pct}% OFF
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Combined Regular Price (৳) (মূল দামের যোগফল):
                      </label>
                      <input
                        type="number"
                        value={originalTotalInput}
                        onChange={(e) => setOriginalTotalInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                        Special Combo Price (৳) (বিশেষ বান্ডেল অফার মূল্য):
                      </label>
                      <input
                        type="number"
                        value={bundlePriceInput}
                        onChange={(e) => setBundlePriceInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Savings Calculation Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                        Customer Savings (কাস্টমার সাশ্রয় করবেন):
                      </span>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        ৳{calculatedSavings.toLocaleString()} BDT ({calculatedSavingsPercent}% OFF)
                      </div>
                    </div>
                    <span className="text-xs font-black bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-sm">
                      {calculatedSavingsPercent}% Savings
                    </span>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsBundleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingBundleId ? 'Save Changes' : 'Publish Combo Bundle'}</span>
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
