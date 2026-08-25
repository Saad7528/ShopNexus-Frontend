'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SalesChart, SalesDataPoint } from '@/components/admin/SalesChart';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Clock,
  Eye,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

type TimeRange = '7days' | '30days' | '6months' | 'year';

const TIME_SERIES_DATA: Record<
  TimeRange,
  {
    totalRevenue: number;
    totalOrders: number;
    aov: number;
    growth: string;
    chart: SalesDataPoint[];
  }
> = {
  '7days': {
    totalRevenue: 145000,
    totalOrders: 62,
    aov: 2338,
    growth: '+14.2% vs last week',
    chart: [
      { label: 'Mon', revenue: 18000, orders: 8 },
      { label: 'Tue', revenue: 22000, orders: 10 },
      { label: 'Wed', revenue: 16500, orders: 7 },
      { label: 'Thu', revenue: 28000, orders: 12 },
      { label: 'Fri', revenue: 19500, orders: 8 },
      { label: 'Sat', revenue: 21000, orders: 9 },
      { label: 'Sun', revenue: 20000, orders: 8 },
    ],
  },
  '30days': {
    totalRevenue: 680000,
    totalOrders: 285,
    aov: 2385,
    growth: '+19.8% vs last month',
    chart: [
      { label: 'Week 1', revenue: 155000, orders: 65 },
      { label: 'Week 2', revenue: 172000, orders: 72 },
      { label: 'Week 3', revenue: 168000, orders: 70 },
      { label: 'Week 4', revenue: 185000, orders: 78 },
    ],
  },
  '6months': {
    totalRevenue: 3450000,
    totalOrders: 1420,
    aov: 2430,
    growth: '+28.4% vs prev 6mo',
    chart: [
      { label: 'Jan', revenue: 380000, orders: 156 },
      { label: 'Feb', revenue: 490000, orders: 198 },
      { label: 'Mar', revenue: 540000, orders: 220 },
      { label: 'Apr', revenue: 610000, orders: 250 },
      { label: 'May', revenue: 690000, orders: 285 },
      { label: 'Jun', revenue: 740000, orders: 311 },
    ],
  },
  year: {
    totalRevenue: 7200000,
    totalOrders: 2980,
    aov: 2416,
    growth: '+42.1% YoY Annual',
    chart: [
      { label: 'Q1', revenue: 1410000, orders: 574 },
      { label: 'Q2', revenue: 2040000, orders: 846 },
      { label: 'Q3 (Est)', revenue: 1950000, orders: 810 },
      { label: 'Q4 (Est)', revenue: 1800000, orders: 750 },
    ],
  },
};

const AUDIT_LOGS = [
  {
    id: 'log-1',
    user: 'Saad (Super Admin)',
    action: 'Published Flash Sale drop: Sony WH-1000XM5',
    time: '4 mins ago',
    badge: 'Catalog',
  },
  {
    id: 'log-2',
    user: 'Delivery Officer',
    action: 'Dispatched Order #ORD-9021 with Pathao Courier',
    time: '18 mins ago',
    badge: 'Logistics',
  },
  {
    id: 'log-3',
    user: 'Telesales Executive',
    action: 'Verified & Confirmed Customer Order #ORD-9029',
    time: '35 mins ago',
    badge: 'Orders',
  },
  {
    id: 'log-4',
    user: 'Inventory Manager',
    action: 'Replenished Keychron Q1 Pro Stock (+25 units)',
    time: '1 hour ago',
    badge: 'Stock',
  },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');

  const currentData = TIME_SERIES_DATA[timeRange];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Executive Ops
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Executive Dashboard & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time Bangladeshi Taka (৳) revenue analytics, inventory health, and live staff audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Visitors Badge */}
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>38 Live Visitors</span>
            </div>
          </div>
        </div>

        {/* 5 Enterprise KPI Cards Grid (Dynamic according to Time Range) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Revenue */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">৳ BDT</div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">৳{currentData.totalRevenue.toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              {currentData.growth} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          {/* Total Orders */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Orders</span>
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{currentData.totalOrders.toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
              99.2% Fulfillment
            </span>
          </div>

          {/* Average Order Value (AOV) */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average AOV</span>
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">৳{currentData.aov.toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">Per cart transaction</span>
          </div>

          {/* Return Rate */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Return Rate</span>
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">0.8%</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">Healthy delivery rate</span>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock</span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">3 items</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block mt-1">Threshold &le; 5 units</span>
          </div>
        </div>

        {/* Super Admin Profile Card & System Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/25">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">S.M. Amirul Islam Saad</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-mono mt-0.5">admin@shopnexus.io • ID: ADM-001</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Role: Lead Full-Stack Architect</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2FA Enforced</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active Master Session</span></span>
              <Link
                href="/admin/inventory"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                Upload & Manage Catalog
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform Health & Telemetry</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Atlas Cloud Database</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected (99.9%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">AI Chatbot Fallback Engine</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">Gemini + Groq Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Logistics API Gateway</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">4 Courier Partners Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart with Time-Range Switcher & Live Staff Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart with 7 Days / 30 Days / 6 Months / Year Switcher (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Growth (৳ BDT)</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Dynamic sales & order volume analysis</span>
                </div>
              </div>

              {/* ⏱️ Dynamic Time-Range Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTimeRange('7days')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === '7days'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('30days')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === '30days'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('6months')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === '6months'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('year')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === 'year'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Year 2026
                </button>
              </div>
            </div>

            <SalesChart data={currentData.chart} />
          </div>

          {/* Audit Logs / Activity Trail (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Staff Audit Trail</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Live Timestamp</span>
            </div>

            <div className="space-y-3">
              {AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">{log.user}</span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
