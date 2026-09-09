'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  Calendar,
  CreditCard,
  Building2,
  Sparkles,
  PhoneCall,
  AlertCircle,
} from 'lucide-react';
import { useOrderStore, UserOrder } from '@/store/useOrderStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

const STEP_DEFINITIONS = [
  { key: 'PLACED', stepNumber: 1, labelEn: 'Order Placed', labelBn: 'অর্ডার প্লেসড', descEn: 'Order placed & received in queue', descBn: 'অর্ডার সফলভাবে সিস্টেমে গ্রহণ করা হয়েছে' },
  { key: 'CONFIRMED', stepNumber: 2, labelEn: 'Confirmed', labelBn: 'কনফার্মড', descEn: 'Verified by inventory team', descBn: 'ইনভেন্টরি টিম দ্বারা ভেরিফাই করা হয়েছে' },
  { key: 'PACKAGING', stepNumber: 3, labelEn: 'Packaging & QC', labelBn: 'প্যাকেজিং ও QC', descEn: 'Quality check passed & securely packed', descBn: 'কোয়ালিটি চেক শেষে সুরক্ষিতভাবে প্যাক করা হয়েছে' },
  { key: 'SHIPPED', stepNumber: 4, labelEn: 'Dispatched & On the Way', labelBn: 'পথে রয়েছে (Shipped)', descEn: 'Handed over to courier express partner', descBn: 'কুরিয়ার পার্টনারের মাধ্যমে ডেলিভারির জন্য পাঠানো হয়েছে' },
  { key: 'DELIVERED', stepNumber: 5, labelEn: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন', descEn: 'Successfully handed over to recipient', descBn: 'গ্রাহকের হাতে সফলভাবে হস্তান্তর করা হয়েছে' },
];

function getStepIndex(status: string): number {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 5;
    case 'SHIPPED':
      return 4;
    case 'PACKAGING':
      return 3;
    case 'CONFIRMED':
      return 2;
    case 'PLACED':
    default:
      return 1;
  }
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('tracking') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<UserOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { orders } = useOrderStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const clean = searchTerm.trim().toLowerCase();

    const found = orders.find(
      (o) =>
        o.orderNumber?.toLowerCase() === clean ||
        o.trackingNumber?.toLowerCase() === clean ||
        o.id?.toLowerCase() === clean ||
        o.shippingAddress?.toLowerCase().includes(clean)
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCopyTrackingLink = () => {
    if (typeof window !== 'undefined' && searchedOrder) {
      const url = `${window.location.origin}/track?id=${encodeURIComponent(searchedOrder.orderNumber || searchedOrder.trackingNumber)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const activeStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 🌟 Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>{mounted && language === 'bn' ? 'সরাসরি পার্সেল ট্র্যাকিং' : 'Direct Parcel Live Tracking'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {mounted && language === 'bn' ? 'আপনার অর্ডার লাইভ ট্র্যাক করুন' : 'Track Your Parcel in Real Time'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {mounted && language === 'bn'
              ? 'লগইন ছাড়াই আপনার Order ID (যেমন: NX-ORD-9021) অথবা কুরিয়ার ট্র্যাকিং কোড দিয়ে তাৎক্ষণিক ডেলিভারি স্ট্যাটাস দেখুন।'
              : 'No login required. Enter your Order ID (e.g. NX-ORD-9021) or Tracking Code to view 24h courier dispatch progress.'}
          </p>
        </div>

        {/* 🌟 Search Box */}
        <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={
                  mounted && language === 'bn'
                    ? 'অর্ডার নম্বর বা ট্র্যাকিং কোড লিখুন (যেমন: NX-ORD-9021)...'
                    : 'Enter Order ID or Tracking Code (e.g. NX-ORD-9021)...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{mounted && language === 'bn' ? 'সার্চ করুন' : 'Track Order'}</span>
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {mounted && language === 'bn' ? 'ডেমো ট্র্যাকিং দেখতে ক্লিক করুন:' : 'Try Demo Order ID:'}
            </span>
            <button
              type="button"
              onClick={() => {
                setQuery('NX-ORD-9021');
                performSearch('NX-ORD-9021');
              }}
              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-mono font-semibold border border-orange-500/20 transition-colors cursor-pointer"
            >
              NX-ORD-9021
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('NX-ORD-8814');
                performSearch('NX-ORD-8814');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              NX-ORD-8814
            </button>
          </div>
        </div>

        {/* 🌟 Result Section */}
        {hasSearched && searchedOrder && (
          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-8 animate-fadeIn">
            
            {/* Top Order Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Order ID:</span>
                  <span className="font-mono text-base font-extrabold text-orange-600 dark:text-orange-400">
                    #{searchedOrder.orderNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    {searchedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Placed on {searchedOrder.date || 'Recent Order'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTrackingLink}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (mounted && language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!') : (mounted && language === 'bn' ? 'ট্র্যাকিং লিংক কপি' : 'Share Link')}</span>
                </button>
              </div>
            </div>

            {/* 🌟 5-Step Visual Progress Stepper */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>{mounted && language === 'bn' ? 'পার্সেল জার্নি স্ট্যাটাস' : 'Parcel Journey Milestones'}</span>
              </h3>

              {/* Stepper Bar for Desktop & Tablet */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-2 text-center">
                {STEP_DEFINITIONS.map((step) => {
                  const isCompleted = activeStepIdx >= step.stepNumber;
                  const isCurrent = activeStepIdx === step.stepNumber;

                  return (
                    <div key={step.key} className="space-y-2">
                      <div className="relative">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30'
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        />
                        {isCurrent && (
                          <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-orange-500 animate-ping opacity-75" />
                        )}
                      </div>
                      <div className="text-left space-y-0.5">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isCompleted
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {mounted && language === 'bn' ? step.labelBn : step.labelEn}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
                          {mounted && language === 'bn' ? step.descBn : step.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vertical Stepper for Mobile */}
              <div className="sm:hidden space-y-3 pl-2 border-l-2 border-orange-500/30">
                {STEP_DEFINITIONS.map((step) => {
                  const isCompleted = activeStepIdx >= step.stepNumber;
                  const isCurrent = activeStepIdx === step.stepNumber;

                  return (
                    <div key={step.key} className="relative pl-4 space-y-0.5">
                      <div
                        className={`absolute -left-[11px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                          isCompleted
                            ? 'bg-orange-500 border-orange-200 dark:border-slate-900'
                            : 'bg-slate-200 dark:bg-slate-800 border-slate-400'
                        } ${isCurrent ? 'ring-4 ring-orange-500/20' : ''}`}
                      />
                      <p
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                        }`}
                      >
                        {mounted && language === 'bn' ? step.labelBn : step.labelEn}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {mounted && language === 'bn' ? step.descBn : step.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🌟 Courier & Dispatch Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-orange-500" />
                  {mounted && language === 'bn' ? 'কুরিয়ার পার্টনার' : 'Courier Partner'}
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {searchedOrder.carrier || 'Pathao Courier Express'}
                </p>
                <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  TRK: {searchedOrder.trackingNumber || 'TRK-NX-88219'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-500" />
                  {mounted && language === 'bn' ? 'প্রত্যাশিত ডেলিভারি (ETA)' : 'Estimated Delivery'}
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {searchedOrder.estimatedDelivery || (searchedOrder.status === 'DELIVERED' ? 'Delivered' : 'Within 24 - 48 Hours')}
                </p>
                <p className="text-[11px] text-slate-500">
                  {mounted && language === 'bn' ? 'পাঠাও এক্সপ্রেস লাইভ হাব আপডেট' : 'Live dispatch hub updates'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-orange-500" />
                  {mounted && language === 'bn' ? 'পেমেন্ট ও সর্বমোট' : 'Payment & Total'}
                </span>
                <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {mounted ? formatCurrency(searchedOrder.total || 0, language) : `৳${(searchedOrder.total || 0).toLocaleString()}`}
                </p>
                <p className="text-[11px] text-slate-500">
                  {searchedOrder.paymentMethod || 'Cash on Delivery'}
                </p>
              </div>
            </div>

            {/* Delivery Destination */}
            {searchedOrder.shippingAddress && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/15 text-xs">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {mounted && language === 'bn' ? 'ডেলিভারি গন্তব্য ঠিকানা:' : 'Delivery Destination:'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">{searchedOrder.shippingAddress}</p>
                </div>
              </div>
            )}

            {/* 🌟 Items in this Order */}
            {searchedOrder.items && searchedOrder.items.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {mounted && language === 'bn' ? `অর্ডারের পণ্যসমূহ (${searchedOrder.items.length} টি)` : `Package Contents (${searchedOrder.items.length} items)`}
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                          <span className="text-[10px] text-slate-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0">
                        {mounted ? formatCurrency(item.price * item.quantity, language) : `৳${(item.price * item.quantity).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href="https://wa.me/8801700000000?text=Hello%20ShopNexus%2C%20I%20need%20assistance%20tracking%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/25 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{mounted && language === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পডেস্কে যোগাযোগ' : 'Live WhatsApp Support'}</span>
              </a>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>{mounted && language === 'bn' ? 'আরও শপিং করুন' : 'Continue Shopping'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* 🌟 Not Found State */}
        {hasSearched && !searchedOrder && (
          <div className="rounded-3xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/25 p-8 text-center space-y-3 animate-fadeIn">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No Order Found'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {mounted && language === 'bn'
                ? 'আপনার ইনপুট করা অর্ডার নম্বর বা ট্র্যাকিং কোডটি সঠিক কি না অনুগ্রহ করে SMS বা ইমেইল থেকে মিলিয়ে পুনরায় চেষ্টা করুন।'
                : 'Please check your Order ID or Tracking Number from your SMS confirmation and try again.'}
            </p>
          </div>
        )}

        {/* 🌟 Trust Features / How It Works (Shown when idle or below result) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">
              ১
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'তাৎক্ষণিক SMS আপডেট' : 'Instant SMS Alerts'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {mounted && language === 'bn'
                ? 'অর্ডার প্লেস করা মাত্রই কুরিয়ার ট্র্যাকিং নম্বর সহ SMS পৌঁছে যাবে।'
                : 'Receive real-time tracking code directly on your phone upon confirmation.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              ২
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '২৪-৪৮ ঘণ্টা এক্সপ্রেস ডেলিভারি' : '24-48h Express Shipping'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {mounted && language === 'bn'
                ? 'পাঠাও এক্সপ্রেস ও স্টিডফাস্ট লজিস্টিকসের মাধ্যমে দ্রুততম ডেলিভারি।'
                : 'Fast tracked logistics via Pathao Courier & Steadfast across Bangladesh.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
              ৩
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? '১০০% ক্যাশ অন ডেলিভারি' : '100% COD & Return'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {mounted && language === 'bn'
                ? 'পণ্য হাতে পেয়ে চেক করে টাকা পরিশোধের পূর্ণ নিশ্চয়তা ও ৭ দিনের রিটার্ন।'
                : 'Check package on delivery before payment with 7-day verified returns.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070a12] text-slate-500">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Truck className="w-4 h-4 animate-bounce text-orange-500" />
            <span>Loading live tracking...</span>
          </div>
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
