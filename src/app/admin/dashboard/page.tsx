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
  X,
  ArrowRight,
  Wallet,
  ShoppingBag,
  PieChart,
  ShieldAlert,
  Phone,
  Mail,
  FileText,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type TimeRange = '7days' | '30days' | '6months' | 'year';
type DashboardModalType = 'none' | 'revenue' | 'orders' | 'aov' | 'returns' | 'staff-logs';

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

// 💳 REVENUE SETTLEMENT LEDGER MOCK DATA
const REVENUE_LEDGER = [
  {
    id: 'TRX-BK-99214',
    date: '30 Aug 2026, 09:42 PM',
    customer: 'Tanvir Hasan',
    item: 'Sony WH-1000XM5 ANC Headphones',
    method: 'bKash Merchant',
    methodType: 'MFS Gateway',
    amount: 38500,
    status: 'Settled (Instant)',
  },
  {
    id: 'TRX-NG-88310',
    date: '30 Aug 2026, 07:15 PM',
    customer: 'Farzana Akhter',
    item: 'Apple Watch Ultra 2 Aerospace Titanium',
    method: 'Nagad Direct',
    methodType: 'MFS Gateway',
    amount: 79900,
    status: 'Settled (Instant)',
  },
  {
    id: 'TRX-VS-44102',
    date: '30 Aug 2026, 04:30 PM',
    customer: 'Zubair Hossain',
    item: 'Keychron Q1 Pro Wireless Keyboard',
    method: 'City Bank Visa/Mastercard',
    methodType: 'Card Gateway',
    amount: 21500,
    status: 'Cleared to Bank',
  },
  {
    id: 'TRX-COD-1192',
    date: '29 Aug 2026, 08:20 PM',
    customer: 'Nusrat Jahan',
    item: 'Bose QuietComfort Ultra Spatial Audio',
    method: 'Cash on Delivery (Pathao)',
    methodType: 'COD Escrow',
    amount: 42000,
    status: 'Collected by Courier',
  },
  {
    id: 'TRX-BK-99180',
    date: '29 Aug 2026, 02:10 PM',
    customer: 'Mahmudul Hasan',
    item: 'Razer Viper V2 Pro Gaming Mouse',
    method: 'bKash Merchant',
    methodType: 'MFS Gateway',
    amount: 15500,
    status: 'Settled (Instant)',
  },
];

// 📦 RECENT ORDERS SUMMARY MOCK DATA
const RECENT_ORDERS_SUMMARY = [
  {
    id: 'ORD-9029',
    customer: 'Tanvir Hasan',
    items: 'Sony WH-1000XM5 (Silver & Black) × 1',
    amount: 38500,
    payment: 'Paid via bKash',
    status: 'Processing',
    courier: 'Pathao Courier #PAT-8812',
  },
  {
    id: 'ORD-9028',
    customer: 'Farzana Akhter',
    items: 'Apple Watch Ultra 2 (Titanium) × 1',
    amount: 79900,
    payment: 'Paid via Nagad',
    status: 'Dispatched',
    courier: 'Steadfast #STD-4401',
  },
  {
    id: 'ORD-9027',
    customer: 'Zubair Hossain',
    items: 'Keychron Q1 Pro (Carbon Gray) × 1',
    amount: 21500,
    payment: 'Paid via Visa',
    status: 'Delivered',
    courier: 'Paperfly #PFL-9921',
  },
  {
    id: 'ORD-9026',
    customer: 'Nusrat Jahan',
    items: 'Bose QC Ultra (White Smoke) × 1',
    amount: 42000,
    payment: 'Cash on Delivery',
    status: 'In Transit',
    courier: 'RedX Express #RDX-1120',
  },
];

