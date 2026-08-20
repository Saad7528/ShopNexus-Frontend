'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 mt-20">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Courier</h4>
                <p className="text-[11px] text-slate-500">Free delivery on orders $150+</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">256-Bit SSL</h4>
                <p className="text-[11px] text-slate-500">Stripe & SSLCommerz encrypted</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Returns</h4>
                <p className="text-[11px] text-slate-500">Hassle-free money back policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 Support</h4>
                <p className="text-[11px] text-slate-500">Direct assistance from verified team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">ShopNexus</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ShopNexus is a high-performance, multi-vendor e-commerce platform built for modern commerce with Next.js 16, TypeScript, Zustand, and MongoDB ACID transactions.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>PCI-DSS Compliant & Secured</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Audio" className="hover:text-indigo-400 transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link href="/products?category=Electronics" className="hover:text-indigo-400 transition-colors">
                  Electronics & Wearables
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gaming" className="hover:text-indigo-400 transition-colors">
                  Gaming Gear & Peripherals
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  ⚡ Flash Sale Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Hub Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ecosystem Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/vendor/dashboard" className="hover:text-indigo-400 transition-colors">
                  Vendor Merchant Hub
                </Link>
              </li>
              <li>
                <Link href="/vendor/settings" className="hover:text-indigo-400 transition-colors">
                  Store Profile Settings
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-indigo-400 transition-colors">
                  Admin Analytics Ops
                </Link>
              </li>
              <li>
                <Link href="/admin/inventory" className="hover:text-indigo-400 transition-colors">
                  Stock & Inventory Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Exclusive Insider Deals</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified of instant promo codes, flash sales, and new drops.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you! Promo code <strong>WELCOME10</strong> unlocked.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Subscribe & Get 10% Off
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNexus Platform. All rights reserved. Strict Monorepo Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="text-indigo-400 font-mono">v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
