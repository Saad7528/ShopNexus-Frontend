import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { HeroSection } from '@/components/home/HeroSection';
import { ComboDealsSection } from '@/components/home/ComboDealsSection';
import { FlashDealsSection } from '@/components/home/FlashDealsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ALL_PRODUCTS } from '@/data/products';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Gamepad2,
  Watch,
  Tv,
  Camera,
  Bot,
  Zap,
  RotateCcw,
  Wallet,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ShopNexus | Next-Gen E-Commerce & Gadget Store',
  description:
    'ShopNexus is a high-performance e-commerce ecosystem delivering authentic mechanical keyboards, audiophile gear, wearables, and express nationwide delivery.',
};

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
    tag: 'Algorithmic Pricing',
  },
  {
    title: 'Automated Courier Tracking',
    icon: Truck,
    desc: 'Deep integration with courier logistics provides instant milestone SMS updates on dispatch.',
    tag: 'Live Telemetry',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      {/* 🌟 1. HERO SECTION */}
      <HeroSection />

      {/* ⚡ 2. MEGA FLASH DEALS */}
      <FlashDealsSection products={FLASH_PRODUCTS} />

      {/* 🌟 3. ULTRA-COMPACT 4 TRUST PILLARS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                24-48h Fast Delivery
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Dhaka ৳60 / Outside ৳120
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                bKash & Nagad Pay
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                10% Cashback & COD
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                7 Days Easy Return
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Hassle-Free Replacement
              </p>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 group hover:border-orange-500/40 transition-colors">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-xs truncate">
                100% Genuine & Warranty
              </h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Official Brand Warranties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎧 4. AUDIO & ACOUSTICS SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Headphones className="w-3.5 h-3.5" />
              Audiophile Sound
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Premium Acoustics & Headsets
            </h2>
          </div>
          <Link href="/products?category=Audio" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {AUDIO_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌚ 5. TITANIUM WEARABLES & WATCHES */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Watch className="w-3.5 h-3.5" />
              Aerospace Titanium
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Smartwatches & Fitness Trackers
            </h2>
          </div>
          <Link href="/products?category=Wearables" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {WEARABLE_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ⌨️ 6. MECHANICAL KEYBOARDS & WORKSPACE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              Custom Ergonomics
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Keyboards & Performance Mice
            </h2>
          </div>
          <Link href="/products?category=Peripherals" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {PERIPHERAL_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 🏠 7. SMART HOME & CREATOR GEAR */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
              <Tv className="w-3.5 h-3.5" />
              Smart Living & Gear
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Cameras & Creator Peripherals
            </h2>
          </div>
          <Link href="/products?category=Smart+Home" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {CREATOR_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 🔥 EXCLUSIVE COMBO BUNDLES & LOYALTY REWARDS */}
      <ComboDealsSection />

      {/* 🤖 8. 5 AI SUPERPOWERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              Autonomous Intelligence
            </span>
            <h2 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              5 AI Superpowers of ShopNexus
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Next-generation machine learning and generative vision embedded into your shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {AI_SUPERPOWERS.map((ai, i) => {
              const Icon = ai.icon;
              return (
                <div
                  key={ai.title}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
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
            Customer Reviews
          </span>
          <h2 className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        <TestimonialSlider />
      </section>

      {/* 🎁 10. VIP NEWSLETTER & COUPON SECTION */}
      <NewsletterSection />
    </div>
  );
}
