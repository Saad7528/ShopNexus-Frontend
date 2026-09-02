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
} from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';

export const NotificationDrawer: React.FC = () => {
  const {
    isOpen,
    notifications,
    unreadCount,
    closeDrawer,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in-50">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-md transition-all duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
    
          <div className="p-5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 dark:border-orange-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Notification Center
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-orange-500 text-white font-bold animate-pulse">
                      {unreadCount} New
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Price Drops, Promos & Real-Time Alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No new notifications</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">We will notify you when prices drop on your wishlist!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                    n.isRead
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80'
                      : 'bg-white dark:bg-slate-900/90 border-orange-500/40 shadow-md shadow-orange-500/5'
                  }`}
                >
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                            n.type === 'price_drop'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          }`}
                        >
                          {n.type.replace('_', ' ')}
                        </span>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>

                      {n.oldPrice && n.newPrice && (
                        <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                          <span className="line-through text-slate-400 dark:text-slate-500">৳{n.oldPrice}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{n.newPrice}</span>
                        </div>
                      )}

                      {n.linkUrl && (
                        <Link
                          href={n.linkUrl}
                          onClick={closeDrawer}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 mt-2 transition-colors"
                        >
                          View Deal <ArrowRight className="w-3 h-3" />
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
