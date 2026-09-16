'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  MessageCircle,
  PhoneCall,
  Clock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';

const REPLACEMENT_STEPS = [
  {
    step: '০১',
    titleBn: 'সমস্যা সম্পর্কে জানান',
    titleEn: 'Report the Issue',
    descBn: 'পণ্যটি হাতে পাওয়ার ৭ দিনের মধ্যে প্রোডাক্টের ছবি বা আনবক্সিং ভিডিও সহ আমাদের হোয়াটসঅ্যাপ বা সাপোর্টে জানান।',
    descEn: 'Contact our WhatsApp desk or helpline within 7 days of delivery with photos or unboxing video of the issue.',
    icon: MessageCircle,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  },
  {
    step: '০২',
    titleBn: 'ফ্রি কুরিয়ার পিকআপ',
    titleEn: 'Free Courier Pickup',
    descBn: 'আমাদের অনুমোদিত কুরিয়ার (পাঠাও / স্টিডফাস্ট) আপনার ঠিকানা থেকে পণ্যটি পিকআপ করে নিয়ে আসবে (কোনো চার্জ নেই)।',
    descEn: 'Our courier partner will pick up the parcel directly from your doorstep with zero extra return delivery fees.',
    icon: Truck,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    step: '০৩',
    titleBn: 'দ্রুত কোয়ালিটি ইন্সপেকশন',
    titleEn: 'Quality Inspection',
    descBn: 'পণ্যটি আমাদের কোয়ালিটি ল্যাবে পৌঁছানোর পর ২৪ ঘণ্টার মধ্যে টেকনিক্যাল টিম সমস্যাটি যাচাই করবে।',
    descEn: 'Our technical inspection team verifies the defect within 24 hours of receiving the returned package.',
    icon: Clock,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    step: '০৪',
    titleBn: 'নতুন পণ্য বা ১০০% রিফান্ড',
    titleEn: 'Instant Replacement / Refund',
    descBn: 'যাচাই শেষে তাৎক্ষণিক নতুন সিলপ্যাক পণ্য পাঠানো হবে অথবা আপনার বিকাশ/নগদ/ব্যাংক একাউন্টে টাকা রিফান্ড করা হবে।',
    descEn: 'We dispatch a brand-new factory-sealed replacement or process an instant 100% refund to your bKash/Nagad/Bank.',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
];

const ELIGIBLE_REASONS = [
  {
    titleBn: 'ম্যানুফ্যাকচারিং বা টেকনিক্যাল ত্রুটি',
    titleEn: 'Manufacturing or Hardware Defect',
    descBn: 'পণ্যটি অন না হওয়া, বাটন কাজ না করা, চার্জিং বা সাউন্ডে ত্রুটি থাকা।',
    descEn: 'Device failing to power on, button malfunctions, or acoustic/charging defects.',
  },
  {
    titleBn: 'ভুল পণ্য বা কালার ডেলিভারি',
    titleEn: 'Incorrect Item or Color Delivered',
    descBn: 'আপনি যা অর্ডার করেছিলেন তার চেয়ে ভিন্ন মডেল, সাইজ বা রঙের পণ্য পেলে।',
    descEn: 'Received a different product model, color variant, or specification than ordered.',
  },
  {
    titleBn: 'ডেলিভারিতে ক্ষতিগ্রস্ত বা ভাঙা পণ্য',
    titleEn: 'Damaged During Transit',
    descBn: 'কুরিয়ার পরিবহনের সময় পার্সেল ক্ষতিগ্রস্ত বা বক্স ড্যামেজ অবস্থায় পেলে।',
    descEn: 'Package arrived with physical damage, broken seals, or cracked casing.',
  },
  {
    titleBn: 'বক্সের ভেতরে এক্সেসরিজ মিসিং',
    titleEn: 'Missing Box Inclusions / Parts',
    descBn: 'অফিশিয়াল বক্সের কোনো ক্যাবল, ম্যানুয়াল বা এক্সেসরিজ অনুপস্থিত থাকলে।',
    descEn: 'Missing charging cables, adapters, keycap pullers, or included box accessories.',
  },
];

const INELIGIBLE_REASONS = [
  {
    titleBn: 'ব্যবহারকারীর অসাবধানতায় শারীরিক ক্ষতি',
    titleEn: 'User-Induced Physical Damage',
    descBn: 'পণ্য হাত থেকে পড়ে যাওয়া, পানিতে ভেজানো বা অতিরিক্ত ভোল্টেজের কারণে পুড়ে যাওয়া।',
    descEn: 'Accidental drops, liquid spills, water immersion, or burnt PCB due to high voltage.',
  },
  {
    titleBn: 'সফটওয়্যার বা ফার্মওয়্যার মোডিফিকেশন',
    titleEn: 'Unauthorized Firmware / Modding',
    descBn: 'অননুমোদিত থার্ড-পার্টি ফার্মওয়্যার ফ্ল্যাশ করা বা কাস্টম হার্ডওয়্যার মডিফিকেশন।',
    descEn: 'Unauthorized rooting, custom third-party ROM flashing, or physical teardowns.',
  },
  {
    titleBn: 'মূল বক্স বা প্যাকেজিং অনুপস্থিত',
    titleEn: 'Missing Original Retail Box',
    descBn: 'ব্র্যান্ডের অফিশিয়াল বক্স, বারকোড স্টিকার বা ওয়ারেন্টি কার্ড ছাড়া রিটার্ন করা।',
    descEn: 'Returning the product without the original brand box, serial sticker, or warranty slip.',
  },
];

export default function ReplacementPolicyPage() {
  const { language } = useLanguageStore();
  const mounted = useHydrated();
  const isBn = mounted && language === 'bn';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? '১০০% জেনুইন গ্যারান্টি ও ট্রাস্ট' : '100% Genuine Guarantee & Trust'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {isBn ? '৭ দিনের ঝামেলামুক্ত' : '7-Day Hassle-Free'}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
              {isBn ? 'রিপ্লেসমেন্ট ও রিটার্ন পলিসি' : 'Replacement & Return Policy'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'ShopNexus থেকে কেনা প্রতিটি পণ্যে রয়েছে সর্বোচ্চ নির্ভরযোগ্যতা। কোনো প্রোডাক্টে সমস্যা বা ত্রুটি থাকলে পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে সম্পূর্ণ ফ্রিতে নতুন রিপ্লেসমেন্ট পাবেন।'
              : 'Every gadget purchased on ShopNexus comes with ironclad reliability. If you experience any defect or issue, claim a brand-new replacement within 7 days at zero extra cost.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/8801700000000?text=Hello%20ShopNexus%2C%20I%20want%20to%20claim%20a%207-day%20replacement%20for%20my%20order."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isBn ? 'হোয়াটসঅ্যাপে রিপ্লেসমেন্ট ক্লেইম করুন' : 'Claim Replacement via WhatsApp'}</span>
            </a>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:border-orange-500 transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-orange-500" />
              <span>{isBn ? 'অর্ডার ট্র্যাকিং দেখুন' : 'Check Order Tracking'}</span>
            </Link>
          </div>
        </div>

        {/* 4-Step Process Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {isBn ? 'সহজ প্রক্রিয়া' : 'Step-by-Step Flow'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isBn ? 'কীভাবে রিপ্লেসমেন্ট সম্পন্ন হয়?' : 'How Does Replacement Work?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPLACEMENT_STEPS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-orange-500 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isBn ? item.descBn : item.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eligibility Conditions Comparison: What is covered vs what is not */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Covered (Green) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-emerald-500/30 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? 'যেসব ক্ষেত্রে রিপ্লেসমেন্ট প্রযোজ্য' : 'Eligible Replacement Scenarios'}
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isBn ? '✓ সম্পূর্ণ ফ্রিতে রিপ্লেসমেন্ট বা ফুল রিফান্ড' : '✓ 100% Free Replacement or Full Refund'}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {ELIGIBLE_REASONS.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? reason.titleBn : reason.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isBn ? reason.descBn : reason.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Covered (Red) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-rose-500/30 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? 'যেসব ক্ষেত্রে পলিসি প্রযোজ্য নয়' : 'Ineligible Conditions'}
                </h3>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  {isBn ? '✕ ওয়্যারেন্টি বা রিপ্লেসমেন্টের আওতাভুক্ত নয়' : '✕ Not Covered Under Return Policy'}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {INELIGIBLE_REASONS.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? reason.titleBn : reason.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isBn ? reason.descBn : reason.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courier & Refund Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'ফ্রি রিটার্ন ডেলিভারি' : 'Free Return Shipping'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'ডিফেক্ট বা ভুল পণ্যের ক্ষেত্রে কুরিয়ারের রিটার্ন এবং পুনরায় নতুন পণ্য পাঠানোর সম্পূর্ণ খরচ ShopNexus বহন করে।'
                : 'For verified defects or wrong shipments, 100% of the return and re-delivery shipping costs are covered by ShopNexus.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'ইনস্ট্যান্ট রিফান্ড মেথড' : 'Instant Refund Options'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'পণ্য স্টক আউট থাকলে আপনার বিকাশ, নগদ বা ব্যাংক একাউন্টে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে রিফান্ড ট্রান্সফার সম্পন্ন হয়।'
                : 'If a replacement is out of stock, refunds are processed within 24-48 hours to bKash, Nagad, or Bank.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? '২৪/৭ ডেডিকেটেড হেল্পডেস্ক' : '24/7 Dedicated Support'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'রিটার্ন সংক্রান্ত যেকোনো প্রয়োজনে আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে সরাসরি হোয়াটসঅ্যাপ বা ফোনে যোগাযোগ করুন।'
                : 'Have questions about your claim? Reach our friendly support executive directly via WhatsApp or phone.'}
            </p>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] p-8 sm:p-10 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {isBn ? 'আপনার অর্ডারে কোনো সমস্যা হয়েছে?' : 'Need Help with a Replacement Claim?'}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              {isBn
                ? 'আমাদের কাস্টমার কেয়ার টিম সপ্তাহের ৭ দিনই ২৪ ঘণ্টা আপনার সহায়তায় নিয়োজিত রয়েছে।'
                : 'Our support team is available 24/7 to process your replacement smoothly and without hassle.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/8801700000000?text=Hello%20ShopNexus%2C%20I%20have%20an%20issue%20with%20my%20order."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'হোয়াটসঅ্যাপ হেল্পলাইন' : 'Live WhatsApp Desk'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
