'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types/product';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber, Language, TRANSLATIONS } from '@/lib/translations';

import { useHydrated } from '@/lib/useHydrated';

interface FlashDealsSectionProps {
  products: Product[];
}

export function FlashDealsSection({ products }: FlashDealsSectionProps) {
  const { language, t } = useLanguageStore();
  const mounted = useHydrated();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentLang: Language = mounted ? language : 'bn';
  const isBn = currentLang === 'bn';
  const hoursStr = String(timeLeft.hours).padStart(2, '0');
  const minutesStr = String(timeLeft.minutes).padStart(2, '0');
  const secondsStr = String(timeLeft.seconds).padStart(2, '0');

  return (
    <section className="max-w-7xl lg:max-w-[85vw] xl:max-w-[85vw] min-[2560px]:max-w-[75vw] mx-auto px-3 sm:px-6 lg:px-8">
      <div className="p-3.5 sm:p-6 rounded-3xl bg-linear-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10 border border-orange-200 dark:border-orange-500/20 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-bounce" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white truncate">
                {TRANSLATIONS[currentLang]?.home_flash_title || t('home_flash_title')}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-orange-300/80 truncate">
                {TRANSLATIONS[currentLang]?.home_flash_desc || t('home_flash_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Countdown Clock */}
            <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
              <Clock className="w-3 h-3 text-orange-500 hidden xs:inline" />
              <span className="text-orange-600 dark:text-orange-400">
                {currentLang === 'bn' ? toBengaliNumber(hoursStr) : hoursStr}h
              </span>:
              <span>
                {currentLang === 'bn' ? toBengaliNumber(minutesStr) : minutesStr}m
              </span>:
              <span className="text-rose-500 dark:text-rose-400">
                {currentLang === 'bn' ? toBengaliNumber(secondsStr) : secondsStr}s
              </span>
            </div>

            {/* View All / See More Link */}
            <Link
              href="/flash-sales"
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{isBn ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5">
          {products.map((prod, idx) => {
            const visibilityClass = idx === 5 ? 'block lg:hidden 2xl:block' : 'block';

            return (
              <div key={prod._id} className={visibilityClass}>
                <ProductCard product={prod} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
