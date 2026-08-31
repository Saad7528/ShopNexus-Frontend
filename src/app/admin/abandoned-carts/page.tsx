'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
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
}

const INITIAL_ABANDONED_CARTS: IAbandonedCart[] = [
  {
    id: 'ac-1',
    customerName: 'Shakib Al Hasan',
    customerPhone: '+880 1711-223344',
    customerEmail: 'shakib.official@gmail.com',
    items: [
      {
        id: 'p1',
        title: 'Sony WH-1000XM5 Wireless ANC',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        variant: 'Silver & Black',
        price: 32500,
        quantity: 1,
      },
    ],
    cartTotal: 32500,
    timeAgo: '18 mins ago',
    status: 'Uncontacted',
  },
  {
    id: 'ac-2',
    customerName: 'Ayesha Siddiqua',
    customerPhone: '+880 1822-445566',
    customerEmail: 'ayesha.arch@yahoo.com',
    items: [
      {
        id: 'p2',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        variant: 'Titanium Loop',
        price: 79900,
        quantity: 1,
      },
      {
        id: 'p3',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        variant: 'Carbon Gray',
        price: 17900,
        quantity: 1,
      },
    ],
    cartTotal: 97800,
    timeAgo: '42 mins ago',
    status: 'Uncontacted',
  },
  {
    id: 'ac-3',
    customerName: 'Kazi Moinuddin',
    customerPhone: '+880 1933-778899',
    customerEmail: 'moin.ctg@gmail.com',
    items: [
      {
        id: 'p4',
        title: 'Bose QuietComfort Ultra Spatial Audio',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        variant: 'Black Smoke',
        price: 38900,
        quantity: 1,
      },
    ],
    cartTotal: 38900,
    timeAgo: '2 hours ago',
    status: 'WhatsApp Sent',
    recoveryDiscountCode: 'COMEBACK5',
  },
  {
    id: 'ac-4',
    customerName: 'Fahim Faisal',
    customerPhone: '+880 1644-112233',
    customerEmail: 'fahim.tech@gmail.com',
    items: [
      {
        id: 'p3',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        variant: 'Carbon Gray',
        price: 17900,
        quantity: 2,
      },
    ],
    cartTotal: 35800,
    timeAgo: '5 hours ago',
    status: 'Recovered',
    recoveryDiscountCode: 'SAVE500',
  },
  {
    id: 'ac-5',
    customerName: 'Nadia Sultana',
    customerPhone: '+880 1788-990011',
    customerEmail: 'nadia.fashion@gmail.com',
    items: [
      {
        id: 'p2',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        variant: 'Titanium Loop',
        price: 79900,
        quantity: 1,
      },
    ],
    cartTotal: 79900,
    timeAgo: '1 day ago',
    status: 'Discount Emailed',
    recoveryDiscountCode: 'COMEBACK10',
  },
];

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<IAbandonedCart[]>(INITIAL_ABANDONED_CARTS);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // WhatsApp / SMS Modal Trigger
  const [activeRecoveryCart, setActiveRecoveryCart] = useState<IAbandonedCart | null>(null);
  const [promoCode, setPromoCode] = useState('COMEBACK5');
  const [discountPercent, setDiscountPercent] = useState('5');
  const [customRecoveryText, setCustomRecoveryText] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Statistics
  const totalAbandonedValue = carts.reduce((acc, c) => acc + c.cartTotal, 0);
  const recoveredValue = carts
    .filter((c) => c.status === 'Recovered')
    .reduce((acc, c) => acc + c.cartTotal, 0);
  const recoveryRate = ((carts.filter((c) => c.status === 'Recovered').length / carts.length) * 100).toFixed(1);

  const filteredCarts = carts.filter((c) => {
    if (activeFilter === 'Uncontacted' && c.status !== 'Uncontacted') return false;
    if (activeFilter === 'WhatsApp' && c.status !== 'WhatsApp Sent') return false;
    if (activeFilter === 'Recovered' && c.status !== 'Recovered') return false;
    if (activeFilter === 'HighValue' && c.cartTotal < 50000) return false;

    return (
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerPhone.includes(searchQuery) ||
      c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.items.some((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getRecoveryMessage = (cart: IAbandonedCart, code: string, pct: string) => {
    const itemNames = cart.items.map((i) => i.title).join(', ');
    return `আসসালামু আলাইকুম ${cart.customerName}! ShopNexus-এ আপনার কার্টে "${itemNames}" রেখে গিয়েছিলেন। আপনার জন্য বিশেষ ${pct}% রিকভারি ডিসকাউন্ট কুপন কোড: "${code}" তৈরি করা হয়েছে। এখনই চেকআউট সম্পন্ন করে অফিশিয়াল প্রোডাক্টটি নিশ্চিত করুন: https://shopnexus.io/checkout?code=${code}`;
  };

  const handleSendWhatsAppRecovery = () => {
    if (!activeRecoveryCart) return;
    const msg = customRecoveryText || getRecoveryMessage(activeRecoveryCart, promoCode, discountPercent);
    const cleanPhone = activeRecoveryCart.customerPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Update status
    setCarts((prev) =>
      prev.map((c) =>
        c.id === activeRecoveryCart.id
          ? { ...c, status: 'WhatsApp Sent', recoveryDiscountCode: promoCode }
          : c
      )
    );
    setActiveRecoveryCart(null);
  };

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
              কার্ট ফেলে যাওয়া কাস্টমারদের তালিকা দেখুন এবং ১-ক্লিকে বিশেষ ডিসকাউন্টসহ WhatsApp/SMS রিমাইন্ডার পাঠিয়ে অর্ডার রিকভার করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click WhatsApp Trigger Active
            </span>
          </div>
        </div>

        {/* 3 Telemetry KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
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
              Across {carts.length} active drop-off sessions
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
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
              +{recoveryRate}% Recovery Rate <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Uncontacted Leads
              </span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                Pending
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {carts.filter((c) => c.status === 'Uncontacted').length} Carts
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
              { id: 'All', label: 'All Abandoned' },
              { id: 'Uncontacted', label: '⏳ Uncontacted (Ready)' },
              { id: 'WhatsApp', label: '💬 WhatsApp Sent' },
              { id: 'Recovered', label: '✅ Recovered' },
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
                      <div className="font-bold text-slate-900 dark:text-white">{cart.customerName}</div>
                      <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 block flex items-center gap-1">
                        <Phone className="w-3 h-3 text-orange-500" /> {cart.customerPhone}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{cart.customerEmail}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1.5">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {item.quantity}x {item.title}
                              </div>
                              {item.variant && (
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">Variant: {item.variant}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-black text-slate-900 dark:text-white text-sm">
                      ৳{cart.cartTotal.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                        <Clock className="w-3 h-3" /> {cart.timeAgo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          cart.status === 'Recovered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : cart.status === 'WhatsApp Sent'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : cart.status === 'Discount Emailed'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {cart.status === 'Recovered' && <CheckCircle2 className="w-3 h-3" />}
                        {cart.status}
                      </span>
                      {cart.recoveryDiscountCode && (
                        <span className="block text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                          Code: {cart.recoveryDiscountCode}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {cart.status === 'Recovered' ? (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Order Converted 🎉
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRecoveryCart(cart);
                            setPromoCode('COMEBACK5');
                            setDiscountPercent('5');
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
        </div>

        
      </div>
    </RoleGuard>
  );
}
