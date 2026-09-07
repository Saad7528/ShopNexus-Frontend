'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { HeroSection } from '@/components/home/HeroSection';
import { ComboDealsSection } from '@/components/home/ComboDealsSection';
import { ALL_PRODUCTS } from '@/data/products';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck,
  TrendingUp,
  Star,
  Award,
  Layers,
  Headphones,
  Smartphone,
  Gamepad2,
  Watch,
  Tv,
  CheckCircle2,
  Camera,
  Bot,
  Tag,
  Clock,
  RotateCcw,
  Lock,
  Mail,
  Send,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';

import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

const AUDIO_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Audio').slice(0, 5);
const WEARABLE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Wearables').slice(0, 5);
const PERIPHERAL_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Peripherals').slice(0, 5);
const CREATOR_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Creator Gear' || p.category === 'Smart Home').slice(0, 5);
const FLASH_PRODUCTS = ALL_PRODUCTS.filter((p) => p.isFlashSale).slice(0, 5);

const AI_SUPERPOWERS = [
  {
    title: 'Instant Visual Search',
    icon: Camera,
    desc: 'Drop any snapshot or camera image to locate visually similar hardware in milliseconds.',
    tag: 'Computer Vision',
  },
  {
    title: 'Personalized Recommendations',
    icon: Sparkles,
    desc: 'Dynamic neural scoring matches catalog items directly to your browsing taste and active cart.',
    tag: 'Real-Time Vector',
  },
  {
    title: '24/7 AI Shopping Assistant',
    icon: Bot,
    desc: 'Ask questions, filter by budget, or request product comparisons with our multi-model AI.',
    tag: 'Gemini + Groq',
  },
  {
    title: 'Dynamic Demand Pricing',
    icon: Zap,
    desc: 'Real-time algorithm evaluates catalog inventory thresholds and schedules flash deal savings.',
    tag: 'Smart Pricing',
  },
  {
    title: 'AI Descriptions & SEO Tags',
    icon: Tag,
    desc: 'Generative AI synthesizes deep specification summaries and discoverability tags.',
    tag: 'Generative Copy',
  },
];

