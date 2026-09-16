'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';

interface Testimonial {
  id: number;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  company: string;
  companyBn: string;
  avatar: string;
  quote: string;
  quoteBn: string;
  rating: number;
  badge?: string;
  badgeBn?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mateo Rossi',
    nameBn: 'মাতেও রসি',
    role: 'CEO',
    roleBn: 'সিইও',
    company: 'ROSSI LOGISTICS',
    companyBn: 'রসি লজিস্টিকস',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
    quote:
      'With ShopNexus, we scaled our hardware procurement effortlessly. The AI recommendation features and real-time delivery trackers are amazing!',
    quoteBn:
      'শপনেক্সাসের মাধ্যমে আমাদের হার্ডওয়্যার সংগ্রহ খুব সহজ হয়েছে। এআই রিকমেন্ডেশন ফিচার এবং রিয়েল-টাইম ডেলিভারি ট্র্যাকার অসাধারণ!',
    rating: 5,
    badge: 'Enterprise Buyer',
    badgeBn: 'এন্টারপ্রাইজ বায়ার',
  },
  {
    id: 2,
    name: 'Ava Green',
    nameBn: 'আভা গ্রিন',
    role: 'FOUNDER',
    roleBn: 'প্রতিষ্ঠাতা',
    company: 'GREENTECH MEDIA',
    companyBn: 'গ্রিনটেক মিডিয়া',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
    quote:
      'ShopNexus transformed how we equip our acoustic studio. The platform is smooth, hardware authenticity is 100% certified, and delivery is ultra-reliable.',
    quoteBn:
      'শপনেক্সাস আমাদের অ্যাকোস্টিক স্টুডিও সাজানোর অভিজ্ঞতা বদলে দিয়েছে। প্ল্যাটফর্মটি খুবই স্মুথ, হার্ডওয়্যার ১০০% অথেনটিক এবং ডেলিভারি দারুণ নির্ভরযোগ্য।',
    rating: 5,
    badge: 'Verified Studio',
    badgeBn: 'ভেরিফায়েড স্টুডিও',
  },
  {
    id: 3,
    name: 'Sarah Rahman',
    nameBn: 'সারা রহমান',
    role: 'STUDIO AUDIO ENGINEER',
    roleBn: 'স্টুডিও অডিও ইঞ্জিনিয়ার',
    company: 'SOUNDSTAGE DHAKA',
    companyBn: 'সাউন্ডস্টেজ ঢাকা',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80',
    quote:
      'The Sony WH-1000XM5 spatial audio headphones arrived in less than 24 hours. Pristine factory condition with official warranty protection!',
    quoteBn:
      'Sony WH-1000XM5 স্প্যাশিয়াল অডিও হেডফোনটি ২৪ ঘণ্টারও কম সময়ে চলে এসেছে। শতভাগ ইনট্যাক্ট ও অফিসিয়াল ওয়ারেন্টিসহ পেয়েছি!',
    rating: 5,
    badge: 'Pro Audio Member',
    badgeBn: 'প্রো অডিও মেম্বার',
  },
  {
    id: 4,
    name: 'Tanvir Hossain',
    nameBn: 'তানভীর হোসেন',
    role: 'SOFTWARE ARCHITECT',
    roleBn: 'সফটওয়্যার আর্কিটেক্ট',
    company: 'NEXUS CLOUD',
    companyBn: 'নেক্সাস ক্লাউড',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    quote:
      'The AI Visual Search found the exact mechanical keyboard switch model I snapped a quick photo of at my friend’s desk. Flawless AI integration.',
    quoteBn:
      'বন্ধুর ডেস্কে দেখা মেকানিক্যাল কীবোর্ডের স্ন্যাপশট তুলতেই এআই ভিজ্যুয়াল সার্চ চোখের পলকে সঠিক মডেলটি খুঁজে দিয়েছে। অতুলনীয় এআই ইন্টিগ্রেশন।',
    rating: 5,
    badge: 'Verified Enthusiast',
    badgeBn: 'ভেরিফায়েড এন্থুসিয়াস্ট',
  },
  {
    id: 5,
    name: 'Elena Rostova',
    nameBn: 'এলেনা রোস্তোভা',
    role: 'CREATIVE DIRECTOR',
    roleBn: 'ক্রিয়েটিভ ডিরেক্টর',
    company: 'SYNTHESIS DESIGN',
    companyBn: 'সিন্থেসিস ডিজাইন',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80',
    quote:
      'State-of-the-art UI and incredible checkout experience. The coupon unlocked instantly and the Apple Watch Ultra 2 arrived beautifully packaged.',
    quoteBn:
      'অত্যাধুনিক ইউআই এবং চমৎকার চেকআউট অভিজ্ঞতা। কুপন ডিসকাউন্ট সাথে সাথে অ্যাপ্লাই হয়েছে এবং অ্যাপল ওয়াচ আল্ট্রা ২ দারুণ প্যাকেজিংয়ে এসেছে।',
    rating: 5,
    badge: 'VIP Club Member',
    badgeBn: 'ভিআইপি ক্লাব মেম্বার',
  },
  {
    id: 6,
    name: 'Liam Vance',
    nameBn: 'লিয়াম ভ্যান্স',
    role: 'ESPORTS OPERATIONS',
    roleBn: 'ইস্পোর্টস অপারেশনস',
    company: 'VORTEX GAMING',
    companyBn: 'ভার্টেক্স গেমিং',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&q=80',
    quote:
      'Zero latency peripherals with hot-swappable custom components. ShopNexus has officially become our esports team exclusive hardware partner.',
    quoteBn:
      'জিরো ল্যাটেন্সি পেরিফেরালস ও কাস্টম হট-সোয়াপ সুবিধা। শপনেক্সাস এখন আমাদের ইস্পোর্টস দলের এক্সক্লুসিভ অফিসিয়াল হার্ডওয়্যার পার্টনার।',
    rating: 5,
    badge: 'Esports Tier 1',
    badgeBn: 'ইস্পোর্টস টায়ার ১',
  },
  {
    id: 7,
    name: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    role: 'PRODUCT DESIGN LEAD',
    roleBn: 'প্রোডাক্ট ডিজাইন লিড',
    company: 'HEXA LABS',
    companyBn: 'হেক্সা ল্যাবস',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&q=80',
    quote:
      'The 24/7 AI shopping chatbot answered my specific budget and battery questions accurately. It is like having a hardware expert on call 24/7.',
    quoteBn:
      '২৪/৭ এআই শপিং চ্যাটবট আমার বাজেট ও ব্যাটারি সংক্রান্ত প্রশ্নের নিখুঁত উত্তর দিয়েছে। মনে হয় সবসময় একজন হার্ডওয়্যার এক্সপার্ট পাশে আছেন।',
    rating: 5,
    badge: 'Design Verified',
    badgeBn: 'ডিজাইন ভেরিফায়েড',
  },
  {
    id: 8,
    name: 'Kazi Farhan',
    nameBn: 'কাজী ফারহান',
    role: 'HARDWARE REVIEWER',
    roleBn: 'হার্ডওয়্যার রিভিউয়ার',
    company: 'TECH MATRIX',
    companyBn: 'টেক ম্যাট্রিক্স',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&q=80',
    quote:
      'Dynamic demand flash deals offered legitimate 35% savings without inflated base prices. Transparent, high-speed, and wonderfully designed.',
    quoteBn:
      'ডায়নামিক ডিমান্ড ফ্ল্যাশ ডিলে কোনো কৃত্রিম দাম বাড়ানো ছাড়াই সত্যিকারের ৩৫% পর্যন্ত ছাড় পেয়েছি। স্বচ্ছ, দ্রুতগতির এবং চমৎকার ডিজাইন।',
    rating: 5,
    badge: 'Hardware Reviewer',
    badgeBn: 'হার্ডওয়্যার রিভিউয়ার',
  },
];

