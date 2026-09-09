'use client';

import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  Lock,
  Headphones,
  ShoppingBag,
  Gift,
  CreditCard,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface FAQItem {
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  category: 'Orders' | 'Delivery' | 'Payments' | 'Tracking';
}

const FAQS: FAQItem[] = [
  {
    category: 'Orders',
    questionBn: 'অর্ডার করতে কি অ্যাকাউন্ট খোলা বা রেজিস্ট্রেশন বাধ্যতামূলক?',
    questionEn: 'Is account registration mandatory to place an order?',
    answerBn:
      'না! ShopNexus-এ কোনো রেজিস্ট্রেশন বা পাসওয়ার্ডের ঝামেলা ছাড়াই আপনি শুধু আপনার নাম, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা দিয়ে সরাসরি ১-ক্লিকে "Guest Checkout" বা ডিরেক্ট অর্ডার করতে পারবেন।',
    answerEn:
      'No! You can order directly on ShopNexus with 1-Click Guest Checkout using only your name, phone number, and delivery address—no passwords required.',
  },
  {
    category: 'Delivery',
    questionBn: 'ডেলিভারি চার্জ কত এবং কত দ্রুত ডেলিভারি পাওয়া যাবে?',
    questionEn: 'What are the delivery charges and shipping times?',
    answerBn:
      'ঢাকা শহরের ভেতরে ডেলিভারি চার্জ মাত্র ৳৬০ এবং ২৪-৪৮ ঘণ্টার মধ্যে পাঠাও এক্সপ্রেসের মাধ্যমে ডেলিভারি করা হয়। ঢাকার বাইরে সমগ্র বাংলাদেশে ডেলিভারি চার্জ মাত্র ৳১২০ এবং ৪৮-৭২ ঘণ্টার মধ্যে স্টিডফাস্ট কুরিয়ারের মাধ্যমে পৌঁছে দেওয়া হয়।',
    answerEn:
      'Delivery charge is ৳60 inside Dhaka (24-48 hours via Pathao Express), and ৳120 across all Bangladesh (48-72 hours via Steadfast Logistics).',
  },
  {
    category: 'Tracking',
    questionBn: 'লগইন না করে আমি কীভাবে আমার অর্ডারের পার্সেল ট্র্যাক করব?',
    questionEn: 'How can I track my parcel without logging in?',
    answerBn:
      'অর্ডার কনফার্ম করার পর আপনার মোবাইলে তাৎক্ষণিক SMS-এর মাধ্যমে একটি ট্র্যাকিং নম্বর (যেমন: TRK-NX-88219) চলে যাবে। আপনি সরাসরি আমাদের ডেডিকেটেড ট্র্যাকিং পোর্টালে (/track) গিয়ে শুধু আপনার অর্ডার নম্বর বা ট্র্যাকিং কোড দিলেই লাইভ স্ট্যাটাস দেখতে পাবেন।',
    answerEn:
      'After confirming an order, you will receive an SMS with your tracking code (e.g., TRK-NX-88219). You can track live courier status directly on our tracking portal (/track) using this code.',
  },
  {
    category: 'Payments',
    questionBn: 'পেমেন্ট করার জন্য কী কী মাধ্যম রয়েছে?',
    questionEn: 'What payment options are available?',
    answerBn:
      'আপনি ক্যাশ অন ডেলিভারি (Cash on Delivery / পণ্য হাতে পেয়ে টাকা পরিশোধ), বিকাশ (bKash Instant Gateway), নগদ (Nagad Instant Gateway) অথবা যেকোনো আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।',
    answerEn:
      'We support Cash on Delivery (COD), bKash Instant Payment, Nagad Instant Gateway, and Visa/Mastercard/Amex debit and credit cards.',
  },
  {
    category: 'Orders',
    questionBn: 'স্মার্ট প্রোডাক্ট বান্ডেল (Frequently Bought Together) কী এবং কীভাবে ছাড় পাব?',
    questionEn: 'What are Smart Bundles and how do I get the discount?',
    answerBn:
      'যেকোনো গ্যাজেট কেনার সময় তার প্রয়োজনীয় এক্সেসরিজ একসাথে বান্ডেল হিসেবে কিনলে স্বয়ংক্রিয়ভাবে ১৫% অতিরিক্ত ফ্ল্যাট ডিসকাউন্ট পাওয়া যায়। ১-ক্লিকেই ৩টি আইটেম কার্টে অ্যাড করা যায়।',
    answerEn:
      'Smart Bundles let you add complementary accessories with an automatic 15% flat bundle discount in a single click.',
  },
  {
    category: 'Payments',
    questionBn: 'প্রোডাক্ট ডিফেক্টিভ হলে রিটার্ন ও রিফান্ড পলিসি কী?',
    questionEn: 'What is the return and refund policy for defective goods?',
    answerBn:
      'আমাদের প্ল্যাটফর্মের প্রতিটি প্রোডাক্ট ১০০% অফিশিয়াল ও ভেরিফাইড। পণ্য পাওয়ার পর কোনো সমস্যা দেখা দিলে ৭ দিনের মধ্যে ফ্রি রিপ্লেসমেন্ট এবং ১০০% রিফান্ড গ্যারান্টি রয়েছে।',
    answerEn:
      'Every product is 100% verified genuine. We offer a 7-day hassle-free replacement and full money-back guarantee.',
  },
];

