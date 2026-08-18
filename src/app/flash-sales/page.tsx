'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/store/useProductStore';
import { Zap, Clock, Flame, ShieldAlert } from 'lucide-react';

const FLASH_DEALS: Product[] = [
  {
    _id: 'flash-1',
    title: 'AuraSound Pro Active Noise-Cancelling Headphones',
    slug: 'aurasound-pro-anc-headphones',
    description: 'Studio-grade spatial audio with 40-hour ultra battery life and pure titanium drivers.',
    category: 'Audio',
    brand: 'PureSound',
    price: 299,
    discountPrice: 199,
    stock: 7,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'PureSound Audio Corp',
    isFlashSale: true,
    flashSaleDiscountPercent: 33,
    averageRating: 4.9,
    totalReviews: 128,
    tags: ['flash-sale', 'headphones'],
  },
  {
    _id: 'flash-2',
    title: 'Nexus Watch Ultra 2 OLED Smartwatch',
    slug: 'nexus-watch-ultra-2',
    description: 'Precision aerospace titanium casing with continuous biometric health tracking and ECG.',
    category: 'Electronics',
    brand: 'NexusTech',
    price: 499,
    discountPrice: 389,
    stock: 3,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 22,
    averageRating: 4.8,
    totalReviews: 89,
    tags: ['flash-sale', 'smartwatch'],
  },
  {
    _id: 'flash-3',
    title: 'EcoLiving Smart Hydroponic Indoor Garden',
    slug: 'ecoliving-smart-indoor-garden',
    description: 'Automated spectrum LED lighting and smart watering reservoir for fresh herbs year-round.',
    category: 'Home & Living',
    brand: 'EcoLiving',
    price: 189,
    discountPrice: 129,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: true,
    flashSaleDiscountPercent: 32,
    averageRating: 4.6,
    totalReviews: 67,
    tags: ['flash-sale', 'smart-home'],
  },
];

export default function FlashSalesPage() {
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

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Flash Sale Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600/30 via-rose-900/40 to-slate-900/80 border border-amber-500/30 p-8 sm:p-12 mb-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Flame className="w-4 h-4 fill-amber-400" />
              Limited-Time Flash Event
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
              Mega Flash Deals
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Up to <span className="font-bold text-amber-400">40% OFF</span> top-tier electronics and premium lifestyle items. First come, first served.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">Hours</span>
            </div>
            <span className="text-2xl font-bold text-amber-400 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">Mins</span>
            </div>
            <span className="text-2xl font-bold text-amber-400 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                {formatNumber(timeLeft.seconds)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FLASH_DEALS.map((deal) => (
          <ProductCard key={deal._id} product={deal} />
        ))}
      </div>
    </div>
  );
}
