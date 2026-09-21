'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { ALL_PRODUCTS } from '@/data/products';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { useHydrated } from '@/lib/useHydrated';
import { Flame, Zap, Sparkles } from 'lucide-react';

export default function FlashSalesPage() {
  const { t, language } = useLanguageStore();
  const mounted = useHydrated();
  const storeProducts = useProductStore((state) => state.products);

  // Grab flash sale products from store or static baseline
  const flashProducts = useMemo(() => {
    const source = storeProducts && storeProducts.length > 0 ? storeProducts : ALL_PRODUCTS;
    const items = source.filter((p) => p.isFlashSale);
    return items.length > 0 ? items : ALL_PRODUCTS.filter((p) => p.isFlashSale);
  }, [storeProducts]);

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    const str = String(num).padStart(2, '0');
    return mounted && language === 'bn' ? toBengaliNumber(str) : str;
  };

  return (
    <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[85vw] min-[2560px]:max-w-[75vw] min-[4000px]:max-w-[70vw] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Flash Sale Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-orange-950/40 dark:via-slate-900 dark:to-[#090d16] border border-orange-200 dark:border-orange-500/30 p-6 sm:p-10 mb-8 sm:mb-10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600 dark:text-orange-400" />
              {mounted ? (language === 'bn' ? 'সীমিত সময়ের ফ্ল্যাশ অফার' : 'Limited-Time Flash Drops') : 'Limited-Time Flash Drops'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
              {mounted ? t('flash_deals_title') : 'Mega Flash Deals'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {mounted ? (
                language === 'bn' ? (
                  <>নির্বাচিত অথেন্টিক টেক ডিভাইসে সর্বোচ্চ <span className="font-bold text-orange-600 dark:text-orange-400">৪০% পর্যন্ত ছাড়</span>। স্টক সীমিত!</>
                ) : (
                  <>Up to <span className="font-bold text-orange-600 dark:text-orange-400">40% OFF</span> official curated hardware. First come, first served.</>
                )
              ) : (
                <>Up to <span className="font-bold text-orange-600 dark:text-orange-400">40% OFF</span> official curated hardware.</>
              )}
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                {mounted ? t('flash_hours') : 'Hours'}
              </span>
            </div>
            <span className="text-xl font-bold text-orange-500 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                {mounted ? t('flash_minutes') : 'Mins'}
              </span>
            </div>
            <span className="text-xl font-bold text-orange-500 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                {formatNumber(timeLeft.seconds)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                {mounted ? t('flash_seconds') : 'Secs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Responsive Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 min-[1800px]:grid-cols-7 min-[4000px]:grid-cols-8 gap-3.5 sm:gap-4">
        {flashProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
