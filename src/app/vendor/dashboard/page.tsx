'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVendorStore } from '@/store/useVendorStore';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Store,
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Settings,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { profile } = useVendorStore();

  return (
    <RoleGuard allowedRoles={['vendor', 'admin']}>
      <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Store Banner Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="relative h-48 md:h-64 w-full bg-slate-800">
              {profile?.storeBanner && (
                <Image
                  src={profile.storeBanner}
                  alt="Store Banner"
                  fill
                  priority
                  className="object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent" />
            </div>

            <div className="relative -mt-16 px-6 pb-6 md:px-10 md:pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="flex items-end gap-5">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-[#0b0f19] bg-slate-800 shadow-2xl">
                  {profile?.storeLogo ? (
                    <Image
                      src={profile.storeLogo}
                      alt={profile.storeName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-3xl">
                      {profile?.storeName?.charAt(0) || 'V'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      {profile?.storeName || 'Vendor Merchant Portal'}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1 max-w-xl line-clamp-1">
                    {profile?.storeDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  href={`/shop/${profile?.id || 'vendor_001'}`}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> View Public Store
                </Link>
                <Link
                  href="/vendor/settings"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Store Settings
                </Link>
              </div>
            </div>
          </div>

          {/* KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Total Store Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">
                  ${profile?.totalRevenue?.toLocaleString() || '34,850'}
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.6% this month
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Total Orders</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">
                  {profile?.totalOrders || 142}
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-indigo-400">
                  <TrendingUp className="w-3.5 h-3.5" /> 98.4% fulfillment rate
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Active Products</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">
                  {profile?.totalProducts || 24} Items
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-400">
                  All in active circulation
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Support Status</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-lg font-bold text-white block truncate">
                  {profile?.supportEmail || 'support@nexustech.io'}
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                  ● Live 24/7 Priority
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Product Inventory Actions</h3>
              <p className="text-slate-400 text-sm">Add new SKU items, update pricing or adjust stock variations.</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Manage Product Catalog
            </Link>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
