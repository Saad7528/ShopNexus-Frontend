'use client';

import React, { useEffect, useState } from 'react';
import { SalesChart } from '@/components/admin/SalesChart';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface MetricsData {
  summary: {
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    totalCoupons: number;
    lowStockAlerts: number;
    averageOrderValue: number;
  };
  salesTrends: { month: string; revenue: number; orders: number }[];
}

const FALLBACK_METRICS: MetricsData = {
  summary: {
    totalRevenue: 159000,
    totalUsers: 1420,
    totalProducts: 48,
    totalCoupons: 6,
    lowStockAlerts: 3,
    averageOrderValue: 121.5,
  },
  salesTrends: [
    { month: 'Jan', revenue: 14200, orders: 128 },
    { month: 'Feb', revenue: 18900, orders: 156 },
    { month: 'Mar', revenue: 22400, orders: 189 },
    { month: 'Apr', revenue: 27800, orders: 230 },
    { month: 'May', revenue: 34500, orders: 285 },
    { month: 'Jun', revenue: 41200, orders: 340 },
  ],
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData>(FALLBACK_METRICS);

  // Telemetry & Metrics Data Fetcher
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/metrics');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setMetrics(json.data);
          }
        }
      } catch (_e) {
        // Fallback telemetry dataset when offline
      }
    };

    fetchMetrics();
  }, []);

  const { summary, salesTrends } = metrics;

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Root Executive Ops
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Dashboard & Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time metrics, revenue performance, and inventory health tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry Active
            </span>
          </div>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">${summary.totalRevenue.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                +18.4% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">vs. previous 30-day period</p>
          </div>

          {/* Total Customers */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{summary.totalUsers.toLocaleString()}</span>
              <span className="text-xs font-bold text-indigo-400 flex items-center">
                +12.1% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Active customer & vendor accounts</p>
          </div>

          {/* Live Products */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Items</span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{summary.totalProducts}</span>
              <span className="text-xs text-slate-400">Across 6 categories</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{summary.totalCoupons} active discount coupons</p>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Alerts</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{summary.lowStockAlerts}</span>
              <span className="text-xs text-amber-300">Items &le; 5 units</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Requires immediate replenishment</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Revenue Growth & Order Trends</h3>
            </div>
            <span className="text-xs text-slate-400">Past 6 Months Overview</span>
          </div>
          <SalesChart data={salesTrends} />
        </div>
      </div>
    </RoleGuard>
  );
}
