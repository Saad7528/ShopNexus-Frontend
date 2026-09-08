'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  Copy,
  CheckCircle2,
  X,
  Send,
  RefreshCw,
  Tag,
  Flame,
  User,
  Filter,
  AlertCircle,
  Check,
  ChevronDown,
  Percent,
  Banknote,
  Truck,
  Sliders,
} from 'lucide-react';

interface IAbandonedItem {
  id: string;
  title: string;
  image: string;
  variant?: string;
  price: number;
  quantity: number;
}

interface IAbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: IAbandonedItem[];
  cartTotal: number;
  timeAgo: string;
  status: 'Uncontacted' | 'WhatsApp Sent' | 'Discount Emailed' | 'Recovered';
  recoveryDiscountCode?: string;
  updatedAt?: string;
}

import { useVisitorAnalyticsStore } from '@/store/useVisitorAnalyticsStore';

const DEMO_ABANDONED_CARTS: IAbandonedCart[] = [
  {
    id: 'demo_cart_1',
    customerName: 'Tanvir Ahmed (Active Member)',
    customerPhone: '+880 1712-884910',
    customerEmail: 'tanvir.ahmed@gmail.com',
    items: [
      {
        id: 'p1',
        title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        price: 32500,
        quantity: 1,
      },
    ],
    cartTotal: 34125,
    timeAgo: '12m ago',
    status: 'Uncontacted',
    recoveryDiscountCode: '',
  },
  {
    id: 'demo_cart_2',
    customerName: 'Sadia Rahman (Cart Value ৳84k)',
    customerPhone: '+880 1819-445566',
    customerEmail: 'sadia.rahman@yahoo.com',
    items: [
      {
        id: 'p3',
        title: 'Apple AirPods Max (Space Gray)',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        price: 52000,
        quantity: 1,
      },
      {
        id: 'p5',
        title: 'Sennheiser Momentum 4 Wireless',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        price: 31000,
        quantity: 1,
      },
    ],
    cartTotal: 87150,
    timeAgo: '45m ago',
    status: 'Uncontacted',
    recoveryDiscountCode: '',
  },
  {
    id: 'demo_cart_3',
    customerName: 'Asmual Obaidul Hoque (VIP Bundle)',
    customerPhone: '01833452232',
    customerEmail: 'asmual01@gmail.com',
    items: [
      {
        id: 'b-1',
        title: 'Ultimate Audiophile Master Combo',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        price: 60690,
        quantity: 1,
      },
      {
        id: 'b-2',
        title: 'Titanium Creator Pro Suite',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        price: 85900,
        quantity: 1,
      },
    ],
    cartTotal: 180850,
    timeAgo: '2h ago',
    status: 'WhatsApp Sent',
    recoveryDiscountCode: 'COMEBACK10',
  },
  {
    id: 'demo_cart_4',
    customerName: 'Nusrat Jahan',
    customerPhone: '+880 1622-778899',
    customerEmail: 'nusrat.jahan@hotmail.com',
    items: [
      {
        id: 'p9',
        title: 'Samsung Galaxy Watch 6 Classic 47mm',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
        price: 88000,
        quantity: 1,
      },
    ],
    cartTotal: 92400,
    timeAgo: '4h ago',
    status: 'Recovered',
    recoveryDiscountCode: 'SAVE500',
  },
];

