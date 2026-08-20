'use client';

import React from 'react';
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
  Store,
  Star,
  Award,
  Layers,
  Headphones,
  Smartphone,
  Gamepad2,
  Watch,
  Tv,
  CheckCircle2,
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
    name: 'Smartphones & Tech',
    slug: 'Electronics',
    icon: Smartphone,
    itemCount: '2,890 items',
    gradient: 'from-purple-600/20 to-pink-600/30',
    border: 'border-purple-500/30',
  },
  {
    name: 'Gaming & Peripherals',
    slug: 'Gaming',
    icon: Gamepad2,
    itemCount: '840 items',
    gradient: 'from-emerald-600/20 to-teal-600/30',
    border: 'border-emerald-500/30',
  },
  {
    name: 'Wearables & Health',
    slug: 'Wearables',
    icon: Watch,
    itemCount: '620 items',
    gradient: 'from-amber-600/20 to-orange-600/30',
    border: 'border-amber-500/30',
  },
];

const SHOWCASE_PRODUCTS = [
  {
    _id: 'prod-001',
    title: 'AuraSound Pro Active Noise-Cancelling Headphones',
    slug: 'aurasound-pro-anc-headphones',
    description: 'Studio-grade spatial audio with 40-hour ultra battery life and pure titanium drivers.',
    category: 'Audio',
    brand: 'PureSound',
    price: 299,
    discountPrice: 229,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'PureSound Audio Corp',
    isFlashSale: true,
    flashSaleDiscountPercent: 23,
    averageRating: 4.9,
    totalReviews: 128,
    tags: ['wireless', 'noise-cancelling', 'bluetooth 5.3'],
  },
  {
    _id: 'prod-002',
    title: 'Nexus Watch Ultra 2 OLED Smartwatch',
    slug: 'nexus-watch-ultra-2',
    description: 'Precision aerospace titanium casing with continuous biometric health tracking and ECG.',
    category: 'Electronics',
    brand: 'NexusTech',
    price: 499,
    discountPrice: 449,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'Nexus Official Store',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.8,
    totalReviews: 94,
    tags: ['oled', 'titanium', 'ecg', 'gps'],
  },
  {
    _id: 'prod-003',
    title: 'Apex RGB Mechanical Hot-Swap Keyboard',
    slug: 'apex-rgb-mechanical-keyboard',
    description: 'Custom lubed linear switches with sound-dampening silicone gasket and south-facing RGB.',
    category: 'Gaming',
    brand: 'NexusTech',
    price: 189,
    discountPrice: 149,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'Nexus Official Store',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 62,
    tags: ['mechanical', 'hot-swap', 'custom keyboard'],
  },
  {
    _id: 'prod-004',
    title: 'Studio True Wireless ANC Earbuds (Gen 3)',
    slug: 'studio-tw-earbuds-gen-3',
    description: 'Ultra-low latency wireless earbuds with custom dynamic drivers and IPX7 waterproofing.',
    category: 'Audio',
    brand: 'PureSound',
    price: 179,
    discountPrice: 139,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    vendorName: 'PureSound Audio Corp',
    isFlashSale: true,
    flashSaleDiscountPercent: 22,
    averageRating: 4.9,
    totalReviews: 87,
    tags: ['earbuds', 'waterproof', 'wireless charging'],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ShopNexus v1.0 • Multi-Vendor E-Commerce Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
              The Next-Gen{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Multi-Vendor
              </span>{' '}
              Commerce Hub
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Experience ultra-fast shopping, verified merchant storefronts, persistent real-time cart calculations, and atomic order checkouts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Product Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/flash-sales"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                View Flash Deals
              </Link>
            </div>

            {/* Live Platform KPI Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
                <span className="text-2xl sm:text-3xl font-black text-white">10K+</span>
                <p className="text-xs text-slate-400 mt-0.5">Curated Products</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
                <span className="text-2xl sm:text-3xl font-black text-indigo-400">500+</span>
                <p className="text-xs text-slate-400 mt-0.5">Verified Merchants</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">99.9%</span>
                <p className="text-xs text-slate-400 mt-0.5">On-Time Delivery</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
                <span className="text-2xl sm:text-3xl font-black text-purple-400">4.9★</span>
                <p className="text-xs text-slate-400 mt-0.5">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Featured Categories</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Explore top trending departments with instant filtering</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.border} backdrop-blur-xl hover:scale-[1.02] transition-all relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">{cat.itemCount}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-6 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  Shop department <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Deals & Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="w-4 h-4 fill-amber-400" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Trending & Flash Deals</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">High-demand audio gear and titanium electronics</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
          >
            View Full Catalog ({SHOWCASE_PRODUCTS.length}+ Items)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHOWCASE_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 4. Multi-Vendor Merchant Onboarding Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 p-8 sm:p-12 backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                <Store className="w-3.5 h-3.5" /> Merchant & Vendor Hub
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Scale Your Brand on ShopNexus Multi-Vendor Network
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Launch your customized storefront, access real-time analytics KPIs, manage inventories with atomic transactions, and reach thousands of verified buyers.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/vendor/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Enter Vendor Hub
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/vendor/settings"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Configure Storefront
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Merchant Perks</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  0% Commission for First 90 Days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Real-Time Sales & Revenue Charts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Automated Low-Stock Inventory Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Verified Buyer Review Badges
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Quality Assurances */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Tiered Express Shipping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enjoy free standard courier dispatch on all orders over $150.00, or choose next-day priority air delivery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">ACID Transaction Checkout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safe, atomic stock reservations backed by MongoDB sessions with Stripe, SSLCommerz, and COD support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Customer Reviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read authentic feedback and photo uploads from verified buyers with verified-purchaser trust badges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
