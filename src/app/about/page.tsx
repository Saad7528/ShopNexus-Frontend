'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  ArrowRight,
  Search,
  MessageSquare,
  Lock,
  Headphones,
  ShoppingBag,
  Gift,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Orders' | 'Delivery' | 'Payments' | 'Tracking';
}

const FAQS: FAQItem[] = [
  {
    category: 'Orders',
    question: 'অর্ডার করতে কি অ্যাকাউন্ট খোলা বা রেজিস্ট্রেশন বাধ্যতামূলক?',
    answer:
      'না! ShopNexus-এ কোনো রেজিস্ট্রেশন বা পাসওয়ার্ডের ঝামেলা ছাড়াই আপনি শুধু আপনার নাম, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা দিয়ে সরাসরি ১-ক্লিকে "Guest Checkout" বা ডিরেক্ট অর্ডার করতে পারবেন।',
  },
  {
    category: 'Delivery',
    question: 'ডেলিভারি চার্জ কত এবং কত দ্রুত ডেলিভারি পাওয়া যাবে?',
    answer:
      'ঢাকা শহরের ভেতরে ডেলিভারি চার্জ মাত্র ৳৬০ এবং ২৪-৪৮ ঘণ্টার মধ্যে পাঠাও এক্সপ্রেসের মাধ্যমে ডেলিভারি করা হয়। ঢাকার বাইরে সমগ্র বাংলাদেশে ডেলিভারি চার্জ মাত্র ৳১২০ এবং ৪৮-৭২ ঘণ্টার মধ্যে স্টিডফাস্ট কুরিয়ারের মাধ্যমে কাস্টমারের ঠিকানায় পৌঁছে দেওয়া হয়।',
  },
  {
    category: 'Tracking',
    question: 'লগইন না করে আমি কীভাবে আমার অর্ডারের পার্সেল ট্র্যাক করব?',
    answer:
      'অর্ডার কনফার্ম করার পর আপনার মোবাইলে তাৎক্ষণিক SMS-এর মাধ্যমে একটি ট্র্যাকিং নম্বর (যেমন: TRK-NX-88219) চলে যাবে। আপনি এই পেজের ট্র্যাকিং বক্সে অথবা আমাদের ট্র্যাকিং সেকশনে গিয়ে শুধু আপনার মোবাইল নম্বর বা ট্র্যাকিং কোড দিলেই লাইভ স্ট্যাটাস দেখতে পাবেন।',
  },
  {
    category: 'Payments',
    question: 'পেমেন্ট করার জন্য কী কী মাধ্যম রয়েছে?',
    answer:
      'আপনি ক্যাশ অন ডেলিভারি (Cash on Delivery / পণ্য হাতে পেয়ে টাকা পরিশোধ), বিকাশ (bKash Instant Gateway), নগদ (Nagad Instant Gateway) অথবা যেকোনো আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।',
  },
  {
    category: 'Orders',
    question: 'স্মার্ট প্রোডাক্ট বান্ডেল (Frequently Bought Together) কী এবং কীভাবে ছাড় পাব?',
    answer:
      'যেকোনো গ্যাজেট কেনার সময় তার প্রয়োজনীয় এক্সেসরিজ একসাথে বান্ডেল হিসেবে কিনলে স্বয়ংক্রিয়ভাবে ১৫% অতিরিক্ত ফ্ল্যাট ডিসকাউন্ট পাওয়া যায়। ১-ক্লিকেই ৩টি আইটেম কার্টে অ্যাড করা যায়।',
  },
  {
    category: 'Payments',
    question: 'প্রোডাক্ট ডিফেক্টিভ হলে রিটার্ন ও রিফান্ড পলিসি কী?',
    answer:
      'আমাদের প্ল্যাটফর্মের প্রতিটি প্রোডাক্ট ১০০% অফিশিয়াল ও ভেরিফাইড। পণ্য পাওয়ার পর কোনো সমস্যা দেখা দিলে ৭ দিনের মধ্যে ফ্রি রিপ্লেসমেন্ট এবং ১০০% রিফান্ড গ্যারান্টি রয়েছে।',
  },
];