export default function AbandonedCartsPage() {
  const { token } = useAuthStore();
  const { telemetryMode } = useVisitorAnalyticsStore();
  const [carts, setCarts] = useState<IAbandonedCart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // WhatsApp Recovery Modal State
  const [activeRecoveryCart, setActiveRecoveryCart] = useState<IAbandonedCart | null>(null);
  const [discountType, setDiscountType] = useState<string>('flat_200');
  const [customValue, setCustomValue] = useState<string>('200');
  const [promoCode, setPromoCode] = useState<string>('SAVE200');
  const [customRecoveryText, setCustomRecoveryText] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Helper to compute discount offer text and suggested coupon code
  const getOfferDetails = useCallback((type: string, customVal: string) => {
    switch (type) {
      case 'percent_5':
        return { text: '৫% এক্সক্লুসিভ ডিসকাউন্ট', defaultCode: 'COMEBACK5' };
      case 'percent_10':
        return { text: '১০% মেগা রিকভারি ডিসকাউন্ট', defaultCode: 'COMEBACK10' };
      case 'percent_15':
        return { text: '১৫% ভিআইপি রিকভারি ডিসকাউন্ট', defaultCode: 'COMEBACK15' };
      case 'flat_100':
        return { text: '৳১০০ ফ্ল্যাট ছাড়', defaultCode: 'SAVE100' };
      case 'flat_200':
        return { text: '৳২০০ ফ্ল্যাট ছাড়', defaultCode: 'SAVE200' };
      case 'flat_500':
        return { text: '৳৫০০ মেগা ফ্ল্যাট ছাড়', defaultCode: 'SAVE500' };
      case 'flat_1000':
        return { text: '৳১,০০০ বিগ সেভার ফ্ল্যাট ছাড়', defaultCode: 'SAVE1000' };
      case 'free_shipping':
        return { text: 'সম্পূর্ণ ফ্রি ডেলিভারি (৳১২০ ছাড়)', defaultCode: 'FREESHIP' };
      case 'custom_flat': {
        const val = customVal || '200';
        return { text: `৳${val} ফ্ল্যাট ছাড়`, defaultCode: `SAVE${val}` };
      }
      case 'custom_percent': {
        const val = customVal || '10';
        return { text: `${val}% বিশেষ রিকভারি ডিসকাউন্ট`, defaultCode: `COMEBACK${val}` };
      }
      default:
        return { text: 'বিশেষ রিকভারি ডিসকাউন্ট', defaultCode: 'COMEBACK5' };
    }
  }, []);

  const getRecoveryMessage = (cart: IAbandonedCart, code: string, type: string, customVal: string) => {
    const itemNames = (cart.items || []).map((i) => i.title).join(', ') || 'আপনার পছন্দের পণ্য';
    const { text: offerText } = getOfferDetails(type, customVal);
    return `আসসালামু আলাইকুম ${cart.customerName || 'Shopper'}! ShopNexus-এ আপনার কার্টে "${itemNames}" রেখে গিয়েছিলেন। আপনার জন্য বিশেষ ${offerText} কুপন কোড: "${code}" তৈরি করা হয়েছে। এখনই চেকআউট সম্পন্ন করে অফিশিয়াল পণ্যটি নিশ্চিত করুন: https://shopnexus.io/checkout?code=${code}`;
  };

  const handleDiscountTypeChange = (newType: string) => {
    setDiscountType(newType);
    const { defaultCode } = getOfferDetails(newType, customValue);
    setPromoCode(defaultCode);
    setCustomRecoveryText('');
  };

  const handleCustomValueChange = (newVal: string) => {
    setCustomValue(newVal);
    const { defaultCode } = getOfferDetails(discountType, newVal);
    setPromoCode(defaultCode);
    setCustomRecoveryText('');
  };

  // Fetch live abandoned carts from MongoDB Atlas / Backend API
  const fetchAbandonedCarts = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    if (telemetryMode === 'demo') {
      setCarts(DEMO_ABANDONED_CARTS);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      let fetched: IAbandonedCart[] | null = null;

      // 1. Direct Next.js Atlas Route (works seamlessly across localhost & local network phone connections)
      try {
        const nextRes = await fetch('/api/admin/abandoned-carts');
        if (nextRes.ok) {
          const json = await nextRes.json();
          if (json?.data && Array.isArray(json.data)) {
            fetched = json.data;
          }
        }
      } catch (_e) {}

      // 2. Fallback to Express Backend if needed
      if (!fetched && API_URL) {
        try {
          const res = await fetch(`${API_URL}/admin/abandoned-carts`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (res.ok) {
            const json = await res.json();
            if (json?.data && Array.isArray(json.data)) {
              fetched = json.data;
            }
          }
        } catch (_e) {}
      }

      if (fetched) {
        setCarts(fetched);
      }
    } catch (err) {
      console.error('Failed to fetch abandoned carts:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [API_URL, token, telemetryMode]);

  useEffect(() => {
    fetchAbandonedCarts();
    // Auto-refresh telemetry every 15 seconds
    const interval = setInterval(() => {
      fetchAbandonedCarts(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchAbandonedCarts]);

  // Statistics KPIs
  const totalAbandonedValue = carts.reduce((acc, c) => acc + (Number(c.cartTotal) || 0), 0);
  const recoveredValue = carts
    .filter((c) => c.status === 'Recovered')
    .reduce((acc, c) => acc + (Number(c.cartTotal) || 0), 0);
  const recoveredCount = carts.filter((c) => c.status === 'Recovered').length;
  const recoveryRate = carts.length > 0 ? ((recoveredCount / carts.length) * 100).toFixed(1) : '0';
  const uncontactedCount = carts.filter((c) => c.status === 'Uncontacted').length;

  const filteredCarts = carts.filter((c) => {
    if (activeFilter === 'Uncontacted' && c.status !== 'Uncontacted') return false;
    if (activeFilter === 'WhatsApp' && c.status !== 'WhatsApp Sent') return false;
    if (activeFilter === 'Recovered' && c.status !== 'Recovered') return false;
    if (activeFilter === 'HighValue' && (c.cartTotal || 0) < 50000) return false;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      (c.customerName || '').toLowerCase().includes(query) ||
      (c.customerPhone || '').includes(query) ||
      (c.customerEmail || '').toLowerCase().includes(query) ||
      (c.items || []).some((i) => (i.title || '').toLowerCase().includes(query))
    );
  });

  const handleSendWhatsAppRecovery = async () => {
    if (!activeRecoveryCart) return;
    setIsSending(true);

    const msg = customRecoveryText || getRecoveryMessage(activeRecoveryCart, promoCode, discountType, customValue);
    const cleanPhone = (activeRecoveryCart.customerPhone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Async DB update to persist 'WhatsApp Sent' status in MongoDB
    try {
      await fetch(`/api/admin/abandoned-carts/${activeRecoveryCart.id}/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountCode: promoCode, status: 'WhatsApp Sent' }),
      }).catch(async () => {
        await fetch(`${API_URL}/admin/abandoned-carts/${activeRecoveryCart.id}/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ discountCode: promoCode, status: 'WhatsApp Sent' }),
        });
      });
    } catch (_e) {
      console.error('Error recording WhatsApp recovery dispatch:', _e);
    }

    // Update local state
    setCarts((prev) =>
      prev.map((c) =>
        c.id === activeRecoveryCart.id
          ? { ...c, status: 'WhatsApp Sent', recoveryDiscountCode: promoCode }
          : c
      )
    );
    setIsSending(false);
    setActiveRecoveryCart(null);
  };

  const handleUpdateStatus = async (cartId: string, newStatus: IAbandonedCart['status']) => {
    try {
      await fetch(`/api/admin/abandoned-carts/${cartId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).catch(async () => {
        await fetch(`${API_URL}/admin/abandoned-carts/${cartId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: newStatus }),
        });
      });

      setCarts((prev) =>
        prev.map((c) => (c.id === cartId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error('Failed to update cart status:', err);
    }
  };

  const isCustomInputActive = discountType === 'custom_flat' || discountType === 'custom_percent';

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" /> Cart Drop-off Telemetry & Recovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Abandoned Cart Recovery Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              কার্ট ফেলে যাওয়া কাস্টমারদের লাইভ ডাটাবেজ পর্যবেক্ষণ করুন এবং ১-ক্লিকে কাস্টম ৳ BDT বা % ডিসকাউন্টসহ WhatsApp/SMS রিমাইন্ডার পাঠিয়ে অর্ডার রিকভার করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchAbandonedCarts(true)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
              <span>{isRefreshing ? 'সিঙ্ক হচ্ছে...' : 'সিঙ্ক রিফ্রেশ'}</span>
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click WhatsApp Trigger Active
            </span>
          </div>
        </div>

        {/* 3 Telemetry KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl transition-all hover:border-orange-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Abandoned Value
              </span>
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs">
                ৳ BDT
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ৳{totalAbandonedValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Across {carts.length} active drop-off sessions in database
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl transition-all hover:border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recovered Revenue
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                ৳ BDT
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ৳{recoveredValue.toLocaleString()}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              +{recoveryRate}% Recovery Rate ({recoveredCount} orders recovered) <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl transition-all hover:border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Uncontacted Leads
              </span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                Pending
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {uncontactedCount} Carts
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Ready for immediate WhatsApp discount ping
            </span>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 p-1 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {[
              { id: 'All', label: `All Abandoned (${carts.length})` },
              { id: 'Uncontacted', label: `⏳ Uncontacted (${uncontactedCount})` },
              { id: 'WhatsApp', label: `💬 WhatsApp Sent (${carts.filter((c) => c.status === 'WhatsApp Sent').length})` },
              { id: 'Recovered', label: `✅ Recovered (${recoveredCount})` },
              { id: 'HighValue', label: '💎 High Value (>৳50k)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-xs w-full relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search customer, phone, or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Abandoned Carts Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                MongoDB Atlas থেকে লাইভ কার্ট ডাটা লোড হচ্ছে...
              </p>
            </div>
          ) : filteredCarts.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                কোন পরিত্যক্ত কার্ট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {searchQuery || activeFilter !== 'All'
                  ? 'ফিল্টার বা সার্চ কোয়েরির সাথে মেলে এমন কোনো কার্ট পাওয়া যায়নি।'
                  : 'বর্তমানে কোনো সক্রিয় কাস্টমার কার্ট ফেলে যাননি অথবা সবাই চেকআউট সম্পন্ন করেছেন। কাস্টমার কার্টে পণ্য যোগ করলেই এখানে লাইভ দেখা যাবে।'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Cart Items</th>
                    <th className="px-5 py-3.5">Cart Total (৳ BDT)</th>
                    <th className="px-5 py-3.5">Drop-off Time</th>
                    <th className="px-5 py-3.5">Recovery Status</th>
                    <th className="px-5 py-3.5 text-right">Recovery Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {filteredCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{cart.customerName || 'Guest Shopper'}</div>
                        <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-orange-500" /> {cart.customerPhone || '+880 1700-000000'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{cart.customerEmail || 'shopper@tempmail.io'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1.5 max-w-xs">
                          {(cart.items || []).map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                                {item.image ? (
                                  <Image src={item.image} alt={item.title || 'Cart Item'} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-400">NX</div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {item.quantity}x {item.title}
                                </div>
                                {item.variant && (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                                    Variant: {item.variant}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-black text-slate-900 dark:text-white text-sm">
                        ৳{(cart.cartTotal || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                          <Clock className="w-3 h-3" /> {cart.timeAgo || 'Recently'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <select
                            value={cart.status}
                            onChange={(e) => handleUpdateStatus(cart.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer outline-none transition-all ${
                              cart.status === 'Recovered'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : cart.status === 'WhatsApp Sent'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                : cart.status === 'Discount Emailed'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}
                          >
                            <option value="Uncontacted">⏳ Uncontacted</option>
                            <option value="WhatsApp Sent">💬 WhatsApp Sent</option>
                            <option value="Discount Emailed">✉️ Discount Emailed</option>
                            <option value="Recovered">✅ Recovered</option>
                          </select>

                          {cart.recoveryDiscountCode && (
                            <span className="block text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400">
                              Code: {cart.recoveryDiscountCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {cart.status === 'Recovered' ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Order Converted 🎉
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveRecoveryCart(cart);
                              setDiscountType('flat_200');
                              setCustomValue('200');
                              setPromoCode(cart.recoveryDiscountCode || 'SAVE200');
                              setCustomRecoveryText('');
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:scale-105"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Recovery</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 💬 WHATSAPP COMEBACK DISPATCH MODAL WITH FLEXIBLE DISCOUNT TYPES */}
        {activeRecoveryCart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      1-Click WhatsApp Cart Recovery
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      কাস্টমারকে সরাসরি ৳ BDT বা % ডিসকাউন্ট অফারসহ পার্সোনালাইজড মেসেজ পাঠান
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRecoveryCart(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recipient & Cart Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {activeRecoveryCart.customerName || 'Guest Shopper'}
                    </span>
                    <span className="font-mono text-orange-600 dark:text-orange-400">
                      {activeRecoveryCart.customerPhone || '+880 1700-000000'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      ৳{(activeRecoveryCart.cartTotal || 0).toLocaleString()} BDT
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {(activeRecoveryCart.items || []).length} item(s) in cart
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Offer & Coupon Configuration */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-orange-500" /> Discount Offer Type:
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => handleDiscountTypeChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:border-orange-500 focus:outline-none cursor-pointer"
                    >
                      <optgroup label="💵 Flat Amount Discounts (৳ BDT)">
                        <option value="flat_100">৳100 Flat Cash Discount</option>
                        <option value="flat_200">৳200 Flat Cash Discount</option>
                        <option value="flat_500">৳500 Mega Flat Discount</option>
                        <option value="flat_1000">৳1,000 Big Saver Discount</option>
                        <option value="custom_flat">✏️ Custom Flat Amount (৳)...</option>
                      </optgroup>
                      <optgroup label="📊 Percentage Discounts (%)">
                        <option value="percent_5">5% Exclusive Recovery Discount</option>
                        <option value="percent_10">10% Mega Comeback Deal</option>
                        <option value="percent_15">15% VIP Comeback Deal</option>
                        <option value="custom_percent">✏️ Custom Percentage (%)...</option>
                      </optgroup>
                      <optgroup label="🚚 Special Perks">
                        <option value="free_shipping">Free Delivery Waiver (৳120 off)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Recovery Coupon Code:
                    </label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE200"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-orange-600 dark:text-orange-400 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Custom Input when Custom % or Custom ৳ is chosen */}
                {isCustomInputActive && (
                  <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      {discountType === 'custom_flat' ? <Banknote className="w-4 h-4" /> : <Percent className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-0.5">
                        {discountType === 'custom_flat' ? 'কাস্টম টাকার অংক লিখুন (৳ BDT):' : 'কাস্টম পার্সেন্টেজ লিখুন (%):'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={customValue}
                        onChange={(e) => handleCustomValueChange(e.target.value)}
                        placeholder={discountType === 'custom_flat' ? 'e.g. 250' : 'e.g. 12'}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    WhatsApp Message Preview:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const text = customRecoveryText || getRecoveryMessage(activeRecoveryCart, promoCode, discountType, customValue);
                      navigator.clipboard.writeText(text);
                      setCopiedFeedback(true);
                      setTimeout(() => setCopiedFeedback(false), 2500);
                    }}
                    className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                  >
                    {copiedFeedback ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFeedback ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={customRecoveryText || getRecoveryMessage(activeRecoveryCart, promoCode, discountType, customValue)}
                  onChange={(e) => setCustomRecoveryText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveRecoveryCart(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendWhatsAppRecovery}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : 'Launch WhatsApp & Save Status'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
