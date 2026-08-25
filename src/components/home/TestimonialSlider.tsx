'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  badge?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mateo Rossi',
    role: 'CEO',
    company: 'ROSSI LOGISTICS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
    quote:
      'With ShopNexus, we scaled our hardware procurement effortlessly. The AI recommendation features and real-time delivery trackers are amazing!',
    rating: 5,
    badge: 'Enterprise Buyer',
  },
  {
    id: 2,
    name: 'Ava Green',
    role: 'FOUNDER',
    company: 'GREENTECH MEDIA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
    quote:
      'ShopNexus transformed how we equip our acoustic studio. The platform is smooth, hardware authenticity is 100% certified, and delivery is ultra-reliable.',
    rating: 5,
    badge: 'Verified Studio',
  },
  {
    id: 3,
    name: 'Sarah Rahman',
    role: 'STUDIO AUDIO ENGINEER',
    company: 'SOUNDSTAGE DHAKA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80',
    quote:
      'The Sony WH-1000XM5 spatial audio headphones arrived in less than 24 hours. Pristine factory condition with official warranty protection!',
    rating: 5,
    badge: 'Pro Audio Member',
  },
  {
    id: 4,
    name: 'Tanvir Hossain',
    role: 'SOFTWARE ARCHITECT',
    company: 'NEXUS CLOUD',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    quote:
      'The AI Visual Search found the exact mechanical keyboard switch model I snapped a quick photo of at my friend’s desk. Flawless AI integration.',
    rating: 5,
    badge: 'Verified Enthusiast',
  },
  {
    id: 5,
    name: 'Elena Rostova',
    role: 'CREATIVE DIRECTOR',
    company: 'SYNTHESIS DESIGN',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80',
    quote:
      'State-of-the-art UI and incredible checkout experience. The coupon unlocked instantly and the Apple Watch Ultra 2 arrived beautifully packaged.',
    rating: 5,
    badge: 'VIP Club Member',
  },
  {
    id: 6,
    name: 'Liam Vance',
    role: 'ESPORTS OPERATIONS',
    company: 'VORTEX GAMING',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&q=80',
    quote:
      'Zero latency peripherals with hot-swappable custom components. ShopNexus has officially become our esports team exclusive hardware partner.',
    rating: 5,
    badge: 'Esports Tier 1',
  },
  {
    id: 7,
    name: 'Nusrat Jahan',
    role: 'PRODUCT DESIGN LEAD',
    company: 'HEXA LABS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&q=80',
    quote:
      'The 24/7 AI shopping chatbot answered my specific budget and battery questions accurately. It is like having a hardware expert on call 24/7.',
    rating: 5,
    badge: 'Design Verified',
  },
  {
    id: 8,
    name: 'Kazi Farhan',
    role: 'HARDWARE REVIEWER',
    company: 'TECH MATRIX',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&q=80',
    quote:
      'Dynamic demand flash deals offered legitimate 35% savings without inflated base prices. Transparent, high-speed, and wonderfully designed.',
    rating: 5,
    badge: 'Hardware Reviewer',
  },
];

export const TestimonialSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = TESTIMONIALS.length;

  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const current = TESTIMONIALS[activeIndex];
  const prevTestimonial = TESTIMONIALS[prevIndex];
  const nextTestimonial = TESTIMONIALS[nextIndex];

  return (
    <div
      className="relative max-w-5xl mx-auto px-4 sm:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Depth Card Stage */}
      <div className="relative h-[340px] sm:h-[300px] flex items-center justify-center overflow-hidden">
        {/* Previous Card (Blurred Background Left) */}
        <div
          onClick={handlePrev}
          className="absolute left-1/2 -translate-x-[118%] sm:-translate-x-[125%] w-[85%] sm:w-[500px] p-6 sm:p-8 rounded-3xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800/80 scale-[0.88] opacity-35 blur-[1.5px] transition-all duration-700 select-none cursor-pointer hidden md:block"
        >
          <div className="flex items-center gap-3.5 mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-400 dark:border-slate-700 shrink-0">
              <Image src={prevTestimonial.avatar} alt={prevTestimonial.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{prevTestimonial.name}</h4>
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                {prevTestimonial.role}, {prevTestimonial.company}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 italic">
            &ldquo;{prevTestimonial.quote}&rdquo;
          </p>
        </div>

        {/* ACTIVE Center Card (Focused & Elevated) */}
        <div className="relative z-20 w-full sm:w-[540px] p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#0b1120] border border-orange-200 dark:border-orange-500/30 shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 transition-all duration-500 animate-in fade-in zoom-in-95">
          {/* Ambient Glow in Card */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* User Header */}
          <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-md shadow-orange-500/25 shrink-0">
                <Image src={current.avatar} alt={current.name} fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{current.name}</h3>
                  {current.badge && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {current.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mt-0.5">
                  {current.role}, {current.company}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400 shrink-0">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>

          {/* Quote Body */}
          <div className="relative z-10 pt-1">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              &ldquo;{current.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Next Card (Blurred Background Right) */}
        <div
          onClick={handleNext}
          className="absolute left-1/2 translate-x-[18%] sm:translate-x-[25%] w-[85%] sm:w-[500px] p-6 sm:p-8 rounded-3xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800/80 scale-[0.88] opacity-35 blur-[1.5px] transition-all duration-700 select-none cursor-pointer hidden md:block"
        >
          <div className="flex items-center gap-3.5 mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-400 dark:border-slate-700 shrink-0">
              <Image src={nextTestimonial.avatar} alt={nextTestimonial.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">{nextTestimonial.name}</h4>
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                {nextTestimonial.role}, {nextTestimonial.company}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 italic">
            &ldquo;{nextTestimonial.quote}&rdquo;
          </p>
        </div>

        {/* Navigation Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 z-30 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-110 shadow-lg transition-all cursor-pointer"
          title="Previous Review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1 sm:right-4 z-30 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-110 shadow-lg transition-all cursor-pointer"
          title="Next Review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Avatar Navigation Bar */}
      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
        {TESTIMONIALS.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                isActive
                  ? 'w-11 h-11 sm:w-12 sm:h-12 border-2 border-orange-500 ring-4 ring-orange-500/30 scale-110 shadow-lg shadow-orange-500/25 z-10'
                  : 'w-8 h-8 sm:w-9 sm:h-9 border border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100 hover:scale-105'
              }`}
              title={`${item.name} - ${item.role}`}
            >
              <Image
                src={item.avatar}
                alt={item.name}
                fill
                className="rounded-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
