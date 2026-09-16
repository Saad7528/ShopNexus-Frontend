'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  X,
  Tag,
  TrendingDown,
  Sparkles,
  CheckCheck,
  Package,
  ArrowRight,
  Trash2,
  LogIn,
  UserCheck,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import { useHydrated } from '@/lib/useHydrated';

export const NotificationDrawer: React.FC = () => {
  const {
    isOpen,
    notifications,
    unreadCount,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    removeNotification,
  } = useNotificationStore();

  const { isAuthenticated, user } = useAuthStore();
  const { language, t } = useLanguageStore();
  const mounted = useHydrated();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in-50">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {mounted && language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notification Center'}
                  {mounted && isAuthenticated && unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold animate-pulse">
                      {language === 'bn' ? toBengaliNumber(unreadCount) : unreadCount} {language === 'bn' ? 'নতুন' : 'New'}
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {mounted && language === 'bn' ? 'প্রাইস ড্রপ, অফার ও লাইভ আপডেট' : 'Price Drops, Promos & Real-Time Alerts'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {mounted && isAuthenticated && notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-semibold transition-colors cursor-pointer border border-red-500/20"
                  title={mounted && language === 'bn' ? 'সব নোটিফিকেশন মুছুন' : 'Clear all notifications'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {mounted && language === 'bn' ? 'সব মুছুন' : 'Clear All'}
                </button>
              )}
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* 1. GUEST MODE STATE */}
            {mounted && !isAuthenticated ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-orange-500/5 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-600 dark:text-orange-400 shadow-lg shadow-orange-500/10">
                  <Bell className="w-7 h-7" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-slate-300">
                    0
                  </span>
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    <UserCheck className="w-3 h-3 text-orange-500" />
                    {language === 'bn' ? 'গেস্ট মোড ব্রাউজিং' : 'Browsing as Guest'}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? 'ব্যক্তিগত নোটিফিকেশন পেতে লগইন করুন' : 'Sign in to access Live Alerts'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'গেস্ট ব্যবহারকারীদের জন্য কোনো সংরক্ষিত নোটিফিকেশন নেই। উইশলিস্টের প্রাইস ড্রপ, বিশেষ অফার এবং অর্ডার ট্র্যাকিং অ্যালার্ট পেতে আপনার অ্যাকাউন্টে সাইন ইন করুন।'
                      : 'You do not have any notifications as a guest. Log in to track price drops on your wishlist items, exclusive discount codes, and order delivery status.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                  <Link
                    href="/login"
                    onClick={closeDrawer}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <LogIn className="w-4 h-4" />
                    {language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign In to Your Account'}
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeDrawer}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create Free Account'}
                  </Link>
                </div>
              </div>
            ) : /* 2. AUTHENTICATED USER STATE */
            notifications.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {mounted && language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : "You're all caught up!"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {mounted && language === 'bn'
                    ? 'আপনার উইশলিস্টের কোনো পণ্যের দাম কমলে বা নতুন কোনো প্রমো কোড আসলে সাথে সাথে এখানে নোটিফিকেশন পাবেন।'
                    : 'We will notify you here when prices drop on your wishlist items or new flash promos go live.'}
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer shadow-sm group ${
                    n.isRead
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-85'
                      : 'bg-white dark:bg-slate-900/90 border-orange-500/40 shadow-md shadow-orange-500/5'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n._id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={mounted && language === 'bn' ? 'মুছে ফেলুন' : 'Dismiss notification'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-3">
                    {/* Icon or Image */}
                    {n.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                        <Image src={n.imageUrl} alt={n.title} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 dark:border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                        {n.type === 'price_drop' ? (
                          <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : n.type === 'order_update' ? (
                          <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            n.type === 'price_drop'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : n.type === 'order_update'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          }`}
                        >
                          {n.type === 'price_drop'
                            ? mounted && language === 'bn' ? 'প্রাইস ড্রপ' : 'Price Drop'
                            : n.type === 'order_update'
                            ? mounted && language === 'bn' ? 'অর্ডার আপডেট' : 'Order Update'
                            : mounted && language === 'bn' ? 'স্পেশাল অফার' : 'Promo'}
                        </span>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>

                      {typeof n.oldPrice === 'number' && typeof n.newPrice === 'number' && (
                        <div className="flex items-center gap-2 mt-1.5 font-mono text-xs">
                          <span className="line-through text-slate-400 dark:text-slate-500">
                            {mounted ? formatCurrency(n.oldPrice, language) : `৳${n.oldPrice}`}
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {mounted ? formatCurrency(n.newPrice, language) : `৳${n.newPrice}`}
                          </span>
                        </div>
                      )}

                      {n.linkUrl && (
                        <Link
                          href={n.linkUrl}
                          onClick={closeDrawer}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 mt-2 transition-colors"
                        >
                          {mounted && language === 'bn' ? 'অফারটি দেখুন' : 'View Deal'} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