// 🔄 RETURN RATE & CUSTOMER DISPUTE REGISTRY MOCK DATA
const RETURN_REGISTRY = [
  {
    id: 'RET-001',
    orderId: 'ORD-8812',
    date: '26 Aug 2026',
    customer: 'Raihan Kabir',
    phone: '01711-889922',
    product: 'Keychron Q1 Pro Mechanical Keyboard',
    amount: 21500,
    reason: 'Customer changed mind / Preferred brown switch over red',
    returnCount: 2,
    riskLevel: 'High Risk (Repeat Returns)',
    status: 'Returned & Restocked',
    reminderAlert: '⚠️ Repeat Return Customer - Require ৳150 Advance Courier Charge on future COD orders',
  },
  {
    id: 'RET-002',
    orderId: 'ORD-8740',
    date: '22 Aug 2026',
    customer: 'Mehzabin Chowdhury',
    phone: '01822-445566',
    product: 'Apple Watch Ultra 2 Loop',
    amount: 79900,
    reason: 'Wrist strap size mismatch (Requested M/L instead of S)',
    returnCount: 1,
    riskLevel: 'Low Risk',
    status: 'Exchange Unit Dispatched',
    reminderAlert: '✅ Verified Size Exchange - No shipping penalty required',
  },
  {
    id: 'RET-003',
    orderId: 'ORD-8699',
    date: '18 Aug 2026',
    customer: 'Shakib Al Amin',
    phone: '01933-778899',
    product: 'Sony WH-1000XM5 ANC',
    amount: 32500,
    reason: 'Courier box seal damaged in transit',
    returnCount: 1,
    riskLevel: 'Neutral (Courier Issue)',
    status: 'Insurance Reimbursed',
    reminderAlert: '🛡️ Courier Packaging Issue - Customer account in good standing',
  },
];

// 👥 STAFF WORK TIMESHEET MOCK DATA
const STAFF_TIMESHEET = [
  {
    id: 'st-1',
    name: 'S.M. Amirul Islam Saad',
    initials: 'S',
    role: 'Super Admin / Lead Architect',
    clockIn: 'Today, 09:00 AM',
    lastActive: 'Active Now',
    sessionDuration: '6h 12m',
    actionsCount: 38,
    status: 'Online',
  },
  {
    id: 'st-2',
    name: 'Tahmidur Rahman',
    initials: 'T',
    role: 'Inventory & Catalog Manager',
    clockIn: 'Today, 09:30 AM',
    lastActive: '12m ago',
    sessionDuration: '5h 40m',
    actionsCount: 24,
    status: 'Online',
  },
  {
    id: 'st-3',
    name: 'Farzana Yeasmin',
    initials: 'F',
    role: 'Customer Care Lead',
    clockIn: 'Today, 10:15 AM',
    lastActive: '35m ago',
    sessionDuration: '4h 55m',
    actionsCount: 19,
    status: 'Idle',
  },
  {
    id: 'st-4',
    name: 'Kamrul Hasan',
    initials: 'K',
    role: 'Logistics & Dispatch Officer',
    clockIn: 'Today, 08:45 AM',
    lastActive: 'Active Now',
    sessionDuration: '6h 25m',
    actionsCount: 42,
    status: 'Online',
  },
];

