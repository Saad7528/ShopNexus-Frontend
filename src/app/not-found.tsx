'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  ArrowLeft,
  Search,
  Sparkles,
  Zap,
  HelpCircle,
  ShieldCheck,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white px-4 py-16 transition-colors duration-300">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="max-w-2xl w-full mx-auto text-center relative z-10 space-y-8">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-2">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
            <BrandLogo size="lg" />
          </Link>
        </div>

        {/* 404 Glowing Visual Centerpiece */}
        <div className="relative inline-block my-2 select-none">
          <span className="text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 drop-shadow-sm">
            404
          </span>
          <div className="absolute -top-2 -right-4 sm:-right-8 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 backdrop-blur-md text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm animate-bounce">
            <Sparkles className="w-3.5 h-3.5" /> Page Not Found
          </div>
        </div>

        {/* Courteous & Polite Bengali Copywriting */}
        <div className="space-y-3 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            আপনি যে লিঙ্ক বা পৃষ্ঠাটি খুঁজছেন তা হয়তো পরিবর্তিত হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে। অনুগ্রহ করে সঠিক ইউআরএল চেক করুন অথবা আমাদের মূল পাতায় ফিরে যান।
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" /> হোমপেজে ফিরে যান
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" /> প্রোডাক্ট ক্যাটালগ
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/70 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-800/80 transition-all cursor-pointer hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী পেজ
          </button>
        </div>

        {/* Helpful Quick Navigation Cards */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-orange-500" /> প্রয়োজনীয় লিঙ্কসমূহ
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <Link
              href="/flash-sales"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">ফ্ল্যাশ ডিল</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">সর্বোচ্চ ৬০% ছাড়</p>
            </Link>

            <Link
              href="/cart"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <ShoppingBag className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">শপিং কার্ট</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">অর্ডার সম্পন্ন করুন</p>
            </Link>

            <Link
              href="/profile"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">আমার একাউন্ট</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">কয়েন ও অর্ডার ট্র্যাকিং</p>
            </Link>

            <Link
              href="/about"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <HelpCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">হেল্প সেন্টার</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">২৪/৭ কাস্টমার সাপোর্ট</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