export default function AboutAndFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const { orders } = useOrderStore();

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    const cleanQuery = trackingQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === cleanQuery ||
        o.trackingNumber.toLowerCase() === cleanQuery ||
        o.shippingAddress.toLowerCase().includes(cleanQuery)
    );

    if (found) {
      setSearchedOrder(found);
      setSearchNotFound(false);
    } else {
      setSearchedOrder(null);
      setSearchNotFound(true);
    }
  };

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-[#0b0f19] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            About ShopNexus & FAQ Hub
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            বাংলাদেশের জন্য আধুনিক ও বুদ্ধিমান <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              পরবর্তী প্রজন্মের ই-কমার্স ইকোসিস্টেম
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            ShopNexus তৈরি করা হয়েছে সাধারণ ক্রেতাদের ঝামেলামুক্ত কেনাকাটার অভিজ্ঞতা দিতে—যেখানে অ্যাকাউন্ট রেজিস্ট্রেশন ছাড়াও দ্রুত ১-ক্লিকে অর্ডার, বিকাশ/নগদে ইনস্ট্যান্ট পেমেন্ট এবং ২৪-৪৮ ঘণ্টায় এক্সপ্রেস হোম ডেলিভারি পাওয়া যায়।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" /> শপিং শুরু করুন (৳ BDT)
            </Link>
            <a
              href="#faq-section"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" /> সাধারণ প্রশ্নোত্তর দেখুন
            </a>
          </div>
        </div>
      </section>

      {/* 🌟 2. PLATFORM CORE FEATURES SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Why ShopNexus?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            গ্রাহকদের জন্য আমাদের বিশেষ সুবিধাসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            প্রতিটি ফিচার ডিজাইন করা হয়েছে কাস্টমারদের সর্বোচ্চ গতি, স্বচ্ছতা এবং নিরাপত্তা নিশ্চিত করতে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">রেজিস্ট্রেশন ছাড়া ১-ক্লিকে ডিরেক্ট অর্ডার</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              পাসওয়ার্ড বা অ্যাকাউন্ট খোলার বাধ্যবাধকতা নেই। শুধু নাম, ফোন ও ঠিকানা দিয়েই সরাসরি কনফার্ম করুন।
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">বিকাশ ও নগদ ইনস্ট্যান্ট গেটওয়ে</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              সরাসরি বিকাশ ও নগদের ৩-ধাপের ভেরিফাইড সিমুলেটেড পেমেন্ট গেটওয়ে এবং ক্যাশ অন ডেলিভারি সাপোর্ট।
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">স্বয়ংক্রিয় কুরিয়ার চার্জ ক্যালকুলেটর</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ঢাকা শহর মাত্র ৳৬০ (পাঠাও এক্সপ্রেস ২৪-৪৮ ঘণ্টা) এবং ঢাকার বাইরে সারা বাংলাদেশ মাত্র ৳১২০।
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">স্মার্ট বান্ডেল (১৫% অতিরিক্ত ছাড়)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              সম্পর্কিত অ্যাকসেসরিজ একসাথে কিনলে স্বয়ংক্রিয়ভাবে ১৫% ফ্ল্যাট বান্ডেল সেভিংস যুক্ত হয়।
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">ভেরিফাইড কাস্টমার ফটো রিভিউ</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              প্রকৃত ক্রেতাদের ব্যবহার করা ছবির রিভিউ এবং অ্যাডমিন টিম দ্বারা ভেরিফিকেশন মডারেশন।
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">১০০% মানিব্যাক ও জেনুইন গ্যারান্টি</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              প্রতিটি পণ্য অফিশিয়াল ব্র্যান্ড অথেনটিক এবং ত্রুটিযুক্ত পণ্যে ৭ দিনের সহজ রিটার্ন পলিসি।
            </p>
          </div>
        </div>
      </section>

      {/* 🌟 3. GUEST ORDER LIVE TRACKING SEARCH WIDGET */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Truck className="w-4 h-4" /> Guest Live Tracking
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              লগইন ছাড়া সরাসরি পার্সেল ট্র্যাকিং
            </h3>
            <p className="text-xs text-slate-400">
              আপনার অর্ডার নম্বর (যেমন: NX-ORD-9021) বা ট্র্যাকিং কোড (যেমন: TRK-NX-88219) দিয়ে খুঁজুন:
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter Order ID / Tracking Code..."
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> ট্র্যাক করুন
            </button>
          </form>

          {/* Searched Order Result */}
          {searchedOrder && (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Order ID</span>
                  <p className="font-mono text-sm font-bold text-indigo-400">{searchedOrder.orderNumber}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {searchedOrder.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">কুরিয়ার পার্টনার:</span>
                  <span className="font-bold text-white">{searchedOrder.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ট্র্যাকিং কোড:</span>
                  <span className="font-mono font-bold text-emerald-400">{searchedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">সর্বমোট টাকা:</span>
                  <span className="font-mono font-bold text-white">৳{searchedOrder.total.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          )}

          {searchNotFound && (
            <p className="text-xs text-rose-400 text-center font-semibold">
              কোনো অর্ডার পাওয়া যায়নি। সঠিক অর্ডার আইডি বা ট্র্যাকিং কোড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
          )}
        </div>
      </section>

      {/* 🌟 4. FAQ ACCORDION SECTION */}
      <section id="faq-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            সাধারণ প্রশ্নোত্তর (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            ShopNexus ব্যবহারের নিয়মাবলী ও সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর:
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['All', 'Orders', 'Delivery', 'Payments', 'Tracking'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-bold text-sm text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-mono">
                      Q
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 🌟 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            অফিশিয়াল ও প্রিমিয়াম গ্যাজেট কিনতে প্রস্তুত?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            কোনো রেজিস্ট্রেশনের ঝামেলা ছাড়াই এখনই আপনার পছন্দের প্রোডাক্ট অর্ডার করুন এবং উপভোগ করুন দ্রুততম হোম ডেলিভারি।
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Browse ShopNexus Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