export default function HomePage() {
  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [couponUnlocked, setCouponUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setCouponUnlocked(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      {/* 🌟 1. HERO SECTION (Compact on Mobile, Expansive on Desktop) */}
      <HeroSection />

      {/* ⚡ 2. MEGA FLASH DEALS (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="p-3.5 sm:p-6 rounded-3xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10 border border-orange-200 dark:border-orange-500/20 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-bounce" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {mounted ? t('home_flash_title') : 'Flash Deals & Drops'}
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-orange-300/80 truncate">
                  {mounted ? t('home_flash_desc') : 'Save up to 40% on verified hardware'}
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
              <Clock className="w-3 h-3 text-orange-500 hidden xs:inline" />
              <span className="text-orange-600 dark:text-orange-400">
                {mounted && language === 'bn' ? toBengaliNumber(String(timeLeft.hours).padStart(2, '0')) : String(timeLeft.hours).padStart(2, '0')}h
              </span>:
              <span>
                {mounted && language === 'bn' ? toBengaliNumber(String(timeLeft.minutes).padStart(2, '0')) : String(timeLeft.minutes).padStart(2, '0')}m
              </span>:
              <span className="text-rose-500 dark:text-rose-400">
                {mounted && language === 'bn' ? toBengaliNumber(String(timeLeft.seconds).padStart(2, '0')) : String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {FLASH_PRODUCTS.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 3. ULTRA-COMPACT 4 TRUST PILLARS (Placed Directly Beneath Flash Deals) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                {mounted ? t('pillar_delivery_title') : '24-48h Fast Delivery'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {mounted ? t('pillar_delivery_desc') : 'Dhaka ৳60 / Outside ৳120'}
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                {mounted ? (language === 'bn' ? 'বিকাশ ও নগদ ক্যাশব্যাক' : 'bKash & Nagad Pay') : 'bKash & Nagad Pay'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {mounted ? (language === 'bn' ? '১০% ক্যাশব্যাক ও COD' : '10% Cashback & COD') : '10% Cashback'}
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                {mounted ? t('pillar_return_title') : '7 Days Easy Return'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {mounted ? t('pillar_return_desc') : 'Hassle-Free Replacement'}
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                {mounted ? t('pillar_warranty_title') : '100% Genuine & Warranty'}
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {mounted ? t('pillar_warranty_desc') : 'Official Brand Warranties'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎧 4. AUDIO & ACOUSTICS SECTION (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Headphones className="w-3.5 h-3.5" />
              {mounted ? (language === 'bn' ? 'অডিও ও সাউন্ড' : 'Audiophile Sound') : 'Audiophile Sound'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mounted ? t('home_audio_title') : 'Premium Acoustics & Headsets'}
            </h2>
          </div>
          <Link href="/products?category=Audio" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {mounted ? t('btn_view_all') : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {AUDIO_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌚ 5. TITANIUM WEARABLES & WATCHES (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Watch className="w-3.5 h-3.5" />
              {mounted ? (language === 'bn' ? 'অ্যারোস্পেস টাইটানিয়াম' : 'Aerospace Titanium') : 'Aerospace Titanium'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mounted ? t('home_wearables_title') : 'Smartwatches & Fitness Trackers'}
            </h2>
          </div>
          <Link href="/products?category=Wearables" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {mounted ? t('btn_view_all') : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {WEARABLE_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌨️ 6. MECHANICAL KEYBOARDS & WORKSPACE (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              {mounted ? (language === 'bn' ? 'কাস্টম আরগোনোমিক্স' : 'Custom Ergonomics') : 'Custom Ergonomics'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mounted ? t('home_peripherals_title') : 'Keyboards & Performance Mice'}
            </h2>
          </div>
          <Link href="/products?category=Peripherals" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {mounted ? t('btn_view_all') : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {PERIPHERAL_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 🏠 7. SMART HOME & CREATOR GEAR (2-Column Mobile Grid) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Tv className="w-3.5 h-3.5" />
              {mounted ? (language === 'bn' ? 'স্মার্ট লিভিং ও গ্যাজেট' : 'Smart Living & Gear') : 'Smart Living'}
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mounted ? (language === 'bn' ? 'স্মার্ট হোম ও ক্যামেরা গিয়ার' : 'Cameras & Creator Peripherals') : 'Cameras & Creator Peripherals'}
            </h2>
          </div>
          <Link href="/products?category=Smart+Home" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            {mounted ? t('btn_view_all') : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {CREATOR_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 🔥 EXCLUSIVE COMBO BUNDLES & LOYALTY REWARDS SECTION */}
      <ComboDealsSection />

      {/* 🤖 8. 5 AI SUPERPOWERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              {mounted ? (language === 'bn' ? 'অটোনোমাস ইন্টেলিজেন্স' : 'Autonomous Intelligence') : 'Autonomous Intelligence'}
            </span>
            <h2 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {mounted ? t('home_ai_title') : '5 AI Superpowers of ShopNexus'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {mounted ? t('home_ai_desc') : 'Next-generation machine learning and generative vision embedded into your shopping experience.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {AI_SUPERPOWERS.map((ai, i) => {
              const Icon = ai.icon;
              return (
                <div
                  key={ai.title}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-2">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mb-0.5">
                      {ai.tag}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{ai.title}</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">{ai.desc}</p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                    Feature 0{i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 💬 9. CUSTOMER REVIEWS & 3D TESTIMONIAL SLIDER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1.5">
            {mounted ? (language === 'bn' ? 'গ্রাহক রিভিউ' : 'Customers Reviews') : 'Customers Reviews'}
          </span>
          <h2 className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {mounted ? (language === 'bn' ? 'গ্রাহকদের বাস্তব অভিজ্ঞতা ও মতামত' : 'What Our Customers Say') : 'What Our Customers Say'}
          </h2>
        </div>

        <TestimonialSlider />
      </section>

      {/* 🎁 10. VIP NEWSLETTER & COUPON GENERATOR BANNER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden p-5 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#090d16] border border-orange-300/80 dark:border-orange-500/30 text-center shadow-xl">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-orange-500/30">
              {mounted ? (language === 'bn' ? 'ভিআইপি ডিসপ্যাচ ক্লাব' : 'VIP Club Drops') : 'VIP Club Drops'}
            </span>
            <h2 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white">
              {mounted ? (language === 'bn' ? 'পরবর্তী অর্ডারে ১০% ছাড় পান' : 'Get 10% Off Your Next Order') : 'Get 10% Off Your Next Order'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {mounted ? t('newsletter_desc') : 'Subscribe to the ShopNexus dispatch for exclusive drops, early flash sale invites, and private discount codes.'}
            </p>

            {couponUnlocked ? (
              <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {mounted ? t('newsletter_success') : 'Voucher Code NEXUS10 unlocked! Apply at checkout for 10% off.'}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={mounted ? t('newsletter_placeholder') : 'Enter your email address...'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> {mounted ? (language === 'bn' ? '১০% ছাড় আনলক করুন' : 'Unlock 10% Off') : 'Unlock 10% Off'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
