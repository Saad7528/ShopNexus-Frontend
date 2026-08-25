'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hide Footer on auth pages and Admin panel
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-20">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">২৪ ঘণ্টার ডেলিভারি</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">ঢাকার ভেতরে মাত্র ৳৬০ / সারাদেশে ৳১২০</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">বিকাশ, নগদ ও COD</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">ইনস্ট্যান্ট ক্যাশব্যাক অথবা পণ্য দেখে পেমেন্ট</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">৭ দিনের সহজ রিটার্ন</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">১০০% মানি-ব্যাক ও রিপ্লেসমেন্ট সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">১ বছরের ওয়ারেন্টি</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">জেনুইন অফিশিয়াল গ্যাজেট ও লাইভ সাপোর্ট</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column (1.5 cols) */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">ShopNexus</span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ShopNexus হলো একটি প্রিমিয়াম নেক্সট-জেন ই-কমার্স প্ল্যাটফর্ম। জেনুইন গ্যাজেট, দ্রুত ডেলিভারি এবং নিরবচ্ছিন্ন অনলাইন শপিংয়ের নির্ভরযোগ্য ঠিকানা।
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>100% Secure & PCI-DSS Compliant</span>
            </div>
          </div>

          {/* Customer Care & FAQ Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Customer Care & Info</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium">
                  About ShopNexus
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Delivery Rates (ঢাকার ভেতরে ৳৬০)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Live Order Tracking Tool
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  7-Day Replacement Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Audio" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link href="/products?category=Keyboards" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Custom Keyboards
                </Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Desk Setups & Gear
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
                  ⚡ Flash Sale (Up to 40% OFF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Ecosystem Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vendor/dashboard" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Vendor Merchant Hub
                </Link>
              </li>
              <li>
                <Link href="/vendor/settings" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Become a Verified Seller
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Admin Analytics Portal
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  My Orders & Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Exclusive Insider Deals</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              নতুন ড্রপ এবং স্পেশাল ভাউচার কোডের আপডেট পেতে সাবস্ক্রাইব করুন।
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>ধন্যবাদ! কুপন কোড <strong>WELCOME10</strong> আনলক হয়েছে।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="আপনার ইমেইল দিন..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Subscribe (10% Off)
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNexus Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">About Us</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">FAQ & Help</Link>
            <span>•</span>
            <span className="text-orange-600 dark:text-orange-400 font-mono">v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
