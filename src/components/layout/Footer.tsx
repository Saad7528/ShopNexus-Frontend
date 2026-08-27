'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    color: 'hover:bg-[#1877F2] hover:border-[#1877F2] text-slate-600 dark:text-slate-400 hover:text-white',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com',
    color: 'hover:bg-black hover:border-black text-slate-600 dark:text-slate-400 hover:text-white',
    svg: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    color: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent text-slate-600 dark:text-slate-400 hover:text-white',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me',
    color: 'hover:bg-[#229ED9] hover:border-[#229ED9] text-slate-600 dark:text-slate-400 hover:text-white',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    color: 'hover:bg-[#FF0000] hover:border-[#FF0000] text-slate-600 dark:text-slate-400 hover:text-white',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

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
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-10 sm:mt-12">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-9">
          {/* 1. Brand Column */}
          <div className="space-y-3">
            <BrandLogo size="md" showSubtitle={false} />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ShopNexus is a premium next-gen e-commerce platform delivering authentic gadgets, ultra-fast delivery, and seamless online shopping experiences across Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>100% Secure & PCI-DSS Compliant</span>
            </div>
          </div>

          {/* 2. Customer Care & FAQ Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Customer Care & Info</h4>
            <ul className="space-y-1.5 text-xs">
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
                  Delivery Rates (Inside Dhaka ৳60 / Outside ৳120)
                </Link>
              </li>
              <li>
                <Link href="/profile?tab=orders" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  7-Day Replacement Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Catalog Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-1.5 text-xs">
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

          {/* 4. Newsletter & Social Media Column */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Exclusive Insider Deals</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Subscribe to get exclusive product drops, flash sale alerts, and VIP voucher codes.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you! Coupon code <strong>WELCOME10</strong> unlocked.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-xs"
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

            {/* Social Media Links */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-all duration-200 shadow-xs ${soc.color}`}
                    title={soc.name}
                  >
                    {soc.svg}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ultra-Slim Copyright Bar */}
        <div className="mt-7 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNexus Platform. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">About Us</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-400 transition-colors">FAQ & Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
