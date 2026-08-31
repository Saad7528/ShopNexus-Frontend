'use client';

import React, { useState } from 'react';

export interface IAbandonedItem {
  id: string;
  title: string;
  image: string;
  variant?: string;
  price: number;
  quantity: number;
}

export interface IAbandonedCart {
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

export const INITIAL_ABANDONED_CARTS: IAbandonedCart[] = [
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

import { RoleGuard } from '@/components/auth/RoleGuard';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<IAbandonedCart[]>(INITIAL_ABANDONED_CARTS);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
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
      </div>
    </RoleGuard>
  );
}
