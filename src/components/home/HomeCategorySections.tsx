'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';
import { Product } from '@/types';
import {
  ArrowRight,
  Headphones,
  Gamepad2,
  Watch,
  Tv,
} from 'lucide-react';

interface HomeCategorySectionsProps {
  audioProducts: Product[];
  wearableProducts: Product[];
  peripheralProducts: Product[];
  creatorProducts: Product[];
}

export function HomeCategorySections({
  audioProducts,
  wearableProducts,
  peripheralProducts,
  creatorProducts,
}: HomeCategorySectionsProps) {
  const { language } = useLanguageStore();
  const isHydrated = useHydrated();
  const isBn = isHydrated && language === 'bn';

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* 🎧 4. AUDIO & ACOUSTICS SECTION */}
      <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Headphones className="w-3.5 h-3.5" />
              {isBn ? 'অডিওফাইল সাউন্ড' : 'Audiophile Sound'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'প্রিমিয়াম অ্যাকোস্টিক ও হেডসেট' : 'Premium Acoustics & Headsets'}
            </h2>
          </div>
          <Link href="/products?category=Audio" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {isBn ? 'সব দেখুন' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {audioProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌚ 5. TITANIUM WEARABLES & WATCHES */}
      <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Watch className="w-3.5 h-3.5" />
              {isBn ? 'অ্যারোস্পেস টাইটানিয়াম' : 'Aerospace Titanium'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'স্মার্টওয়াচ ও ফিটনেস ট্র্যাকার' : 'Smartwatches & Fitness Trackers'}
            </h2>
          </div>
          <Link href="/products?category=Wearables" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {isBn ? 'সব দেখুন' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {wearableProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌨️ 6. MECHANICAL KEYBOARDS & WORKSPACE */}
      <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              {isBn ? 'কাস্টম এরগনোমিক্স' : 'Custom Ergonomics'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'মেকানিক্যাল কিবোর্ড ও পারফরম্যান্স মাউস' : 'Keyboards & Performance Mice'}
            </h2>
          </div>
          <Link href="/products?category=Peripherals" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {isBn ? 'সব দেখুন' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {peripheralProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 🏠 7. SMART HOME & CREATOR GEAR */}
      <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Tv className="w-3.5 h-3.5" />
              {isBn ? 'স্মার্ট লিভিং ও গিয়ার' : 'Smart Living & Gear'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'ক্যামেরা ও ক্রিয়েটর পেরিফেরালস' : 'Cameras & Creator Peripherals'}
            </h2>
          </div>
          <Link href="/products?category=Smart+Home" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {isBn ? 'সব দেখুন' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4">
          {creatorProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
