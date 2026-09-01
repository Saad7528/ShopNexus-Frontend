'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useVisitorAnalyticsStore,
  TimeFilter,
  KpiFilterType,
  GeoPolicyMode,
  VisitorSession,
  COUNTRY_REGIONS_MAP,
} from '@/store/useVisitorAnalyticsStore';
import {
  Activity,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Compass,
  Layers,
  Sparkles,
  Zap,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ChevronRight,
  Ban,
  Unlock,
  X,
  Cpu,
  Lock,
  Flag,
  FileSpreadsheet,
  Printer,
  FileText,
  ChevronDown,
  Phone,
} from 'lucide-react';
import { exportToBrandedExcel, printBrandedPDF } from '@/lib/exportUtils';

export default function VisitorAnalyticsPage() {
  const {
    timeFilter,
    kpiFilter,
    selectedCountryCode,
    blockedCountries,
    geoPolicyMode,
    liveVisitorCount,
    sessions,
    blockedIPs,
    searchQuery,
    statusFilter,
    deviceFilter,
    activeTab,
    setTimeFilter,
    setKpiFilter,
    setSelectedCountry,
    toggleCountryBlock,
    setGeoPolicyMode,
    setActiveTab,
    setSearchQuery,
    setStatusFilter,
    setDeviceFilter,
    blockIP,
    unblockIP,
    simulateLiveUpdate,
  } = useVisitorAnalyticsStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIPToBlock, setSelectedIPToBlock] = useState<string | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Live heart-beat telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      simulateLiveUpdate();
    }, 4000);
    return () => clearInterval(interval);
  }, [simulateLiveUpdate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    simulateLiveUpdate();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live telemetry feed synchronized with MongoDB Edge');
    }, 600);
  };

  const handleConfirmBlock = () => {
    if (!selectedIPToBlock) return;
    blockIP(selectedIPToBlock, blockReasonInput.trim() || 'Suspicious traffic flagged by root admin');
    showToast(`IP ${selectedIPToBlock} has been blocked and added to blacklist.`);
    setSelectedIPToBlock(null);
    setBlockReasonInput('');
  };

  const handleUnblock = (ip: string) => {
    unblockIP(ip);
    showToast(`IP ${ip} has been unblocked.`);
  };

  const handleToggleCountry = (code: string, countryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCountryBlock(code);
    const isNowBlocked = !blockedCountries.includes(code);
    showToast(isNowBlocked ? `Geo-Blocked: ${countryName} is now barred from checkout.` : `Unblocked: ${countryName} traffic restored.`);
  };

  const handleExportCSV = () => {
    const headers = ['IP Address', 'Country', 'City', 'ISP', 'Device', 'Model', 'OS', 'Browser', 'Current URL', 'Referrer', 'Duration (s)', 'Pageviews', 'Status', 'Cart Active', 'Bounced'];
    const rows = sessions.map((s) => [
      s.ip,
      s.country,
      s.city,
      `"${s.isp}"`,
      s.device,
      `"${s.deviceModel}"`,
      `"${s.os}"`,
      `"${s.browser}"`,
      s.currentUrl,
      `"${s.referrer}"`,
      s.durationSeconds,
      s.pageviews,
      s.status,
      s.isCartActive ? 'YES' : 'NO',
      s.isBounced ? 'YES' : 'NO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopnexus_visitors_${timeFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Visitor audit logs exported as CSV.');
  };

  // Filtered Sessions with KPI Drill-Down
  const filteredSessions = sessions.filter((sess) => {
    const matchSearch =
      sess.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.isp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.currentUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || sess.status === statusFilter;
    const matchDevice = deviceFilter === 'all' || sess.device.toLowerCase() === deviceFilter.toLowerCase();

    // KPI Card Drill-Down Logic
    let matchKpi = true;
    if (kpiFilter === 'live') {
      matchKpi = sess.status === 'active';
    } else if (kpiFilter === 'pageviews') {
      matchKpi = sess.pageviews >= 5;
    } else if (kpiFilter === 'duration') {
      matchKpi = sess.durationSeconds >= 200;
    } else if (kpiFilter === 'bounced') {
      matchKpi = sess.isBounced === true;
    } else if (kpiFilter === 'cart') {
      matchKpi = sess.isCartActive === true;
    }

    return matchSearch && matchStatus && matchDevice && matchKpi;
  });

  const timeFilterLabels: Record<TimeFilter, string> = {
    live: '⚡ Live (30m)',
    today: 'Today (24h)',
    week: 'Last 7 Days',
    month: 'Last 30 Days',
    all: 'All Time',
  };

  // Device Percentages
  const deviceData = [
    { type: 'Mobile', icon: Smartphone, count: Math.round(liveVisitorCount * 0.64), pct: 64, color: 'from-orange-500 to-amber-500' },
    { type: 'Desktop', icon: Monitor, count: Math.round(liveVisitorCount * 0.29), pct: 29, color: 'from-blue-500 to-indigo-500' },
    { type: 'Tablet', icon: Tablet, count: Math.round(liveVisitorCount * 0.07), pct: 7, color: 'from-emerald-500 to-teal-500' },
  ];

  // Countries Data
  const countryData = [
    { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', count: Math.round(liveVisitorCount * 0.76), pct: 76, isPrimary: true },
    { country: 'United States', code: 'US', flag: '🇺🇸', count: Math.round(liveVisitorCount * 0.11), pct: 11, isPrimary: false },
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', count: Math.round(liveVisitorCount * 0.05), pct: 5, isPrimary: false },
    { country: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', count: Math.round(liveVisitorCount * 0.04), pct: 4, isPrimary: false },
    { country: 'Canada', code: 'CA', flag: '🇨🇦', count: Math.round(liveVisitorCount * 0.02), pct: 2, isPrimary: false },
    { country: 'Other Regions', code: 'UN', flag: '🌐', count: Math.round(liveVisitorCount * 0.02), pct: 2, isPrimary: false },
  ];

  // Selected Country Info & City Matrix
  const activeCountryData = COUNTRY_REGIONS_MAP[selectedCountryCode] || COUNTRY_REGIONS_MAP.BD;
  const selectedCountryTotalVisitors = countryData.find((c) => c.code === selectedCountryCode)?.count || 32;
  const selectedCountryPct = countryData.find((c) => c.code === selectedCountryCode)?.pct || 76;

  // Traffic Sources
  const trafficSources = [
    { source: 'Google Organic Search', type: 'Search Engine', count: '44%', visitors: Math.round(liveVisitorCount * 0.44), color: 'bg-blue-500' },
    { source: 'Direct URL / Bookmarks', type: 'Direct Traffic', count: '28%', visitors: Math.round(liveVisitorCount * 0.28), color: 'bg-emerald-500' },
    { source: 'Facebook Ads & Storefront', type: 'Social Campaign', count: '14%', visitors: Math.round(liveVisitorCount * 0.14), color: 'bg-indigo-500' },
    { source: 'Instagram Stories & Reels', type: 'Social Organic', count: '8%', visitors: Math.round(liveVisitorCount * 0.08), color: 'bg-rose-500' },
    { source: 'YouTube Hardware Reviews', type: 'Video Referral', count: '4%', visitors: Math.round(liveVisitorCount * 0.04), color: 'bg-red-500' },
    { source: 'Flash Sale Email Campaign', type: 'Email Referral', count: '2%', visitors: Math.round(liveVisitorCount * 0.02), color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Range Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-orange-500" />
              Live Visitors & Traffic Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time shopper session monitoring, exact mobile model tracking, geo-location matrix, and country-level geo-fencing.
          </p>
        </div>

        {/* Action Controls & Range Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {(['live', 'today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === filter
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {timeFilterLabels[filter]}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-all cursor-pointer shadow-2xs"
            title="Refresh Telemetry Stream"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          {/* Multi-Format Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              title="Export Telemetry & Lead Reports"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                {/* 1. Branded Excel (.xlsx) */}
                <button
                  type="button"
                  onClick={() => {
                    exportToBrandedExcel(filteredSessions, timeFilter, kpiFilter, liveVisitorCount);
                    setIsExportMenuOpen(false);
                    showToast('Branded Excel (.xlsx) report generated with lead phone numbers.');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Export to Excel (.xlsx)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Branded sheet with customer leads & cart ৳
                    </span>
                  </div>
                </button>

                {/* 2. Print / Export PDF */}
                <button
                  type="button"
                  onClick={() => {
                    printBrandedPDF(filteredSessions, timeFilter, kpiFilter, liveVisitorCount);
                    setIsExportMenuOpen(false);
                    showToast('Opening print-ready PDF with ShopNexus watermark.');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Print / Export PDF Report
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ShopNexus watermark & letterhead
                    </span>
                  </div>
                </button>

                {/* 3. Raw CSV File */}
                <button
                  type="button"
                  onClick={() => {
                    handleExportCSV();
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Export Raw CSV
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Plain data table export
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Enterprise Telemetry KPI Cards (Fully Interactive Click-to-Drilldown!) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Live Active Visitors Card */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'live' ? 'all' : 'live')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group ${
            kpiFilter === 'live'
              ? 'bg-emerald-500/15 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs'
          }`}
          title="Click to filter table by Active Live Shoppers"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Live Visitors
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {liveVisitorCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">+8.4% last hour</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              {kpiFilter === 'live' ? '✓ Active' : 'Filter'}
            </span>
          </div>
        </button>

        {/* 2. Total Pageviews Card */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'pageviews' ? 'all' : 'pageviews')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group ${
            kpiFilter === 'pageviews'
              ? 'bg-blue-500/15 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-xs'
          }`}
          title="Click to filter High Pageview Sessions (5+ hits)"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pageviews
            </span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {timeFilter === 'live' ? '1,840' : timeFilter === 'today' ? '14,290' : timeFilter === 'week' ? '89,400' : '248,100'}
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              Hits
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">~4.3 views / user</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
              {kpiFilter === 'pageviews' ? '✓ Active' : 'Filter'}
            </span>
          </div>
        </button>

        {/* 3. Avg Session Duration Card */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'duration' ? 'all' : 'duration')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group ${
            kpiFilter === 'duration'
              ? 'bg-amber-500/15 border-2 border-amber-500 shadow-lg shadow-amber-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-xs'
          }`}
          title="Click to filter Deep Engagement Sessions (200s+)"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg. Session
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              4m 38s
            </span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              High
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">+32s benchmark</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
              {kpiFilter === 'duration' ? '✓ Active' : 'Filter'}
            </span>
          </div>
        </button>

        {/* 4. Bounce Rate Drill-Down Card */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'bounced' ? 'all' : 'bounced')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group ${
            kpiFilter === 'bounced'
              ? 'bg-purple-500/15 border-2 border-purple-500 shadow-lg shadow-purple-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-xs'
          }`}
          title="Click to view Bounced Sessions and exit reasons"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bounce Rate
            </span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              23.4%
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Optimal
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">Single-page exits</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
              {kpiFilter === 'bounced' ? '✓ Active' : 'Filter'}
            </span>
          </div>
        </button>

        {/* 5. Live Cart Velocity Card (Full-width span on mobile 2-col layout) */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'cart' ? 'all' : 'cart')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group col-span-2 sm:col-span-2 lg:col-span-1 ${
            kpiFilter === 'cart'
              ? 'bg-orange-500/15 border-2 border-orange-500 shadow-lg shadow-orange-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 shadow-xs'
          }`}
          title="Click to view Active Cart Shoppers & Cart Values"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cart Velocity
            </span>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 font-mono">
              38.2%
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              In Cart
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">{Math.round(liveVisitorCount * 0.38)} shoppers</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 group-hover:underline">
              {kpiFilter === 'cart' ? '✓ Active' : 'Filter'}
            </span>
          </div>
        </button>
      </div>

      {/* Active KPI Filter Banner with Clear Button */}
      {kpiFilter !== 'all' && (
        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-orange-700 dark:text-orange-300">
            <Filter className="w-4 h-4 text-orange-500" />
            <span>
              Active Filter: {kpiFilter === 'live' && '🟢 Live Active Shoppers'}
              {kpiFilter === 'pageviews' && '👁️ High Pageview Sessions (5+ hits)'}
              {kpiFilter === 'duration' && '⏱️ Long Engagement Sessions (200s+)'}
              {kpiFilter === 'bounced' && '🚪 Bounced Sessions (<20s single pageview)'}
              {kpiFilter === 'cart' && '🛒 Shoppers with Active Cart Items'}
            </span>
            <span className="text-slate-500 font-normal">({filteredSessions.length} sessions matched)</span>
          </div>
          <button
            type="button"
            onClick={() => setKpiFilter('all')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Sessions & IP Access Control ({filteredSessions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('geo')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'geo'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Geo-Location & City Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'devices'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Devices & Browsers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sources'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Traffic Acquisition Sources</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blocked')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blocked'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldX className="w-4 h-4" />
            <span>Blocked IPs Shield ({blockedIPs.length})</span>
          </button>
        </div>

        {/* TAB 1: LIVE SESSIONS & IP TABLE */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {/* Search & Filter Bar (Fully Mobile Responsive) */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80 lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by IP, Mobile Model, City, ISP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                {/* Device Filter */}
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">All Devices</option>
                  <option value="mobile">📱 Mobile</option>
                  <option value="desktop">💻 Desktop</option>
                  <option value="tablet">📟 Tablet</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">🟢 Active</option>
                  <option value="bounced">🚪 Bounced</option>
                  <option value="bot">🟡 Bots</option>
                  <option value="blocked">🔴 Blocked</option>
                </select>
              </div>
            </div>

            {/* Sessions Table with Fixed Spacious Layout and Non-wrapping Badges */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[1000px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4 w-[180px]">Visitor & Location</th>
                      <th className="py-3 px-4 w-[180px]">IP & Network ISP</th>
                      <th className="py-3 px-4 w-[230px]">Device & Exact Model</th>
                      <th className="py-3 px-4 w-[240px]">Current Page & Activity</th>
                      <th className="py-3 px-4 w-[150px]">Session Duration</th>
                      <th className="py-3 px-4 w-[130px]">Status</th>
                      <th className="py-3 px-4 text-right w-[110px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="w-6 h-6 text-slate-400 opacity-60" />
                            <span>No visitor sessions matching the filter criteria.</span>
                            {kpiFilter !== 'all' && (
                              <button
                                type="button"
                                onClick={() => setKpiFilter('all')}
                                className="text-orange-600 dark:text-orange-400 font-bold underline"
                              >
                                Clear current KPI filter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((sess) => {
                        const isBlocked = sess.status === 'blocked';
                        return (
                          <tr
                            key={sess.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                              sess.isCartActive ? 'bg-orange-500/5 dark:bg-orange-500/5' : ''
                            } ${sess.isBounced ? 'bg-purple-500/5 dark:bg-purple-500/5' : ''}`}
                          >
                            {/* Visitor & Location & Contact Lead */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl shrink-0" title={sess.country}>{sess.flag}</span>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 dark:text-white block truncate text-xs">
                                    {sess.customerName || sess.city}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate mt-0.5">
                                    <span className="truncate">{sess.city}</span>
                                    {sess.contactPhone && (
                                      <>
                                        <span>•</span>
                                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold truncate">
                                          {sess.contactPhone}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* IP & ISP */}
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                                {sess.ip}
                              </span>
                              <span className="text-[10px] text-slate-500 font-sans truncate max-w-[160px] block">
                                {sess.isp}
                              </span>
                            </td>

                            {/* Device & Exact Model Number */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                  {sess.device === 'Mobile' ? (
                                    <Smartphone className="w-4 h-4 text-orange-500" />
                                  ) : sess.device === 'Desktop' ? (
                                    <Monitor className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Tablet className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  {/* Exact Hardware Model */}
                                  <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">
                                    {sess.deviceModel}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {sess.os} • {sess.browser}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Current Page & Activity with Neat Non-wrapping Badges */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="font-bold font-mono text-orange-600 dark:text-orange-400 text-xs">
                                  {sess.currentUrl}
                                </span>
                                {sess.isCartActive && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold tracking-tight shadow-xs whitespace-nowrap shrink-0"
                                    title={sess.cartItemsSummary ? `Cart: ${sess.cartItemsSummary} (৳${sess.cartValueBDT?.toLocaleString()})` : 'Active Cart'}
                                  >
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>Cart Active</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[210px] mt-0.5">
                                {sess.isBounced && sess.bounceReason ? (
                                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                                    {sess.bounceReason}
                                  </span>
                                ) : (
                                  `Via: ${sess.referrer}`
                                )}
                              </span>
                            </td>

                            {/* Session Duration & Hits */}
                            <td className="py-3.5 px-4 font-mono text-[11px]">
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">
                                {Math.floor(sess.durationSeconds / 60)}m {sess.durationSeconds % 60}s
                              </span>
                              <span className="text-[10px] text-slate-500 font-sans">
                                {sess.pageviews} views • {sess.lastActiveAt}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {isBlocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold shrink-0">
                                  <ShieldX className="w-3 h-3" />
                                  <span>Blocked</span>
                                </span>
                              ) : sess.status === 'bot' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <Cpu className="w-3 h-3" />
                                  <span>Search Spider</span>
                                </span>
                              ) : sess.isBounced ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <span>Bounced</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>Active</span>
                                </span>
                              )}
                            </td>

                            {/* 1-Click Access Control */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              {isBlocked ? (
                                <button
                                  type="button"
                                  onClick={() => handleUnblock(sess.ip)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                  title="Unblock this IP Address"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unblock</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedIPToBlock(sess.ip)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                  title="Block this IP Address"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Block IP</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GEO-LOCATION & CITY MATRIX WITH INTERACTIVE COUNTRY SELECTION & GEO-FENCING */}
        {activeTab === 'geo' && (
          <div className="space-y-6">
            {/* Geo-Fencing Policy Mode Switch Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${geoPolicyMode === 'domestic_only' ? 'bg-emerald-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
                    <span>Geo-Fencing & Country Firewall Mode:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      geoPolicyMode === 'domestic_only'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      {geoPolicyMode === 'domestic_only' ? '🇧🇩 Domestic Whitelist Only' : '🌐 Global with Selective Bans'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {geoPolicyMode === 'domestic_only'
                      ? 'Only Bangladesh visitors are permitted to browse and place orders. All international traffic is blocked.'
                      : 'Global traffic is allowed by default. You can selectively block any individual country below.'}
                  </p>
                </div>
              </div>

              {/* Policy Toggle Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-slate-700 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setGeoPolicyMode('global');
                    showToast('Switched to Global Traffic Mode with selective country bans.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    geoPolicyMode === 'global'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌐 Global Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeoPolicyMode('domestic_only');
                    showToast('Domestic Whitelist Active: Only Bangladesh traffic is now permitted.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    geoPolicyMode === 'domestic_only'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇧🇩 Bangladesh Only
                </button>
              </div>
            </div>

            {/* Country List (Left) & Dynamic City Matrix (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card: Top Countries (Interactive Click-to-Select) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      Top Countries by Traffic Volume
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Click any country to view its detailed city & division matrix on the right.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {liveVisitorCount} Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {countryData.map((c) => {
                    const isSelected = selectedCountryCode === c.code;
                    const isBlocked = blockedCountries.includes(c.code) || (geoPolicyMode === 'domestic_only' && c.code !== 'BD');

                    return (
                      <div
                        key={c.code}
                        onClick={() => setSelectedCountry(c.code)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-500/10 dark:bg-blue-950/30 border-blue-500/50 shadow-sm ring-1 ring-blue-500/30'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0">{c.flag}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {c.country}
                              </span>
                              {c.isPrimary && (
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                                  Primary
                                </span>
                              )}
                              {isSelected && (
                                <span className="px-1.5 py-0.2 rounded-md bg-blue-500 text-white text-[9px] font-black uppercase">
                                  Selected
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                              <span>{c.count} visitors</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{c.pct}% of total traffic</span>
                            </div>
                          </div>
                        </div>

                        {/* Country Action Control & Status */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={(e) => handleToggleCountry(c.code, c.country, e)}
                              className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Unblock Country"
                            >
                              <ShieldX className="w-3 h-3" />
                              <span>Blocked</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleToggleCountry(c.code, c.country, e)}
                              className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-500/15 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              title="Block this Country"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Block</span>
                            </button>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-500 translate-x-0.5' : 'text-slate-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Card: Dynamic City & Division Matrix (Updates with selected country) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-xl">{activeCountryData.flag}</span>
                      <span>{activeCountryData.country} Regional Breakdown</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Subdivision & metropolitan city traffic density (~{selectedCountryTotalVisitors} live sessions • {selectedCountryPct}%)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
                    {activeCountryData.cities.length} Regions
                  </span>
                </div>

                <div className="space-y-3">
                  {activeCountryData.cities.map((cityObj) => {
                    const cityLiveCount = Math.max(1, Math.round((selectedCountryTotalVisitors * cityObj.percentage) / 100));
                    return (
                      <div
                        key={cityObj.city}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                {cityObj.city}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                {cityObj.subdivision}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                            <span className="text-slate-500">{cityLiveCount} live</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {cityObj.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${cityObj.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVICES & TECH MATRIX */}
        {activeTab === 'devices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Types */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-orange-500" />
                Device Category Share
              </h3>
              <div className="space-y-4">
                {deviceData.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.type} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Icon className="w-4 h-4 text-orange-500" />
                          <span>{d.type}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                          {d.pct}% ({d.count} users)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-500`}
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating Systems */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                Operating System Distribution
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { os: 'Android 14 / 13 (Samsung, Xiaomi, Pixel)', count: '48%', share: 48 },
                  { os: 'iOS 17 (iPhone 15, 14, 13)', count: '24%', share: 24 },
                  { os: 'Windows 11 / 10 (Dell, Lenovo, ASUS)', count: '20%', share: 20 },
                  { os: 'macOS Sonoma (MacBook Pro, Air)', count: '6%', share: 6 },
                  { os: 'Linux / Crawler Spiders', count: '2%', share: 2 },
                ].map((item) => (
                  <div key={item.os} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.os}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Browser Ecosystem
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { browser: 'Google Chrome 124', count: '58%', share: 58 },
                  { browser: 'Apple Safari 17.5', count: '26%', share: 26 },
                  { browser: 'Microsoft Edge 124', count: '8%', share: 8 },
                  { browser: 'Samsung Internet 24', count: '5%', share: 5 },
                  { browser: 'Mozilla Firefox 125', count: '3%', share: 3 },
                ].map((item) => (
                  <div key={item.browser} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.browser}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRAFFIC ACQUISITION SOURCES */}
        {activeTab === 'sources' && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              Traffic Acquisition & Campaign Inflows
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {trafficSources.map((src) => (
                <div key={src.source} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {src.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs">
                      {src.count}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {src.source}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    ~{src.visitors} live active sessions
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BLOCKED IPS SHIELD */}
        {activeTab === 'blocked' && (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-500/20 dark:border-rose-500/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  IP Firewall Blacklist ({blockedIPs.length} Blocked Addresses)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Blocked IP addresses are barred from making checkout transactions or automated requests.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {blockedIPs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No IP addresses currently in the blacklist shield.
                </div>
              ) : (
                blockedIPs.map((b) => (
                  <div key={b.ip} className="p-4 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{b.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{b.ip}</span>
                          <span className="px-2 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                            Banned
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Reason: {b.reason}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Blocked on: {b.blockedAt} by {b.blockedBy}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUnblock(b.ip)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      Unblock & Whitelist
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Block IP Confirmation Modal */}
      {selectedIPToBlock && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Confirm IP Address Block
                </h3>
                <p className="text-xs text-slate-500">
                  Bar this visitor from accessing storefront and checkout.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              IP: {selectedIPToBlock}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Block Reason (Optional):
              </label>
              <input
                type="text"
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                placeholder="e.g. Excessive bot scraping / malicious attempts"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIPToBlock(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all cursor-pointer"
              >
                Confirm Block IP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
