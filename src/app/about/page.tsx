import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  HelpCircle,
  ArrowRight,
  Lock,
  Headphones,
} from 'lucide-react';
import { FaqAccordion } from '@/components/about/FaqAccordion';
import { HashScrollHandler } from '@/components/about/HashScrollHandler';

export const metadata: Metadata = {
  title: 'About ShopNexus & FAQ | 100% Genuine Hardware Ecosystem',
  description:
    'Learn about ShopNexus fast nationwide delivery, 1-click guest checkout, 100% authentic manufacturer warranties, and frequently asked questions.',
};

export default function AboutAndFAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white scroll-smooth">
      <HashScrollHandler />

      {/* 1. HERO / ABOUT SECTION */}
      <section id="about-hero" className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 scroll-mt-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen E-Commerce Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Engineered for Speed, Reliability & <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
              100% Genuine Hardware
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            ShopNexus is Bangladesh’s premier technology storefront, built for instant 1-click guest ordering, transparent parcel tracking, and 100% manufacturer warranty.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#faq-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-orange-500" />
              Read FAQ
            </a>
          </div>
        </div>
      </section>

      {/* 🌟 2. PILLARS / HIGHLIGHTS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Why ShopNexus
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Built on 6 Trust Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Our core architectural commitments to reliability, fast delivery, and authentic hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1-Click Direct Guest Checkout
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero friction ordering. Place orders instantly with just your name, phone, and delivery address.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              24-48h Express Courier Dispatch
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Flat ৳60 inside Dhaka and ৳120 countrywide via Pathao Courier Express and Steadfast.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bank-Grade Secure Checkout
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              100% PCI-DSS compliant checkout supporting COD, bKash, Nagad, and global credit/debit cards.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Smart AI Bundle Savings (15% Off)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Frequently Bought Together smart bundles with automated flat 15% discount in one single click.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              24/7 Dedicated Support Desk
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct human support via WhatsApp and live chat for order queries and warranty assistance.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              100% Genuine & Money-Back Guarantee
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official manufacturer warranties and 7-day hassle-free replacement on any defect.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TRACKING QUICK BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Truck className="w-4 h-4" /> Live Tracking Portal
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Looking to Track Your Existing Parcel?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Check real-time courier movement and 24h dispatch milestone without logging in.
            </p>
          </div>
          <Link
            href="/track"
            className="shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section id="faq-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Quick answers to common questions about ordering, delivery, and payments:
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Ready to Experience Official Premium Hardware?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Browse our catalog, place 1-click orders with verified authentic warranties and express dispatch.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer"
            >
              Browse ShopNexus Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