export default function AboutAndFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{mounted && language === 'bn' ? 'পরবর্তী প্রজন্মের ই-কমার্স' : 'Next-Gen E-Commerce Architecture'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {mounted && language === 'bn' ? (
              <>
                স্মার্ট কেনাকাটা, প্রিমিয়াম অভিজ্ঞতা ও <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
                  ১০০% অফিশিয়াল অথেনটিসিটি
                </span>
              </>
            ) : (
              <>
                Engineered for Speed, Reliability & <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
                  100% Genuine Hardware
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {mounted && language === 'bn'
              ? 'ShopNexus হলো বাংলাদেশের শীর্ষস্থানীয় আল্ট্রা-ফাস্ট প্রিমিয়াম গ্যাজেট ও ইলেকট্রনিক্স মার্কেটপ্লেস। কোনো পাসওয়ার্ড বা রেজিস্ট্রেশনের বাধ্যবাধকতা ছাড়াই এক ক্লিকে অর্ডার করুন এবং পান ২৪-৪৮ ঘণ্টার নির্ভরযোগ্য হোম ডেলিভারি।'
              : 'ShopNexus is Bangladesh’s premier technology storefront, built for instant 1-click guest ordering, transparent parcel tracking, and 100% manufacturer warranty.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              {mounted ? t('btn_explore_products') : 'Explore Products'} <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#faq-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-orange-500" />
              {mounted && language === 'bn' ? 'সাধারণ প্রশ্নাবলী (FAQ)' : 'Read FAQ'}
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
            {mounted && language === 'bn' ? 'কেন আমরা গ্রাহকের প্রথম পছন্দ?' : 'Built on 6 Trust Pillars'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {mounted && language === 'bn'
              ? 'নিরাপত্তা, গতি এবং আস্থার সর্বোচ্চ সমন্বয়ে প্রতিটি অর্ডারের নিখুঁত নিশ্চয়তা।'
              : 'Our core architectural commitments to reliability, fast delivery, and authentic hardware.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '১-ক্লিক ডিরেক্ট অর্ডার (Guest Checkout)' : '1-Click Direct Guest Checkout'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'পাসওয়ার্ড বা অ্যাকাউন্ট খোলার ঝামেলা নেই। শুধুমাত্র নাম ও ফোন নম্বর দিয়ে সরাসরি অর্ডার কনফার্ম করুন।'
                : 'Zero friction ordering. Place orders instantly with just your name, phone, and delivery address.'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '২৪-৪৮ ঘণ্টা এক্সপ্রেস ডেলিভারি' : '24-48h Express Courier Dispatch'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'ঢাকায় মাত্র ৳৬০ এবং সারা দেশে ৳১২০ ডেলিভারি চার্জে পাঠাও ও স্টিডফাস্টের মাধ্যমে দ্রুততম পৌঁছানো।'
                : 'Flat ৳60 inside Dhaka and ৳120 countrywide via Pathao Courier Express and Steadfast.'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে' : 'Bank-Grade Secure Checkout'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ তাৎক্ষণিক গেটওয়ে এবং ভিসা/মাস্টারকার্ডের সুরক্ষিত পেমেন্ট সাপোর্ট।'
                : '100% PCI-DSS compliant checkout supporting COD, bKash, Nagad, and global credit/debit cards.'}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'স্মার্ট এআই বান্ডেল ছাড় (১৫% ডিসকাউন্ট)' : 'Smart AI Bundle Savings (15% Off)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'প্রয়োজনীয় এক্সেসরিজ একসাথে বান্ডেল হিসেবে কিনলে স্বয়ংক্রিয়ভাবে অতিরিক্ত ১৫% ডিসকাউন্ট উপভোগ করুন।'
                : 'Frequently Bought Together smart bundles with automated flat 15% discount in one single click.'}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '২৪/৭ সার্বক্ষণিক কাস্টমার সাপোর্ট' : '24/7 Dedicated Support Desk'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'যেকোনো জিজ্ঞাসা বা সহায়তার জন্য আমাদের অফিসিয়াল হোয়াটসঅ্যাপ ও লাইভ হেল্পডেস্ক সর্বদা প্রস্তুত।'
                : 'Direct human support via WhatsApp and live chat for order queries and warranty assistance.'}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 shadow-sm backdrop-blur-xl transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '১০০% মানিব্যাক ও জেনুইন গ্যারান্টি' : '100% Genuine & Money-Back Guarantee'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {mounted && language === 'bn'
                ? 'প্রতিটি পণ্য অফিশিয়াল ব্র্যান্ড অথেনটিক এবং ত্রুটিযুক্ত পণ্যে ৭ দিনের সহজ রিটার্ন পলিসি।'
                : 'Official manufacturer warranties and 7-day hassle-free replacement on any defect.'}
            </p>
          </div>
        </div>
      </section>

      {/* 🌟 3. TRACKING QUICK BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <Truck className="w-4 h-4" /> {mounted && language === 'bn' ? 'পার্সেল ট্র্যাকিং পোর্টাল' : 'Live Tracking Portal'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'অর্ডারের ডেলিভারি স্ট্যাটাস ট্র্যাক করতে চান?' : 'Looking to Track Your Existing Parcel?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {mounted && language === 'bn'
                ? 'লগইন ছাড়াই সরাসরি আপনার অর্ডার নম্বর দিয়ে লাইভ কুরিয়ার স্ট্যাটাস দেখুন।'
                : 'Check real-time courier movement and 24h dispatch milestone without logging in.'}
            </p>
          </div>
          <Link
            href="/track"
            className="shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>{mounted && language === 'bn' ? 'লাইভ ট্র্যাক করুন' : 'Track Order Now'}</span>
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
            {mounted && language === 'bn' ? 'সাধারণ প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {mounted && language === 'bn' ? 'ShopNexus ব্যবহারের নিয়মাবলী ও সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর:' : 'Quick answers to common questions about ordering, delivery, and payments:'}
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
                  ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm'
              }`}
            >
              {cat === 'All' && (mounted && language === 'bn' ? 'সকল' : 'All')}
              {cat === 'Orders' && (mounted && language === 'bn' ? 'অর্ডার' : 'Orders')}
              {cat === 'Delivery' && (mounted && language === 'bn' ? 'ডেলিভারি' : 'Delivery')}
              {cat === 'Payments' && (mounted && language === 'bn' ? 'পেমেন্ট' : 'Payments')}
              {cat === 'Tracking' && (mounted && language === 'bn' ? 'ট্র্যাকিং' : 'Tracking')}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const qText = language === 'bn' ? faq.questionBn : faq.questionEn;
            const aText = language === 'bn' ? faq.answerBn : faq.answerEn;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm backdrop-blur-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-mono font-bold">
                      Q
                    </span>
                    {qText}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                    {aText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {mounted && language === 'bn' ? 'অফিশিয়াল ও প্রিমিয়াম গ্যাজেট কিনতে প্রস্তুত?' : 'Ready to Experience Official Premium Hardware?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {mounted && language === 'bn'
              ? 'কোনো রেজিস্ট্রেশনের ঝামেলা ছাড়াই এখনই আপনার পছন্দের প্রোডাক্ট অর্ডার করুন এবং উপভোগ করুন দ্রুততম হোম ডেলিভারি।'
              : 'Browse our catalog, place 1-click orders with verified authentic warranties and express dispatch.'}
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer"
            >
              {mounted ? t('btn_explore_products') : 'Browse ShopNexus Catalog'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
