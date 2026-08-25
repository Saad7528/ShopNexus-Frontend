'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { HeroSection } from '@/components/home/HeroSection';
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
} from 'lucide-react';

const FEATURED_CATEGORIES = [
  {
    name: 'Audio & Acoustics',
    slug: 'Audio',
    icon: Headphones,
    itemCount: '1,240 items',
  },
  {
    name: 'Smart Wearables',
    slug: 'Wearables',
    icon: Watch,
    itemCount: '890 items',
  },
  {
    name: 'Keyboards & Peripherals',
    slug: 'Peripherals',
    icon: Gamepad2,
    itemCount: '640 items',
  },
  {
    name: 'Smart Home & Living',
    slug: 'Smart Home',
    icon: Tv,
    itemCount: '520 items',
  },
];

const SHOWCASE_PRODUCTS = [
  {
    _id: 'prod-001',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh-1000xm5-anc-headphones',
    description: 'Studio-grade spatial audio with 40-hour ultra battery life and pure titanium drivers.',
    category: 'Audio',
    brand: 'Sony',
    price: 38500,
    discountPrice: 32500,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 16,
    averageRating: 4.9,
    totalReviews: 248,
    tags: ['wireless', 'noise-cancelling', 'bluetooth 5.3'],
  },
  {
    _id: 'prod-002',
    title: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
    slug: 'apple-watch-ultra-2',
    description: 'Precision aerospace titanium casing with continuous biometric health tracking and dual-frequency GPS.',
    category: 'Wearables',
    brand: 'Apple',
    price: 88900,
    discountPrice: 79900,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 5.0,
    totalReviews: 184,
    tags: ['wearable', 'gps', 'cellular'],
  },
  {
    _id: 'prod-003',
    title: 'Keychron Q1 Pro Custom QMK Wireless Mechanical Keyboard',
    slug: 'keychron-q1-pro-mechanical-keyboard',
    description: 'Full aluminum body with hot-swappable switches, double-gasket acoustic mounting, and south-facing RGB.',
    category: 'Peripherals',
    brand: 'Keychron',
    price: 24500,
    discountPrice: 21900,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: false,
    flashSaleDiscountPercent: 0,
    averageRating: 4.8,
    totalReviews: 92,
    tags: ['mechanical', 'hot-swap', 'wireless'],
  },
  {
    _id: 'prod-004',
    title: 'Philips Hue Smart Gradient Ambiance Lightstrip (2M)',
    slug: 'philips-hue-gradient-lightstrip-2m',
    description: 'Seamless blending of multiple vibrant light colors simultaneously with Matter and HomeKit support.',
    category: 'Smart Home',
    brand: 'Philips Hue',
    price: 13900,
    discountPrice: 11900,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: false,
    flashSaleDiscountPercent: 0,
    averageRating: 4.7,
    totalReviews: 64,
    tags: ['smart-lighting', 'homekit', 'matter'],
  },
];

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
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [couponUnlocked, setCouponUnlocked] = useState(false);

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
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* 🌟 1. WORLD-CLASS HYPER-INTERACTIVE HERO SECTION */}
      <HeroSection />

      {/* 🏷️ 3. CURATED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Curated Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse premium acoustics, wearables, and custom peripherals</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{cat.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{cat.itemCount}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ⚡ 4. FLASH DEALS WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-amber-500/10 dark:via-orange-500/10 dark:to-rose-500/10 border border-orange-200 dark:border-orange-500/20 shadow-sm dark:shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Zap className="w-6 h-6 fill-current animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Flash Deals & Limited Drops</h2>
                <p className="text-xs text-slate-600 dark:text-orange-300/80">Save up to 40% on verified hardware before timer resets</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 dark:text-orange-400">{String(timeLeft.hours).padStart(2, '0')}h</span> :
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
              <span className="text-rose-500 dark:text-rose-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOWCASE_PRODUCTS.map((prod) => (
              <ProductCard key={prod._id} product={prod as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 5. BEST-SELLING COMPACT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Top Rated Hardware
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Best Sellers of the Week</h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1">
            Shop Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOWCASE_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 🤖 6. 5 AI SUPERPOWERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              Autonomous Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">The 5 AI Superpowers of ShopNexus</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Next-generation machine learning and generative vision embedded directly into your shopping flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {AI_SUPERPOWERS.map((ai, i) => {
              const Icon = ai.icon;
              return (
                <div
                  key={ai.title}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mb-1">
                      {ai.tag}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-2">{ai.title}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{ai.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    Feature 0{i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 💎 7. BRAND STORY / WHY SHOPNEXUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-slate-50 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#090d16] border border-orange-200/80 dark:border-slate-800 shadow-sm dark:shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Why Choose ShopNexus</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              Direct-from-Brand Quality & Precision Engineering
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Unlike fragmented marketplaces, ShopNexus operates as an authoritative single-brand ecosystem. Every acoustic headphone, custom keyboard switch, and smart wearable passes strict quality testing before reaching your hands.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>100% Genuine Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Official Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Instant 24/7 AI Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Real-Time Parcel Tracker</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000&q=80"
              alt="ShopNexus Precision Engineering"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 💬 8. CUSTOMER REVIEWS & 3D TESTIMONIAL SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-3">
            Voices of Success
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Join thousands of global enthusiasts scaling their hardware setup with{' '}
            <span className="font-bold text-orange-600 dark:text-orange-400">ShopNexus</span>.
          </p>
        </div>

        <TestimonialSlider />
      </section>

      {/* 🎁 9. VIP NEWSLETTER & COUPON GENERATOR BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#090d16] border border-orange-300/80 dark:border-orange-500/30 text-center shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
              VIP Club Drops
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Subscribe to the ShopNexus dispatch for exclusive drops, early flash sale invites, and private discount codes.
            </p>

            {couponUnlocked ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold animate-pulse">
                🎉 Welcome to the Club! Use coupon code: <span className="font-mono underline text-slate-900 dark:text-white">NEXUS10</span> during checkout for 10% discount!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
                >
                  Unlock 10% OFF
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
