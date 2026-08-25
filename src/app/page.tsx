'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
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
    gradient: 'from-blue-600/20 to-indigo-600/30',
    border: 'border-blue-500/30',
  },
  {
    name: 'Smart Wearables',
    slug: 'Wearables',
    icon: Watch,
    itemCount: '890 items',
    gradient: 'from-purple-600/20 to-pink-600/30',
    border: 'border-purple-500/30',
  },
  {
    name: 'Keyboards & Peripherals',
    slug: 'Peripherals',
    icon: Gamepad2,
    itemCount: '640 items',
    gradient: 'from-emerald-600/20 to-teal-600/30',
    border: 'border-emerald-500/30',
  },
  {
    name: 'Smart Home & Living',
    slug: 'Smart Home',
    icon: Tv,
    itemCount: '520 items',
    gradient: 'from-amber-600/20 to-orange-600/30',
    border: 'border-amber-500/30',
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
    averageRating: 4.9,
    totalReviews: 184,
    tags: ['oled', 'titanium', 'ecg', 'gps'],
  },
  {
    _id: 'prod-003',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    slug: 'keychron-q1-pro-mechanical-keyboard',
    description: 'Full CNC aluminum body, hot-swappable tactile switches, and south-facing RGB lighting.',
    category: 'Peripherals',
    brand: 'Keychron',
    price: 21500,
    discountPrice: 17900,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 112,
    tags: ['hot-swap', 'rgb', 'wireless', 'mechanical'],
  },
  {
    _id: 'prod-004',
    title: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    slug: 'bose-qc-ultra-spatial-headphones',
    description: 'Breakthrough spatialized audio with custom tuned active noise cancellation.',
    category: 'Audio',
    brand: 'Bose',
    price: 44500,
    discountPrice: 38900,
    stock: 9,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 12,
    averageRating: 4.8,
    totalReviews: 142,
    tags: ['spatial-audio', 'anc', 'comfort'],
  },
];

const AI_SUPERPOWERS = [
  {
    title: 'Personalized Recommendations',
    icon: Sparkles,
    desc: 'Dynamic neural scoring matches catalog items directly to your browsing taste and active cart.',
    tag: 'Real-Time Vector',
  },
  {
    title: 'Instant Visual Search',
    icon: Camera,
    desc: 'Drop any snapshot or camera image to locate visually similar hardware in milliseconds.',
    tag: 'Computer Vision',
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

const TESTIMONIALS = [
  {
    name: 'Sarah Rahman',
    role: 'Studio Audio Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    comment: 'The Sony WH-1000XM5 arrived within 24 hours with exact real-time parcel tracking. The soundstage and build are 100% authentic!',
    rating: 5,
  },
  {
    name: 'Tanvir Hossain',
    role: 'Software Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    comment: 'The AI Visual Search found the exact mechanical keyboard switch model I took a picture of at my friend’s desk. Flawless experience!',
    rating: 5,
  },
  {
    name: 'Nusrat Jahan',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    comment: 'Chatbot answered my budget queries instantly and helped me choose the Apple Watch Ultra 2 with a valid checkout coupon code.',
    rating: 5,
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/80 bg-slate-950">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>ShopNexus Official Single-Brand Commerce Hub</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            The Next-Gen <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Commerce & AI Ecosystem
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience ultra-fast shipping, curated official hardware, persistent real-time cart calculations, and 5 intelligent AI superpowers.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            >
              Explore Product Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/flash-sales"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-current" />
              View Flash Deals
            </Link>
          </div>

          {/* Stats Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl sm:text-2xl font-black text-white block">10k+</span>
              <span className="text-[11px] text-slate-400">Curated Hardware</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl sm:text-2xl font-black text-indigo-400 block">5 AI</span>
              <span className="text-[11px] text-slate-400">Superpower Features</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block">99.9%</span>
              <span className="text-[11px] text-slate-400">On-Time Delivery</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">4.9 ★</span>
              <span className="text-[11px] text-slate-400">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ 2. TRUST & VALUE PROPOSITIONS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Courier</h4>
              <p className="text-[11px] text-slate-500">Free delivery on orders $150+</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Returns</h4>
              <p className="text-[11px] text-slate-500">No questions asked policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 AI Assistant</h4>
              <p className="text-[11px] text-slate-500">Instant catalog recommendations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Secure</h4>
              <p className="text-[11px] text-slate-500">Encrypted checkout & Stripe</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ 3. CURATED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Curated Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Browse premium acoustics, wearables, and custom peripherals</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
                className={`group p-5 rounded-2xl bg-gradient-to-b ${cat.gradient} border ${cat.border} hover:scale-[1.02] transition-all duration-300 flex items-center gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                  <span className="text-[11px] text-slate-400">{cat.itemCount}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ⚡ 4. FLASH DEALS WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/20 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6 fill-current animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Flash Deals & Limited Drops</h2>
                <p className="text-xs text-amber-300/80">Save up to 40% on verified hardware before timer resets</p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">{String(timeLeft.hours).padStart(2, '0')}h</span> :
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
              <span className="text-rose-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Top Rated Hardware
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Best Sellers of the Week</h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Autonomous Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">The 5 AI Superpowers of ShopNexus</h2>
            <p className="text-xs text-slate-400 mt-2">
              Next-generation machine learning and generative vision embedded directly into your shopping flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {AI_SUPERPOWERS.map((ai, i) => {
              const Icon = ai.icon;
              return (
                <div
                  key={ai.title}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      {ai.tag}
                    </span>
                    <h3 className="font-bold text-white text-xs sm:text-sm mb-2">{ai.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{ai.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] font-semibold text-slate-500">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800">
          <div className="space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Why Choose ShopNexus</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Direct-from-Brand Quality & Precision Engineering
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Unlike fragmented marketplaces, ShopNexus operates as an authoritative single-brand ecosystem. Every acoustic headphone, custom keyboard switch, and smart wearable passes strict quality testing before reaching your hands.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Official Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant 24/7 AI Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Parcel Tracker</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000&q=80"
              alt="ShopNexus Precision Engineering"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 💬 8. CUSTOMER REVIEWS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Social Proof</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Trusted by 10,000+ Enthusiasts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">&ldquo;{t.comment}&rdquo;</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/80">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-slate-500">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎁 9. VIP NEWSLETTER & COUPON GENERATOR BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 text-center">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              VIP Club Drops
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Subscribe to the ShopNexus dispatch for exclusive drops, early flash sale invites, and private discount codes.
            </p>

            {couponUnlocked ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold animate-pulse">
                🎉 Welcome to the Club! Use coupon code: <span className="font-mono underline text-white">NEXUS10</span> during checkout for 10% discount!
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
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
