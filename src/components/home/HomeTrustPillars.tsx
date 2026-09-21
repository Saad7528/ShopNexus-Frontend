'use client';

import React from 'react';
import { Truck, Wallet, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';

export function HomeTrustPillars() {
  const { language } = useLanguageStore();
  const isHydrated = useHydrated();
  const isBn = isHydrated && language === 'bn';

  return (
    <section className="max-w-7xl lg:max-w-[85vw] xl:max-w-[85vw] min-[2560px]:max-w-[75vw] mx-auto px-3 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shrink-0">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
              {isBn ? '২৪-৪৮ ঘণ্টার দ্রুত ডেলিভারি' : '24-48h Fast Delivery'}
            </h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isBn ? 'ঢাকা ৳৬০ / ঢাকার বাইরে ৳১২০' : 'Dhaka ৳60 / Outside ৳120'}
            </p>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
              {isBn ? 'বিকাশ ও নগদ পেমেন্ট' : 'bKash & Nagad Pay'}
            </h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isBn ? '১০% ক্যাশব্যাক ও সিওডি' : '10% Cashback & COD'}
            </p>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
              {isBn ? '৭ দিনে সহজ রিটার্ন' : '7 Days Easy Return'}
            </h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isBn ? 'ঝামেলাহীন রিপ্লেসমেন্ট' : 'Hassle-Free Replacement'}
            </p>
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
              {isBn ? '১০০% আসল ও ওয়ারেন্টি' : '100% Genuine & Warranty'}
            </h4>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isBn ? 'অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি' : 'Official Brand Warranties'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
