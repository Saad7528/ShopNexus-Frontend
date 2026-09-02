'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Zap,
  ArrowRight,
  Truck,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
  Timer,
  Wallet,
  Keyboard,
  Percent,
  Coins,
  Gift,
  Crown,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface SlideData {
  id: number;
  tag: string;
  tagIcon: any;
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
    title: 'Sony WH-1000XM5',
    titleHighlight: 'Acoustic Precision',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and crystal-clear sound.',
    price: 32500,
    originalPrice: 38000,
    discountBadge: 'Save ৳5,500',
    ctaText: 'Add to Cart',
    ctaLink: '/cart',
    secondaryCtaText: 'All Flash Deals',
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
    title: '10% Extra Cashback',
    titleHighlight: 'bKash & Nagad Pay',
    description: 'Enjoy instant 10% cashback (up to ৳1,500) on all hardware & audio purchases with code NEXUS10 at checkout.',
    price: 1500,
    originalPrice: 0,
    discountBadge: '10% Instant Voucher',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    secondaryCtaText: 'Apply at Checkout',
    secondaryCtaLink: '/checkout',
    voucherCode: 'NEXUS10',
    colors: [
      { name: 'Digital Voucher', hex: '#ec4899', img: '/images/bkash_nagad_cashback.jpg' },
    ],
  },
  {
    id: 3,
    tag: 'WORKSTATION ESSENTIAL',
    tagIcon: Keyboard,
    title: 'Keychron Q1 Pro',
    titleHighlight: 'CNC Custom Mechanical',
    description: 'Full aluminum body, wireless Bluetooth 5.1 & Type-C wired, hot-swappable switches, and programmable VIA keymaps.',
    price: 17900,
    originalPrice: 21500,
    discountBadge: 'Save ৳3,600',
    ctaText: 'Add to Cart',
    ctaLink: '/cart',
    secondaryCtaText: 'View Keyboards',
    secondaryCtaLink: '/products?category=Peripherals',
    specs: ['CNC Aluminum', 'Hot-Swappable', 'Wireless + Wired'],
    productPayload: {
      id: 'prod_keychron_q1',
      title: 'Keychron Q1 Pro Custom Keyboard',
      price: 17900,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    },
    colors: [
      { name: 'Carbon Black', hex: '#1e293b', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800' },
      { name: 'Retro White', hex: '#f8fafc', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800' },
    ],
  },
];

const CATEGORY_CHIPS = [
  { label: '⚡ Flash Deals', href: '/flash-sales' },
  { label: '🎧 Audio & Sound', href: '/products?category=Audio' },
  { label: '⌚ Smartwatches', href: '/products?category=Wearables' },
  { label: '⌨️ Keyboards & Mice', href: '/products?category=Peripherals' },
  { label: '🏠 Smart Home', href: '/products?category=Smart+Home' },
  { label: '📦 All Catalog', href: '/products' },
];

const LIVE_NOTICES = [
  '🔥 ১৮ জন ক্রেতা গত ১ ঘণ্টায় হেডফোন ও কিবোর্ড অর্ডার করেছেন!',
  '⚡ আজ ১৪০+ পার্সেল পাঠাও এক্সপ্রেসের মাধ্যমে সফলভাবে ডিসপ্যাচ হয়েছে!',
  '🛡️ সারাদেশে মাত্র ২৪-৪৮ ঘণ্টায় নিশ্চিত ডেলিভারি ও রিয়েল-টাইম ট্র্যাকিং!',
  '📦 গত ২৪ ঘণ্টায় ৩৫০+ জেনুইন গ্যাজেট ডেলিভারি সফলভাবে সম্পন্ন হয়েছে!',
];

import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [noticeIndex, setNoticeIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const liveNotices = [
    t('ticker_1'),
    t('ticker_2'),
    t('ticker_3'),
    t('ticker_4'),
  ];

  const categoryChips = [
    { label: t('cat_flash_deals'), href: '/flash-sales' },
    { label: t('cat_audio'), href: '/products?category=Audio' },
    { label: t('cat_wearables'), href: '/products?category=Wearables' },
    { label: t('cat_peripherals'), href: '/products?category=Peripherals' },
    { label: t('cat_smart_home'), href: '/products?category=Smart+Home' },
    { label: t('cat_all_catalog'), href: '/products' },
  ];

  // Auth & Real Coin System
  const { user, isAuthenticated, processDailyVisit, claimVipPass } = useAuthStore();
  const [streakNotification, setStreakNotification] = useState<{ msg: string; coins: number; streak: number } | null>(null);
  const [vipModalInfo, setVipModalInfo] = useState<{ isOpen: boolean; currentCoins: number; neededCoins: number } | null>(null);
  const [vipSuccessToast, setVipSuccessToast] = useState<string | null>(null);

  const adCardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  const { addItem } = useCartStore();

  // 10-Second Website Engagement Detection for Daily Streak Reward
  useEffect(() => {
    if (!isAuthenticated) return;
    const engagementTimer = setTimeout(() => {
      const result = processDailyVisit();
      if (result.rewarded) {
        setStreakNotification({
          msg: `🎉 ডেইলি রিওয়ার্ড আনলকড! স্ট্রিক: দিন ${result.streak}`,
          coins: result.coinsAdded,
          streak: result.streak,
        });
        setTimeout(() => setStreakNotification(null), 6000);
      }
    }, 10000); // 10 seconds of presence
    return () => clearTimeout(engagementTimer);
  }, [isAuthenticated, processDailyVisit]);

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
      setNoticeIndex((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(ticker);
  }, []);

  // Slide Auto Advance (3 Seconds per slide)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setSelectedColorIdx(0);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setSelectedColorIdx(0);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];
  const TagIcon = slide.tagIcon;
  const currentImg = slide.colors ? slide.colors[selectedColorIdx].img : slide.productPayload?.image || '';

  const handleAddToCart = (item: { id: string; title: string; price: number; image: string }) => {
    addItem({
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: 10,
      vendorName: 'ShopNexus Official',
    });
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Black Friday 3D Reactive Hover Handler
  const handleAdMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!adCardRef.current) return;
    const rect = adCardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setMousePos({ x, y });
  };

  const handleAdMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // 500 Coins VIP Pass Claim Handler
  const handleVipPassClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login?redirect=/');
      return;
    }

    const currentCoins = user?.nexusCoins || 0;
    if (user?.isVipMember) {
      setVipSuccessToast(language === 'bn' ? '👑 আপনার VIP মেম্বারশিপ ইতিমধ্যে সক্রিয় আছে!' : '👑 Your VIP Membership is already active!');
      setTimeout(() => setVipSuccessToast(null), 3000);
      return;
    }

    if (currentCoins < 500) {
      setVipModalInfo({
        isOpen: true,
        currentCoins,
        neededCoins: 500 - currentCoins,
      });
    } else {
      const res = claimVipPass();
      if (res.success) {
        setVipSuccessToast(res.message);
        setTimeout(() => setVipSuccessToast(null), 5000);
      }
    }
  };

  const currentCoins = user?.nexusCoins || 0;
  const isVip = !!user?.isVipMember;
  const loginStreak = user?.loginStreak || 1;

  return (
    <div className="space-y-2.5 mt-2.5 sm:mt-3.5 sm:space-y-3.5 relative">
      {/* 🔔 1. LIVE SOCIAL PROOF TICKER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-md">
          <div className="min-w-0 truncate">
            <span>{mounted ? liveNotices[noticeIndex] : '🔥 Live Shopping Drops'}</span>
          </div>
          <Link
            href="/flash-sales"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0"
          >
            {mounted ? t('banner_live_deals') : 'Live Flash Deals'} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* 🌟 2. ANIMATED MEGA CAMPAIGN BANNER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#ffaa00] via-[#ff7700] to-[#ff3300] p-2.5 sm:p-3 text-white shadow-md shadow-orange-500/20 border border-amber-300/40">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Left: Campaign Title & Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex items-center gap-1.5 shrink-0">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-bounce" />
                <span>{mounted ? t('banner_payday_sale') : 'PAYDAY MEGA SALE'}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-orange-600 font-extrabold text-[11px] sm:text-xs shadow-xs transform hover:scale-105 transition-transform shrink-0">
                <Percent className="w-3.5 h-3.5 text-rose-500" />
                <span>{mounted ? t('banner_up_to_80') : 'UP TO 80% OFF'}</span>
              </div>

              <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] sm:text-xs shadow-xs transform hover:scale-105 transition-transform shrink-0">
                <Truck className="w-3.5 h-3.5 animate-bounce" />
                <span>{mounted ? t('banner_free_delivery') : 'FREE DELIVERY'}</span>
              </div>

              <div className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-xl bg-rose-700 text-white font-extrabold text-[11px] sm:text-xs shadow-xs shrink-0">
                <span>{mounted ? t('banner_cashback') : '10% CASHBACK'}</span>
              </div>
            </div>

            {/* Right: Live status & Action */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-amber-200 border border-white/20">
                <span className="animate-pulse text-amber-300 font-extrabold tracking-wider">{mounted ? t('banner_sale_live') : 'SALE IS LIVE'}</span>
              </div>

              <Link
                href="/flash-sales"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-black text-amber-300 hover:text-white font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400/40"
              >
                <span>{mounted ? t('btn_shop_now') : 'SHOP NOW'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 3. DESKTOP HERO POWERHOUSE (2/3 Mega Slider + 1/3 Black Friday Interactive Ad Billboard) */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="hidden lg:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-12 gap-3.5 items-stretch">
          {/* 🌟 8 COLS (2/3 WIDTH): Main Campaign Mega Slider (Big Product Image & 3s Transition) */}
          <div className="col-span-8 relative rounded-2xl overflow-hidden bg-linear-to-br from-white via-slate-50 to-orange-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[270px]">
            {/* Top Bar: Slide Badge & Countdown Timer */}
            <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] font-bold">
                <TagIcon className="w-3 h-3 animate-pulse" />
                <span>{slide.tag}</span>
              </div>

              {slide.id === 1 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono font-bold text-slate-800 dark:text-white">
                  <Timer className="w-3 h-3 text-orange-500" />
                  <span>Ends:</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              )}
            </div>

            {/* Slide Content Grid */}
            <div className="grid grid-cols-12 gap-5 items-center my-1 relative z-10">
              {/* Text Side (7 cols) */}
              <div className="col-span-7 space-y-2 text-left">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                    {slide.discountBadge}
                  </span>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {slide.title}{' '}
                    <span className="bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ffaa00] bg-clip-text text-transparent">
                      {slide.titleHighlight}
                    </span>
                  </h1>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {slide.description}
                </p>

                {/* Color Swatches if available */}
                {slide.colors && slide.colors.length > 1 && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Color:</span>
                    <div className="flex items-center gap-1.5">
                      {slide.colors.map((c, idx) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`w-4 h-4 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                            selectedColorIdx === idx ? 'border-orange-500 scale-110 ring-2 ring-orange-500/30' : 'border-slate-300 dark:border-slate-700'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {selectedColorIdx === idx && (
                            <Check className={`w-2 h-2 ${c.hex === '#e2e8f0' || c.hex === '#f8fafc' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voucher Code Box if available */}
                {slide.voucherCode && (
                  <div className="p-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-orange-500/40 flex items-center justify-between gap-2 max-w-xs shadow-xs">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-semibold block">Voucher Code</span>
                      <span className="font-mono text-xs font-black text-orange-600 dark:text-orange-400 tracking-wider">
                        {slide.voucherCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyVoucher(slide.voucherCode!)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500 text-white font-bold text-[9px] shadow-xs hover:bg-orange-600 transition-all cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Pricing & CTA Actions */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {slide.price > 0 && (
                    <div className="flex items-baseline gap-1.5 font-mono mr-1">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ৳{slide.price.toLocaleString()}
                      </span>
                      {slide.originalPrice > 0 && (
                        <span className="text-[10px] line-through text-slate-400">
                          ৳{slide.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}

                  {slide.productPayload ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart({ ...slide.productPayload!, image: currentImg })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-xs shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {slide.ctaText}
                    </button>
                  ) : (
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-xs shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      {slide.ctaText} <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  <Link
                    href={slide.secondaryCtaLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
                  >
                    {slide.secondaryCtaText}
                  </Link>
                </div>
              </div>

              {/* Image Side (5 cols - Prominent Display) */}
              <div className="col-span-5 flex items-center justify-center relative">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-56 lg:h-56 rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-md p-3 flex items-center justify-center group">
                  <Image
                    src={currentImg}
                    alt={slide.title}
                    fill
                    priority
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Slider Navigation Dots */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800 relative z-10">
              <div className="flex items-center gap-1.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentSlide(idx);
                      setSelectedColorIdx(0);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-5 bg-gradient-to-r from-[#ff4400] to-[#ff7700]' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 🖤 4 COLS (1/3 WIDTH): NOVEMBER BLACK FRIDAY BILLBOARD (LIGHT & DARK ADAPTED) */}
          <div
            ref={adCardRef}
            onMouseMove={handleAdMouseMove}
            onMouseLeave={handleAdMouseLeave}
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="col-span-4 relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100/70 via-orange-50/90 to-amber-50/60 dark:from-[#0c0a1a] dark:via-[#140f2b] dark:to-[#0a0714] border-2 border-orange-300/80 dark:border-orange-500/40 hover:border-orange-500 dark:hover:border-amber-400 p-4 shadow-md flex flex-col justify-between group cursor-pointer"
          >
            <div className="absolute inset-0 opacity-15 dark:opacity-20 group-hover:opacity-25 transition-opacity bg-[radial-gradient(#ff6600_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 dark:bg-rose-600/30 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Event Badge */}
            <div className="relative z-10 flex items-center justify-between gap-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md animate-pulse">
                <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>NOV 2026 DROP</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isAuthenticated && (
                  <span className="text-[9px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/25">
                    🔥 দিন {loginStreak} স্ট্রিক
                  </span>
                )}
                <span className="text-[10px] font-mono font-black text-orange-600 dark:text-amber-400 bg-orange-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md border border-orange-500/30 dark:border-amber-400/30">
                  ৫০% - ৮০% OFF
                </span>
              </div>
            </div>

            {/* Middle: Theme & Daily Streak Rules */}
            <div className="relative z-10 my-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                  <Coins className="w-4 h-4 text-slate-950 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    Black Friday Mega Madness
                  </h3>
                  <span className="text-[10px] text-orange-600 dark:text-amber-300 font-bold block">
                    প্রতিদিন ভিজিটে ৫ কয়েন, টানা স্ট্রিকে আরও বেশি এবং VIP সুবিধা!
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                প্রতিদিন ১০ সেকেন্ড ভিজিটে জিতুন ৫ কয়েন (টানা স্ট্রিকে ১০ ও ১৫ কয়েন)। অর্জিত কয়েন দিয়ে কেনাকাটায় ডিসকাউন্ট উপভোগ করুন এবং মোট ৫০০ কয়েন হলে ব্ল্যাক ফ্রাইডেতে বিশাল VIP ডিসকাউন্ট আনলক করুন!
              </p>

              {/* Live Coin Vault / Claim Box */}
              <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5 border border-orange-200 dark:border-white/10 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                    Vault: <strong className="text-orange-600 dark:text-amber-400 font-mono text-xs">{currentCoins.toLocaleString()} Coins</strong>
                  </span>
                </div>
                {isVip ? (
                  <span className="text-[9px] text-amber-500 dark:text-amber-300 font-black bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" /> VIP UNLOCKED
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded">
                    {isAuthenticated ? `দিন ${loginStreak} সক্রিয়` : 'লগইন করুন'}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Action: Claim VIP Token */}
            <div className="relative z-10 pt-1">
              <button
                type="button"
                onClick={handleVipPassClick}
                className={`w-full py-2 px-3 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isVip
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400 shadow-emerald-600/30'
                    : currentCoins >= 500
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-slate-950 font-black shadow-orange-500/30'
                    : 'bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-500 hover:to-orange-500 text-white shadow-xs'
                }`}
              >
                {isVip ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-300 fill-current" />
                    <span>👑 VIP Active (৳200 Welcome Perk Unlocked)</span>
                  </>
                ) : currentCoins >= 500 ? (
                  <>
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim VIP Pass (500 Coins) ❯</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim VIP Pass (500 Coins Needed)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* 🌟 4. ONE-TAP CATEGORY FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Quick Explore:
          </span>
          {CATEGORY_CHIPS.map((chip, idx) => (
            <Link
              key={idx}
              href={chip.href}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-semibold shrink-0 transition-all shadow-2xs"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 🎁 DAILY 10-SEC ENGAGEMENT STREAK REWARD TOAST */}
      {streakNotification && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce max-w-sm">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl border border-amber-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 text-amber-200 animate-spin" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-xs">{streakNotification.msg}</h4>
              <p className="text-[11px] text-amber-100">
                +{streakNotification.coins} Nexus Coins আপনার অ্যাকাউন্টে জমা হয়েছে!
              </p>
            </div>
            <button
              onClick={() => setStreakNotification(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 👑 VIP ACTIVATION SUCCESS TOAST */}
      {vipSuccessToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top duration-300">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-[#140f2b] text-white border-2 border-amber-400 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-xs text-amber-300">Black Friday VIP Member</h4>
              <p className="text-[11px] text-slate-200 leading-snug">{vipSuccessToast}</p>
            </div>
            <button onClick={() => setVipSuccessToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ VIP PASS 500 COINS REQUIREMENT MODAL */}
      {vipModalInfo?.isOpen && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border-2 border-orange-500/40 p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setVipModalInfo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Gift className="w-7 h-7 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                ব্ল্যাক ফ্রাইডে VIP পাস আনলক
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ভিআইপি মেম্বারশিপ সক্রিয় করতে আপনার অ্যাকাউন্টে মোট <strong>৫০০ Nexus Coins</strong> প্রয়োজন।
              </p>
            </div>

            {/* Coin Progress Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">বর্তমান ব্যালান্স:</span>
                <span className="text-orange-600 dark:text-orange-400 font-mono">{vipModalInfo.currentCoins} Coins</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (vipModalInfo.currentCoins / 500) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>প্রয়োজন: ৫০০ Coins</span>
                <span className="text-rose-500 font-bold">আর প্রয়োজন {vipModalInfo.neededCoins} Coins</span>
              </div>
            </div>

            {/* How to earn streak info */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-700 dark:text-amber-300 text-left space-y-1">
              <span className="font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> প্রতিদিন কয়েন অর্জনের নিয়ম:
              </span>
              <ul className="list-disc list-inside text-[10px] space-y-0.5 text-slate-600 dark:text-slate-300">
                <li>১ম দিন ১০ সেকেন্ড ভিজিট: <strong>+৫ Coins</strong></li>
                <li>২য় দিন টানা ভিজিট: <strong>+১০ Coins</strong></li>
                <li>৩য় দিন ও পরবর্তী টানা প্রতিদিন: <strong>+১৫ Coins</strong></li>
                <li>একদিন গ্যাপ দিলে স্ট্রিক ১ম দিনে রিসেট হবে।</li>
              </ul>
            </div>

            <button
              onClick={() => setVipModalInfo(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white font-bold text-xs shadow-md shadow-orange-500/25 cursor-pointer"
            >
              বুঝেছি, প্রতিদিন ভিজিট করব!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