const AUDIT_LOGS = [
  {
    id: 'log-1',
    user: 'Saad (Super Admin)',
    action: 'Published Flash Sale drop: Sony WH-1000XM5 (৳32,500)',
    time: '4 mins ago',
    badge: 'Catalog',
  },
  {
    id: 'log-2',
    user: 'Kamrul (Logistics)',
    action: 'Dispatched Order #ORD-9029 with Pathao Courier',
    time: '18 mins ago',
    badge: 'Logistics',
  },
  {
    id: 'log-3',
    user: 'Farzana (Customer Support)',
    action: 'Verified & Confirmed Customer Order #ORD-9028',
    time: '35 mins ago',
    badge: 'Orders',
  },
  {
    id: 'log-4',
    user: 'Tahmidur (Inventory)',
    action: 'Replenished Keychron Q1 Pro Stock (+25 units)',
    time: '1 hour ago',
    badge: 'Stock',
  },
  {
    id: 'log-5',
    user: 'Saad (Super Admin)',
    action: 'Configured Ramadan Mega Cashback Campaign (10%)',
    time: '2 hours ago',
    badge: 'Campaign',
  },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');
  const [liveVisitors, setLiveVisitors] = useState(38);
  const [activeModal, setActiveModal] = useState<DashboardModalType>('none');
  const [staffTab, setStaffTab] = useState<'timesheet' | 'audit-trail'>('timesheet');

  useEffect(() => {
    // Dynamic real-time visitor fluctuation (±1-3 active sessions)
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextVal = prev + delta;
        return Math.max(31, Math.min(52, nextVal));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
            {/* Dynamic Live Visitors Badge with Pulsing Beacon */}
            <div
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-xs"
              title="Real-time live active shopper sessions"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{liveVisitors} Live Visitors</span>
            </div>
          </div>
        </div>

        {/* 5 Enterprise KPI Cards Grid (Every Card is Fully Interactive & Clickable!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Total Revenue Card (Click to open Revenue Ledger) */}
          <button
            type="button"
            onClick={() => setActiveModal('revenue')}
            className="group bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-xl text-left cursor-pointer block"
            title="Click to view full Revenue Breakdown & Transaction Ledger"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Revenue
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs group-hover:scale-110 transition-transform">
                ৳ BDT
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ৳{currentData.totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Ledger &rarr;
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              {currentData.growth} <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>

          {/* 2. Total Orders Card (Click to open Orders Overview & Ledger) */}
          <button
            type="button"
            onClick={() => setActiveModal('orders')}
            className="group bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-orange-500/60 dark:hover:border-orange-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-xl text-left cursor-pointer block"
            title="Click to view all live orders & amounts"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Orders
              </span>
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentData.totalOrders.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View &rarr;
              </span>
            </div>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
              99.2% Fulfillment
            </span>
          </button>

          {/* 3. Average Order Value (AOV) Card (Click to open AOV analytics) */}
          <button
            type="button"
            onClick={() => setActiveModal('aov')}
            className="group bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-violet-500/60 dark:hover:border-violet-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-xl text-left cursor-pointer block"
            title="Click to view Average Basket & Customer AOV Analytics"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Average AOV
              </span>
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ৳{currentData.aov.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Analysis &rarr;
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">Per cart transaction</span>
          </button>

          {/* 4. Return Rate Card (Click to open Return Registry & Customer History) */}
          <button
            type="button"
            onClick={() => setActiveModal('returns')}
            className="group bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-xl text-left cursor-pointer block"
            title="Click to view Return Cases & Customer Reminder Alerts"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Return Rate
              </span>
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">0.8%</span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Registry &rarr;
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">12 returned items</span>
          </button>

          {/* 5. Stock Alerts (Interactive Link to Low Stock Inventory) */}
          <Link
            href="/admin/inventory?filter=low-stock"
            className="group bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-xl block cursor-pointer"
            title="Click to view all low stock items"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Low Stock
              </span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">3 items</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View &rarr;
              </span>
            </div>
            <span className="text-[10px] font-semibold text-amber-600/80 dark:text-amber-400/80 block mt-1">Threshold &le; 5 units</span>
          </Link>
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

          {/* Audit Logs / Activity Trail (5 cols - Interactive button to open full Staff Timesheet) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Staff Audit Trail</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('staff-logs')}
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Timesheet & Logs <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {AUDIT_LOGS.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  onClick={() => setActiveModal('staff-logs')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1 hover:border-orange-500/40 transition-colors cursor-pointer"
                >
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

        {/* 🌟 1. REVENUE INFLOW LEDGER MODAL */}
        {activeModal === 'revenue' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Revenue Inflow & Settlement Ledger</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Transaction history with dates, payment gateways, and BDT amounts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Quick Settlement Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Settled Revenue</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">৳{currentData.totalRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{currentData.growth}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">MFS Inflow (bKash/Nagad)</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">৳2,630,000</div>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">76.2% of Total Inflow</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Card & COD Escrow</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">৳820,000</div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Bank Cleared</span>
                </div>
              </div>

              {/* Inflow Transaction Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date & TRX ID</th>
                      <th className="px-4 py-3">Customer & Item</th>
                      <th className="px-4 py-3">Gateway</th>
                      <th className="px-4 py-3 text-right">Inflow Amount (৳)</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {REVENUE_LEDGER.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{trx.date}</span>
                          <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400">{trx.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 dark:text-white block">{trx.customer}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{trx.item}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {trx.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                          +৳{trx.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">Showing latest live gateway settlements in Bangladeshi Taka</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Ledger
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 2. ORDERS OVERVIEW & GROSS VOLUME MODAL */}
        {activeModal === 'orders' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Customer Sales Orders Breakdown</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Total {currentData.totalOrders.toLocaleString()} orders generated across Bangladesh</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Volume</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{currentData.totalOrders.toLocaleString()} Orders</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">99.2% Fulfillment Rate</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Order Value</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">৳{currentData.totalRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">All Items Verified</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Items / Cart</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">2.4 Items</div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Multi-item conversion</span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Order ID & Customer</th>
                      <th className="px-4 py-3">Purchased Items</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-right">Order Value (৳)</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {RECENT_ORDERS_SUMMARY.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-bold text-orange-600 dark:text-orange-400 font-mono block">{ord.id}</span>
                          <span className="text-[11px] text-slate-900 dark:text-white font-semibold">{ord.customer}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-[11px]">
                          {ord.items}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                            {ord.payment}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-black text-slate-900 dark:text-white">
                          ৳{ord.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:from-[#e63d00] hover:to-[#ff6600] transition-all cursor-pointer"
                >
                  Manage All Orders in Order Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 3. AVERAGE ORDER VALUE (AOV) ANALYTICS MODAL */}
        {activeModal === 'aov' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Average Order Value (AOV) Analytics</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Cart sizing, customer purchasing power, and category breakdown</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Key AOV Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Current Benchmark AOV</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">৳{currentData.aov.toLocaleString()} BDT</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Calculated across {currentData.totalOrders.toLocaleString()} confirmed checkout sessions</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    +12.8% vs Q1
                  </span>
                </div>
              </div>

              {/* Basket Size Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Cart Basket Sizing Distribution</h4>
                
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Single Item Carts (42% volume)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">Avg ৳1,850</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Multi-item Bundle Carts (48% volume)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">Avg ৳3,420</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">High-Ticket Enthusiast Bundles (10% volume)</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">Avg ৳6,950</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Cross-Sell Optimization Active
                </span>
                <p>
                  Free delivery threshold set at ৳3,000 encourages customers to add accessories, boosting average cart size from ৳2,050 to ৳2,430.
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 4. RETURN RATE REGISTRY & CUSTOMER DISPUTE REMINDER MODAL */}
        {activeModal === 'returns' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Return Rate Registry & Customer Risk Profiles (0.8%)</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Track returned items and automatically remind staff about past return customers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Return Metrics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Return Rate</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0.8%</div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">12 items out of 1,420 orders</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Industry Standard</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">3.5%</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Healthy performance</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Flagged Profiles</span>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">3 Accounts</div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Advance courier alert</span>
                </div>
              </div>

              {/* Customer Return Case Cards with Automated Alert Flags */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Detailed Customer Return Cases & Automated Alerts
                </h4>

                {RETURN_REGISTRY.map((ret) => (
                  <div
                    key={ret.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{ret.customer}</span>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-orange-500" /> {ret.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400 font-bold">{ret.orderId}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                          {ret.date}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Returned Product:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{ret.product} (৳{ret.amount.toLocaleString()})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Return Reason:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{ret.reason}</span>
                      </div>
                    </div>

                    {/* Automated Reminder / Risk Tag */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>{ret.reminderAlert}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">Staff receives automated warning tag on checkout orders from these customers</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Registry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 5. LIVE STAFF AUDIT TRAIL & TIMESHEET MODAL */}
        {activeModal === 'staff-logs' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Staff Timesheet & Live Audit Logs</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Track clock-in times, session active hours, and real-time operational events</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setStaffTab('timesheet')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'timesheet'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Staff Session Timesheet (কে কখন আসছে ও কতক্ষণ লগইন ছিল)
                </button>
                <button
                  type="button"
                  onClick={() => setStaffTab('audit-trail')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'audit-trail'
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Live Action Event Logs ({AUDIT_LOGS.length})
                </button>
              </div>

              {/* Tab 1: Staff Timesheet */}
              {staffTab === 'timesheet' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Staff Member</th>
                          <th className="px-4 py-3">Clock-in Time</th>
                          <th className="px-4 py-3">Last Active</th>
                          <th className="px-4 py-3">Session Duration</th>
                          <th className="px-4 py-3 text-right">Actions Logged</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                        {STAFF_TIMESHEET.map((staff) => (
                          <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs">
                                {staff.initials}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{staff.name}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">{staff.role}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                              {staff.clockIn}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[11px]">
                              {staff.lastActive}
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {staff.sessionDuration}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {staff.actionsCount} actions
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  staff.status === 'Online'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : staff.status === 'Idle'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {staff.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Activity Trail */}
              {staffTab === 'audit-trail' && (
                <div className="space-y-2.5">
                  {AUDIT_LOGS.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{log.user}</span>
                          <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold">
                            {log.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{log.action}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">All audit events encrypted & preserved for Bangladesh compliance audit</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Timesheet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
