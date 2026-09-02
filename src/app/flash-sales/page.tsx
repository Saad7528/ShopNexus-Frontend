'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { Zap, Clock, Flame } from 'lucide-react';

const FLASH_DEALS: Product[] = [
  {
    _id: 'flash-1',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh-1000xm5-anc-headphones',
    description: 'Studio-grade spatial audio with 40-hour ultra battery life and pure titanium drivers.',
    category: 'Audio',
    brand: 'Sony',
    price: 38500,
    discountPrice: 28900,
    stock: 7,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 25,
    averageRating: 4.9,
    totalReviews: 248,
    tags: ['flash-sale', 'headphones', 'anc'],
  },
  {
    _id: 'flash-2',
    title: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
    slug: 'apple-watch-ultra-2',
    description: 'Precision aerospace titanium casing with continuous biometric health tracking and ECG.',
    category: 'Wearables',
    brand: 'Apple',
    price: 88900,
    discountPrice: 69900,
    stock: 3,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 21,
    averageRating: 4.9,
    totalReviews: 184,
    tags: ['flash-sale', 'smartwatch', 'titanium'],
  },
  {
    _id: 'flash-3',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    slug: 'keychron-q1-pro-mechanical-keyboard',
    description: 'Full CNC aluminum body, hot-swappable tactile switches, and south-facing RGB lighting.',
    category: 'Peripherals',
    brand: 'Keychron',
    price: 21500,
    discountPrice: 15900,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 26,
    averageRating: 4.8,
    totalReviews: 112,
    tags: ['flash-sale', 'mechanical', 'custom'],
  },
  {
    _id: 'flash-4',
    title: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    slug: 'bose-qc-ultra-spatial-headphones',
    description: 'Breakthrough spatialized audio with custom tuned active noise cancellation.',
    category: 'Audio',
    brand: 'Bose',
    price: 44500,
    discountPrice: 34900,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 21,
    averageRating: 4.8,
    totalReviews: 142,
    tags: ['flash-sale', 'spatial-audio'],
  },
  {
    _id: 'flash-5',
    title: 'Razer Viper V2 Pro Ultra-Lightweight Wireless Gaming Mouse',
    slug: 'razer-viper-v2-pro',
    description: '58g ultra-lightweight design with Gen-3 Optical Switches and 30K DPI sensor.',
    category: 'Gaming',
    brand: 'Razer',
    price: 15500,
    discountPrice: 9900,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 36,
    averageRating: 4.7,
    totalReviews: 95,
    tags: ['flash-sale', 'gaming', 'mouse'],
  },
  {
    _id: 'flash-6',
    title: 'Garmin Fenix 7X Sapphire Solar Multisport Smartwatch',
    slug: 'garmin-fenix-7x-solar',
    description: 'Solar charging lens with built-in LED flashlight and global topographic maps.',
    category: 'Wearables',
    brand: 'Garmin',
    price: 94000,
    discountPrice: 76500,
    stock: 2,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 18,
    averageRating: 4.9,
    totalReviews: 76,
    tags: ['flash-sale', 'solar', 'fitness'],
  },
  {
    _id: 'flash-7',
    title: 'Shure SM7B Cardioid Dynamic Studio Microphone',
    slug: 'shure-sm7b-dynamic-microphone',
    description: 'The legendary vocal microphone for studio recording, podcasting, and streaming.',
    category: 'Creator Gear',
    brand: 'Shure',
    price: 42000,
    discountPrice: 33500,
    stock: 6,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 20,
    averageRating: 5.0,
    totalReviews: 310,
    tags: ['flash-sale', 'studio', 'mic'],
  },
  {
    _id: 'flash-8',
    title: 'Anker Prime 27,650mAh Power Bank (250W Multi-Port)',
    slug: 'anker-prime-27650mah-powerbank',
    description: 'Fast charge laptops, phones, and accessories simultaneously with smart digital display.',
    category: 'Accessories',
    brand: 'Anker',
    price: 18500,
    discountPrice: 12900,
    stock: 11,
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 30,
    averageRating: 4.8,
    totalReviews: 154,
    tags: ['flash-sale', 'charging', 'anker'],
  },
];

export default function FlashSalesPage() {
  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Flash Sale Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-orange-950/40 dark:via-slate-900 dark:to-[#090d16] border border-orange-200 dark:border-orange-500/30 p-6 sm:p-10 mb-8 sm:mb-10 shadow-xl">
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

      {/* Compact 4-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {FLASH_DEALS.map((deal) => (
          <ProductCard key={deal._id} product={deal} />
        ))}
      </div>
    </div>
  );
}