export const TestimonialSlider: React.FC = () => {
  const { language } = useLanguageStore();
  const mounted = useHydrated();
  const isBn = mounted && language === 'bn';

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
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-4 sm:mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1.5">
          {isBn ? 'গ্রাহকদের প্রতিক্রিয়া' : 'Customer Reviews'}
        </span>
        <h2 className="text-xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isBn ? 'আমাদের সম্মানিত গ্রাহকরা কী বলছেন' : 'What Our Customers Say'}
        </h2>
      </div>

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
                <Image
                  src={prevTestimonial.avatar}
                  alt={isBn ? prevTestimonial.nameBn : prevTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  {isBn ? prevTestimonial.nameBn : prevTestimonial.name}
                </h4>
                <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  {isBn ? prevTestimonial.roleBn : prevTestimonial.role},{' '}
                  {isBn ? prevTestimonial.companyBn : prevTestimonial.company}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 italic">
              &ldquo;{isBn ? prevTestimonial.quoteBn : prevTestimonial.quote}&rdquo;
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
                  <Image
                    src={current.avatar}
                    alt={isBn ? current.nameBn : current.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      {isBn ? current.nameBn : current.name}
                    </h3>
                    {(isBn ? current.badgeBn : current.badge) && (
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {isBn ? current.badgeBn : current.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mt-0.5">
                    {isBn ? current.roleBn : current.role}, {isBn ? current.companyBn : current.company}
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
                &ldquo;{isBn ? current.quoteBn : current.quote}&rdquo;
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
                <Image
                  src={nextTestimonial.avatar}
                  alt={isBn ? nextTestimonial.nameBn : nextTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  {isBn ? nextTestimonial.nameBn : nextTestimonial.name}
                </h4>
                <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  {isBn ? nextTestimonial.roleBn : nextTestimonial.role},{' '}
                  {isBn ? nextTestimonial.companyBn : nextTestimonial.company}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 italic">
              &ldquo;{isBn ? nextTestimonial.quoteBn : nextTestimonial.quote}&rdquo;
            </p>
          </div>

          {/* Navigation Arrow Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 sm:left-4 z-30 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-110 shadow-lg transition-all cursor-pointer"
            title={isBn ? 'পূর্ববর্তী রিভিউ' : 'Previous Review'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 sm:right-4 z-30 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:scale-110 shadow-lg transition-all cursor-pointer"
            title={isBn ? 'পরবর্তী রিভিউ' : 'Next Review'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Avatar Navigation Bar */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
          {TESTIMONIALS.map((item, idx) => {
            const isActive = idx === activeIndex;
            const displayName = isBn ? item.nameBn : item.name;
            const displayRole = isBn ? item.roleBn : item.role;
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
                title={`${displayName} - ${displayRole}`}
              >
                <Image
                  src={item.avatar}
                  alt={displayName}
                  fill
                  className="rounded-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
