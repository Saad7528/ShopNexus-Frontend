'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  ArrowLeft,
  Zap,
  HelpCircle,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { LanguageToggle } from '@/components/common/LanguageToggle';

export default function NotFound() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBn = mounted && language === 'bn';

  return (
    <div className="fixed inset-0 z-[100] min-h-screen overflow-y-auto flex flex-col justify-between bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      {/* 🌟 1. Top Bar Controls (Logo on left, Language + Theme Toggle on right) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between z-20">
        <BrandLogo size="md" className="transform hover:scale-105 transition-transform duration-300" />

        <div className="flex items-center gap-2.5">
          <LanguageToggle className="inline-flex" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors shadow-sm cursor-pointer"
            title={mounted ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Toggle Theme'}
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* 🌟 2. Main 404 Centerpiece */}
      <main className="max-w-2xl w-full mx-auto text-center px-4 py-8 relative z-10 space-y-6 my-auto">
        {/* 404 Big Glowing Display (Always English '404') */}
        <div className="relative inline-block select-none">
          <span className="text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 drop-shadow-sm font-sans">
            404
          </span>
        </div>

        {/* Dynamic Bilingual Copywriting */}
        <div className="space-y-3 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isBn ? 'দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Oops! Page Not Found'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            {isBn
              ? 'আপনি যে লিঙ্ক বা পৃষ্ঠাটি খুঁজছেন তা হয়তো পরিবর্তিত হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে। অনুগ্রহ করে সঠিক ইউআরএল চেক করুন অথবা আমাদের মূল পাতায় ফিরে যান।'
              : 'The page or link you are looking for might have been moved, renamed, or is temporarily unavailable. Please verify the URL or return to our homepage.'}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Homepage'}</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>{isBn ? 'প্রোডাক্ট ক্যাটালগ' : 'Browse Products'}</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/70 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-800/80 transition-all cursor-pointer hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'পূর্ববর্তী পেজ' : 'Go Back'}</span>
          </button>
        </div>

        {/* Helpful Quick Navigation Cards */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            <span>{isBn ? 'প্রয়োজনীয় লিঙ্কসমূহ' : 'Quick Navigation Links'}</span>
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
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'ফ্ল্যাশ ডিল' : 'Flash Deals'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'সর্বোচ্চ ৬০% ছাড়' : 'Up to 60% Off'}
              </p>
            </Link>

            <Link
              href="/cart"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <ShoppingBag className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'শপিং কার্ট' : 'Shopping Cart'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'অর্ডার সম্পন্ন করুন' : 'Complete Order'}
              </p>
            </Link>

            <Link
              href="/profile"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'আমার একাউন্ট' : 'My Account'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'কয়েন ও অর্ডার ট্র্যাকিং' : 'Coins & Live Orders'}
              </p>
            </Link>

            <Link
              href="/about"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <HelpCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'হেল্প সেন্টার' : 'Help Center'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Live Support'}
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* 🌟 3. Minimal Bottom Copyright */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 dark:text-slate-500 z-20">
        © 2026 ShopNexus. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
      </footer>
    </div>
  );
}
