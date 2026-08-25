'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
  Star,
  Timer,
  Wallet,
  Keyboard,
  Layers,
  Plus,
  TrendingUp,
  Award,
  BellRing,
} from 'lucide-react';

interface SlideData {
  id: number;
  tag: string;
  tagIcon: any;
  tagColor: string;
  title: string;
  titleHighlight: string;
  description: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  colors?: { name: string; hex: string; img: string }[];
  voucherCode?: string;
  specs?: string[];
  productPayload?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    tag: 'MEGA FLASH SALE 2026',
    tagIcon: Flame,
    tagColor: 'from-orange-500 to-rose-500',
    title: 'Sony WH-1000XM5',
    titleHighlight: 'Acoustic Precision',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and crystal-clear hands-free calling.',
    price: 32500,
    originalPrice: 38000,
    discountBadge: 'Save ৳5,500',
    ctaText: 'Add to Cart',
    ctaLink: '/cart',
    secondaryCtaText: 'Explore All Flash Deals',
    secondaryCtaLink: '/flash-sales',
    colors: [
      { name: 'Midnight Black', hex: '#111827', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
      { name: 'Platinum Silver', hex: '#e2e8f0', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800' },
      { name: 'Sunset Orange', hex: '#ea580c', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800' },
    ],
    productPayload: {
      id: 'prod_sony_xm5',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      price: 32500,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    },
  },
  {
    id: 2,
    tag: 'DIGITAL WALLET SPECIAL',
    tagIcon: Wallet,
    tagColor: 'from-pink-500 to-orange-500',
    title: '10% Extra Cashback',
    titleHighlight: 'bKash & Nagad Pay',
    description: 'Enjoy instant 10% cashback (up to ৳1,500) on all hardware & audio purchases with code NEXUS10 at checkout.',
    price: 1500,
    originalPrice: 0,
    discountBadge: '10% Instant Voucher',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    secondaryCtaText: 'Apply Code at Checkout',
    secondaryCtaLink: '/checkout',
    voucherCode: 'NEXUS10',
  },
  {
    id: 3,
    tag: 'NEW FLAGSHIP LAUNCH',
    tagIcon: Keyboard,
    tagColor: 'from-amber-500 to-orange-600',
    title: 'Keychron Q1 Pro',
    titleHighlight: 'Wireless Custom Mech',
    description: 'Full aluminum CNC machined body, hot-swappable switches, double-gasket acoustic mounting, and wireless Bluetooth 5.1.',
    price: 21500,
    originalPrice: 25000,
    discountBadge: 'Save ৳3,500',
    ctaText: 'Add to Cart',
    ctaLink: '/cart',
    secondaryCtaText: 'Explore Keyboards',
    secondaryCtaLink: '/products?category=Keyboards',
    specs: ['Hot-Swappable', 'CNC Aluminum Body', 'QMK/VIA Programmable', 'Mac & Windows'],
    productPayload: {
      id: 'prod_keychron_q1',
      title: 'Keychron Q1 Pro Wireless Custom Keyboard',
      price: 21500,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    },
  },
  {
    id: 4,
    tag: 'LIMITED STUDIO EDITION',
    tagIcon: Sparkles,
    tagColor: 'from-purple-500 to-orange-500',
    title: 'AirPods Max Studio',
    titleHighlight: 'Space Black Edition',
    description: 'High-fidelity audio, spatial audio with dynamic head tracking, and premium breathable knit-mesh canopy.',
    price: 68000,
    originalPrice: 80000,
    discountBadge: 'Save ৳12,000',
    ctaText: 'Add to Cart',
    ctaLink: '/cart',
    secondaryCtaText: 'Explore Audio',
    secondaryCtaLink: '/products?category=Audio',
    productPayload: {
      id: 'prod_airpods_max',
      title: 'Apple AirPods Max Wireless Headphone',
      price: 68000,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    },
  },
];

// 4 Fast-Moving & Low-Stock Best Buy Items directly inside Hero
const FLASH_VAULT_PRODUCTS = [
  {
    id: 'prod_mx_master',
    title: 'Logitech MX Master 3S',
    subtitle: '8K DPI Ergonomic Quiet Mouse',
    price: 11500,
    originalPrice: 14500,
    discount: '-20%',
    stockLeft: 2,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
  },
  {
    id: 'prod_anker_prime',
    title: 'Anker Prime 200W GaN',
    subtitle: '20,000mAh Ultra Fast Powerbank',
    price: 14200,
    originalPrice: 17500,
    discount: '-18%',
    stockLeft: 4,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1609592807908-f1f3e74653fa?w=500',
  },
  {
    id: 'prod_marshall_emberton',
    title: 'Marshall Emberton II',
    subtitle: '30+ Hours Portable Stereo Speaker',
    price: 18500,
    originalPrice: 23800,
    discount: '-22%',
    stockLeft: 3,
    rating: 4.9,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
  },
  {
    id: 'prod_dji_pocket3',
    title: 'DJI Osmo Pocket 3',
    subtitle: '4K/120fps 1-Inch Sensor Gimbal',
    price: 64000,
    originalPrice: 85000,
    discount: '-25%',
    stockLeft: 3,
    rating: 5.0,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
  },
];

const CATEGORY_CHIPS = [
  { label: '🎧 Audiophile Gear', href: '/products?category=Audio' },
  { label: '⌨️ Custom Keyboards', href: '/products?category=Keyboards' },
  { label: '💻 Desk Setups', href: '/products?category=Accessories' },
  { label: '⚡ Flash Deals (40% OFF)', href: '/flash-sales' },
  { label: '🔥 Trending Best Sellers', href: '/products' },
  { label: '📦 All Catalog Gear', href: '/products' },
];

const LIVE_NOTICES = [
  '🔥 ১৮ জন ক্রেতা গত ১ ঘণ্টায় হেডফোন ও কিবোর্ড অর্ডার করেছেন!',
  '⚡ আজ ১৪০+ পার্সেল পাঠাও এক্সপ্রেসের মাধ্যমে সফলভাবে ডিসপ্যাচ হয়েছে!',
  '💳 NEXUS10 কুপনে বিকাশ ও নগদ পেমেন্টে পাচ্ছেন ১০% ইনস্ট্যান্ট ক্যাশব্যাক!',
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [noticeIndex, setNoticeIndex] = useState(0);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  const { addItem, openDrawer } = useCartStore();

  // Timer Tick
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

  // Notice Ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setNoticeIndex((prev) => (prev + 1) % LIVE_NOTICES.length);
    }, 4500);
    return () => clearInterval(ticker);
  }, []);

  // Auto Slider with Pause on Hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setSelectedColorIdx(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setSelectedColorIdx(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    setSelectedColorIdx(0);
  }, []);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleAddToCart = (product: { id: string; title: string; price: number; image: string }) => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: 15,
      vendorName: 'ShopNexus Official Store',
    });
    setAddedItemName(product.title);
    setTimeout(() => setAddedItemName(null), 3000);
    openDrawer();
  };

  const slide = HERO_SLIDES[currentSlide];
  const TagIcon = slide.tagIcon;
  const currentImg = slide.colors ? slide.colors[selectedColorIdx].img : (slide.productPayload?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');

  return (
    <div className="relative pt-3 sm:pt-4 space-y-5">
      {/* 🚀 0. LIVE SOCIAL PROOF & URGENCY TICKER STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
            <span className="truncate">{LIVE_NOTICES[noticeIndex]}</span>
          </div>
          <Link
            href="/flash-sales"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0"
          >
            Live Flash Deals <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* 🌟 1. HERO POWERHOUSE STAGE (SPLIT-HERO CAROUSEL & 4-PRODUCT FLASH VAULT) */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Campaign Mega Slider (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-orange-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[460px] sm:min-h-[500px]">
            {/* Background Glow Orb */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Slide Badge & Countdown Timer */}
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold shadow-xs">
                <TagIcon className="w-3.5 h-3.5 animate-pulse" />
                <span>{slide.tag}</span>
              </div>

              {slide.id === 1 && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-bold text-slate-800 dark:text-white shadow-xs">
                  <Timer className="w-3.5 h-3.5 text-orange-500" />
                  <span>Ends in:</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              )}
            </div>

            {/* Slide Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 relative z-10">
              {/* Text Side (7 cols) */}
              <div className="md:col-span-7 space-y-3.5 text-left">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                    {slide.discountBadge}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                    {slide.title} <br />
                    <span className="bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ffaa00] bg-clip-text text-transparent">
                      {slide.titleHighlight}
                    </span>
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed line-clamp-3">
                  {slide.description}
                </p>

                {/* Color Swatches if available */}
                {slide.colors && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Color: <span className="text-orange-600 dark:text-orange-400">{slide.colors[selectedColorIdx].name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {slide.colors.map((c, idx) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                            selectedColorIdx === idx
                              ? 'border-orange-500 scale-110 ring-2 ring-orange-500/30'
                              : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {selectedColorIdx === idx && (
                            <Check className={`w-3.5 h-3.5 ${c.hex === '#e2e8f0' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voucher Code Box if available */}
                {slide.voucherCode && (
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-orange-500/40 flex items-center justify-between gap-3 max-w-sm shadow-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Voucher Code</span>
                      <span className="font-mono text-sm font-black text-orange-600 dark:text-orange-400 tracking-wider">
                        {slide.voucherCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyVoucher(slide.voucherCode!)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}

                {/* Specs chips if available */}
                {slide.specs && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {slide.specs.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing & CTA Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {slide.price > 0 && (
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        ৳{slide.price.toLocaleString()}
                      </span>
                      {slide.originalPrice > 0 && (
                        <span className="text-xs line-through text-slate-400 dark:text-slate-500">
                          ৳{slide.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {slide.productPayload ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart({ ...slide.productPayload!, image: currentImg })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {slide.ctaText}
                    </button>
                  ) : (
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      {slide.ctaText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    href={slide.secondaryCtaLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>
              </div>

              {/* Product Visual Showcase (5 cols) */}
              <div className="md:col-span-5 flex items-center justify-center relative group">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-orange-500/10 via-transparent to-amber-500/10 border border-orange-500/20 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={currentImg}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover rounded-2xl"
                    unoptimized
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-[10px] border border-white/20">
                    Official Flagship
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Slider Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800/80 relative z-10">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlide(idx);
                      setSelectedColorIdx(0);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx
                        ? 'w-8 bg-gradient-to-r from-[#ff4400] to-[#ff7700]'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    title={`Go to Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Prev/Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 transition-all cursor-pointer shadow-xs"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 transition-all cursor-pointer shadow-xs"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ⚡ Right Side: Best Buy & Low-Stock Flash Vault (5 cols - 4 Live Product Grid) */}
          <div className="lg:col-span-5 rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-white via-slate-50 to-orange-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-2xl flex flex-col justify-between space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  <Flame className="w-4 h-4 fill-current" />
                </span>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    Best Buy Flash Vault
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Fast Selling • Low Stock Deals</p>
                </div>
              </div>

              <Link
                href="/flash-sales"
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 4 Interactive Mini Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
              {FLASH_VAULT_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative p-2.5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-orange-500/60 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-1.5">
                    {/* Top image & discount badge */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <Image
                        src={prod.image}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-black text-[9px] shadow-sm">
                        {prod.discount}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{prod.rating}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{prod.subtitle}</p>
                    </div>

                    {/* Stock meter */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-500">Stock:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{prod.stockLeft} left!</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (5 - prod.stockLeft) * 25)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price & 1-Click Plus Button */}
                  <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-xs text-slate-900 dark:text-white block">
                        ৳{prod.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] line-through text-slate-400 font-mono">
                        ৳{prod.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart({
                          id: prod.id,
                          title: prod.title,
                          price: prod.price,
                          image: prod.image,
                        })
                      }
                      className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-md shadow-orange-500/20 active:scale-90 cursor-pointer"
                      title="1-Click Add to Cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 2. VALUE PROPOSITION BAR (4 TRUST PILLARS WITH ACCURATE BD LOGISTICS CHARGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5 group hover:border-orange-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">২৪ ঘণ্টার এক্সপ্রেস ডেলিভারি</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                ঢাকার ভেতরে মাত্র <strong className="text-orange-600 dark:text-orange-400 font-mono">৳৬০</strong> / সারাদেশে <strong className="text-orange-600 dark:text-orange-400 font-mono">৳১২০</strong>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5 group hover:border-orange-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">বিকাশ, নগদ ও COD</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                ইনস্ট্যান্ট ক্যাশব্যাক অথবা পণ্য হাতে পেয়ে ক্যাশ অন ডেলিভারি
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5 group hover:border-orange-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">৭ দিনের সহজ রিটার্ন</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                কোনো ঝামেলা ছাড়াই ১০০% মানি-ব্যাক ও রিপ্লেসমেন্ট সুবিধা
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5 group hover:border-orange-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">১ বছরের অফিশিয়াল ওয়ারেন্টি</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                ১০০% জেনুইন অথেনটিক গ্যাজেট ও ২৪/৭ লাইভ কাস্টমার সাপোর্ট
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 3. ONE-TAP CATEGORY FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Quick Explore:
          </span>
          {CATEGORY_CHIPS.map((chip, idx) => (
            <Link
              key={idx}
              href={chip.href}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer active:scale-95"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
