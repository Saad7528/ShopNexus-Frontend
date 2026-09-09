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
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
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
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

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
    telemetryMode,
    syncBackendSessions,
  } = useVisitorAnalyticsStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIPToBlock, setSelectedIPToBlock] = useState<string | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('');
  const [liveDbUsers, setLiveDbUsers] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Live cross-browser & incognito telemetry sync with backend & MongoDB Atlas
  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        // 1. Fetch from Next.js serverless API directly (Vercel compatible)
        let resLiveTelemetry = await fetch(`/api/telemetry/live-sessions?range=${timeFilter}`).catch(() => null);
        if ((!resLiveTelemetry || !resLiveTelemetry.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          resLiveTelemetry = await fetch(`${API_URL}/telemetry/live-sessions?range=${timeFilter}`).catch(() => null);
        }

        let resUsers = await fetch('/api/admin/users').catch(() => null);
        if ((!resUsers || !resUsers.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          resUsers = await fetch(`${API_URL}/admin/users`).catch(() => null);
        }

        if (resLiveTelemetry && resLiveTelemetry.ok) {
          const telemetryJson = await resLiveTelemetry.json();
          if (telemetryJson?.success && Array.isArray(telemetryJson.data)) {
            syncBackendSessions(telemetryJson.data);
          }
        }
        if (resUsers && resUsers.ok) {
          const usersData = await resUsers.json();
          if (usersData?.data && Array.isArray(usersData.data)) {
            setLiveDbUsers(usersData.data);
          }
        }
      } catch (e) {
        console.error('Visitor telemetry sync error:', e);
      }
    };

    fetchVisitorStats();
    const interval = setInterval(() => {
      fetchVisitorStats();
      if (telemetryMode === 'demo') {
        simulateLiveUpdate();
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [telemetryMode, timeFilter, syncBackendSessions, simulateLiveUpdate, API_URL]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/telemetry/live-sessions?range=${timeFilter}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) syncBackendSessions(json.data);
      }
    } catch (_e) {}
    if (telemetryMode === 'demo') simulateLiveUpdate();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live telemetry feed synchronized with Backend Edge');
    }, 400);
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

  const [selectedJourneySession, setSelectedJourneySession] = useState<VisitorSession | null>(null);

  // 1. Group & Deduplicate strictly by IP on Client
  const deduplicatedSessions = React.useMemo(() => {
    const ipMap = new Map<string, VisitorSession>();
    for (const sess of sessions) {
      const key = sess.ip || sess.id;
      if (!ipMap.has(key)) {
        ipMap.set(key, { ...sess });
      } else {
        const existing = ipMap.get(key)!;
        existing.pageviews = (existing.pageviews || 1) + (sess.pageviews || 1);
        existing.durationSeconds = (existing.durationSeconds || 1) + (sess.durationSeconds || 1);
        if (sess.isCartActive) existing.isCartActive = true;
        if (sess.status === 'active') existing.status = 'active';

        // Merge route histories
        const existingRoutes = existing.routeHistory || [];
        const newRoutes = sess.routeHistory || [];
        const merged = [...existingRoutes];
        for (const nr of newRoutes) {
          const idx = merged.findIndex((r) => r.path === nr.path);
          if (idx >= 0) {
            merged[idx].durationSeconds += nr.durationSeconds;
          } else {
            merged.push(nr);
          }
        }
        existing.routeHistory = merged;
        ipMap.set(key, existing);
      }
    }
    return Array.from(ipMap.values());
  }, [sessions]);

  // 2. Filtered Sessions with Strict Real-time Live Mode & Search
  const filteredSessions = deduplicatedSessions.filter((sess) => {
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

    // When TimeFilter is 'live', strictly show active shoppers
    const matchTime = timeFilter === 'live' ? sess.status === 'active' : true;

    return matchSearch && matchStatus && matchDevice && matchKpi && matchTime;
  });

  const timeFilterLabels: Record<TimeFilter, string> = {
    live: isBn ? '⚡ লাইভ' : '⚡ Live',
    '30m': isBn ? 'গত ৩০ মি.' : 'Past 30m',
    today: isBn ? 'আজ (২৪ ঘণ্টা)' : 'Today (24h)',
    week: isBn ? 'গত ৭ দিন' : 'Last 7 Days',
    month: isBn ? 'গত ৩০ দিন' : 'Last 30 Days',
    all: isBn ? 'সব সময়' : 'All Time',
  };

  // Dynamic KPI Calculations from Active Sessions
  const totalSessionsCount = sessions.length;
  const cartActiveSessions = sessions.filter((s) => s.isCartActive);
  const cartActiveCount = cartActiveSessions.length;
  const cartVelocityPct =
    telemetryMode === 'real'
      ? totalSessionsCount > 0
        ? ((cartActiveCount / totalSessionsCount) * 100).toFixed(1)
        : '0.0'
      : '38.2';

  const bouncedSessions = sessions.filter((s) => s.isBounced);
  const bounceRatePct =
    telemetryMode === 'real'
      ? totalSessionsCount > 0
        ? ((bouncedSessions.length / totalSessionsCount) * 100).toFixed(1)
        : '0.0'
      : '23.4';

  const totalPageviewsCount = sessions.reduce((acc, s) => acc + (s.pageviews || 1), 0);
  const avgSessionSecs =
    totalSessionsCount > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / totalSessionsCount)
      : 0;
  const avgMinutes = Math.floor(avgSessionSecs / 60);
  const avgRemainingSecs = avgSessionSecs % 60;
  const formattedAvgDuration = `${avgMinutes}m ${avgRemainingSecs}s`;

  // Device Percentages (Dynamic)
  const mobileCount = sessions.filter((s) => s.device === 'Mobile').length;
  const desktopCount = sessions.filter((s) => s.device === 'Desktop').length;
  const tabletCount = sessions.filter((s) => s.device === 'Tablet').length;

  const deviceData =
    telemetryMode === 'real'
      ? [
          {
            type: 'Desktop',
            icon: Monitor,
            count: desktopCount,
            pct: totalSessionsCount > 0 ? Math.round((desktopCount / totalSessionsCount) * 100) : 0,
            color: 'from-blue-500 to-indigo-500',
          },
          {
            type: 'Mobile',
            icon: Smartphone,
            count: mobileCount,
            pct: totalSessionsCount > 0 ? Math.round((mobileCount / totalSessionsCount) * 100) : 0,
            color: 'from-orange-500 to-amber-500',
          },
          {
            type: 'Tablet',
            icon: Tablet,
            count: tabletCount,
            pct: totalSessionsCount > 0 ? Math.round((tabletCount / totalSessionsCount) * 100) : 0,
            color: 'from-emerald-500 to-teal-500',
          },
        ]
      : [
          { type: 'Mobile', icon: Smartphone, count: Math.round(liveVisitorCount * 0.64), pct: 64, color: 'from-orange-500 to-amber-500' },
          { type: 'Desktop', icon: Monitor, count: Math.round(liveVisitorCount * 0.29), pct: 29, color: 'from-blue-500 to-indigo-500' },
          { type: 'Tablet', icon: Tablet, count: Math.round(liveVisitorCount * 0.07), pct: 7, color: 'from-emerald-500 to-teal-500' },
        ];

  // Dynamic OS Distribution
  const osDistribution = React.useMemo(() => {
    if (telemetryMode === 'real') {
      if (sessions.length === 0) {
        return [{ os: 'No Active Sessions', count: '0%', share: 0 }];
      }
      const counts: Record<string, number> = {};
      sessions.forEach((s) => {
        const osName = s.os || 'Unknown OS';
        counts[osName] = (counts[osName] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([os, count]) => ({
          os,
          count: `${Math.round((count / sessions.length) * 100)}% (${count} session${count > 1 ? 's' : ''})`,
          share: Math.round((count / sessions.length) * 100),
        }))
        .sort((a, b) => b.share - a.share);
    }
    return [
      { os: 'Android 14 / 13 (Samsung, Xiaomi, Pixel)', count: '48%', share: 48 },
      { os: 'iOS 17 (iPhone 15, 14, 13)', count: '24%', share: 24 },
      { os: 'Windows 11 / 10 (Dell, Lenovo, ASUS)', count: '20%', share: 20 },
      { os: 'macOS Sonoma (MacBook Pro, Air)', count: '6%', share: 6 },
      { os: 'Linux / Crawler Spiders', count: '2%', share: 2 },
    ];
  }, [telemetryMode, sessions]);

  // Dynamic Browser Distribution
  const browserDistribution = React.useMemo(() => {
    if (telemetryMode === 'real') {
      if (sessions.length === 0) {
        return [{ browser: 'No Active Sessions', count: '0%', share: 0 }];
      }
      const counts: Record<string, number> = {};
      sessions.forEach((s) => {
        const browserName = s.browser || 'Unknown Browser';
        counts[browserName] = (counts[browserName] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([browser, count]) => ({
          browser,
          count: `${Math.round((count / sessions.length) * 100)}% (${count} session${count > 1 ? 's' : ''})`,
          share: Math.round((count / sessions.length) * 100),
        }))
        .sort((a, b) => b.share - a.share);
    }
    return [
      { browser: 'Google Chrome 124', count: '58%', share: 58 },
      { browser: 'Apple Safari 17.5', count: '26%', share: 26 },
      { browser: 'Microsoft Edge 124', count: '8%', share: 8 },
      { browser: 'Samsung Internet 24', count: '5%', share: 5 },
      { browser: 'Mozilla Firefox 125', count: '3%', share: 3 },
    ];
  }, [telemetryMode, sessions]);

  // Countries Data (Dynamic)
  const countryCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const code = s.countryCode || 'BD';
    countryCounts[code] = (countryCounts[code] || 0) + 1;
  });

  const countryData =
    telemetryMode === 'real'
      ? [
          {
            country: 'Bangladesh',
            code: 'BD',
            flag: '🇧🇩',
            count: countryCounts['BD'] || 0,
            pct: totalSessionsCount > 0 ? Math.round(((countryCounts['BD'] || 0) / totalSessionsCount) * 100) : 0,
            isPrimary: true,
          },
          {
            country: 'United States',
            code: 'US',
            flag: '🇺🇸',
            count: countryCounts['US'] || 0,
            pct: totalSessionsCount > 0 ? Math.round(((countryCounts['US'] || 0) / totalSessionsCount) * 100) : 0,
            isPrimary: false,
          },
          {
            country: 'United Kingdom',
            code: 'GB',
            flag: '🇬🇧',
            count: countryCounts['GB'] || 0,
            pct: totalSessionsCount > 0 ? Math.round(((countryCounts['GB'] || 0) / totalSessionsCount) * 100) : 0,
            isPrimary: false,
          },
        ]
      : [
          { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', count: Math.round(liveVisitorCount * 0.76), pct: 76, isPrimary: true },
          { country: 'United States', code: 'US', flag: '🇺🇸', count: Math.round(liveVisitorCount * 0.11), pct: 11, isPrimary: false },
          { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', count: Math.round(liveVisitorCount * 0.05), pct: 5, isPrimary: false },
          { country: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', count: Math.round(liveVisitorCount * 0.04), pct: 4, isPrimary: false },
          { country: 'Canada', code: 'CA', flag: '🇨🇦', count: Math.round(liveVisitorCount * 0.02), pct: 2, isPrimary: false },
          { country: 'Other Regions', code: 'UN', flag: '🌐', count: Math.round(liveVisitorCount * 0.02), pct: 2, isPrimary: false },
        ];

  // Selected Country Info & City Matrix
  const activeCountryData = COUNTRY_REGIONS_MAP[selectedCountryCode] || COUNTRY_REGIONS_MAP.BD;
  const currentCountryObj = countryData.find((c) => c.code === selectedCountryCode);
  const selectedCountryTotalVisitors = currentCountryObj ? currentCountryObj.count : (telemetryMode === 'real' ? 0 : 32);
  const selectedCountryPct = currentCountryObj ? currentCountryObj.pct : (telemetryMode === 'real' ? 0 : 76);

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
              {isBn ? 'লাইভ ভিজিটর ও ট্রাফিক টেলিমেট্রি' : 'Live Visitors & Traffic Telemetry'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {isBn ? 'লাইভ রিয়েল-টাইম' : 'Live Real-Time'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isBn
              ? 'রিয়েল-টাইম শপার সেশন মনিটরিং, নিখুঁত মোবাইল মডেল ট্র্যাকিং, ভৌগলিক অবস্থান ম্যাট্রিক্স ও কান্ট্রি-লেভেল জিও-ফেন্সিং।'
              : 'Real-time shopper session monitoring, exact mobile model tracking, geo-location matrix, and country-level geo-fencing.'}
          </p>
        </div>

        {/* Action Controls & Range Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {(['live', '30m', 'today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
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
            title={isBn ? 'টেলিমেট্রি স্ট্রিম রিফ্রেশ করুন' : 'Refresh Telemetry Stream'}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          {/* Multi-Format Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              title={isBn ? 'টেলিমেট্রি ও লিড রিপোর্ট এক্সপোর্ট' : 'Export Telemetry & Lead Reports'}
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'রিপোর্ট এক্সপোর্ট' : 'Export Report'}</span>
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
                    showToast(isBn ? 'লিড ফোন নম্বর সহ ব্র্যান্ডেড এক্সেল (.xlsx) রিপোর্ট তৈরি হয়েছে।' : 'Branded Excel (.xlsx) report generated with lead phone numbers.');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {isBn ? 'এক্সেলে এক্সপোর্ট (.xlsx)' : 'Export to Excel (.xlsx)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'কাস্টমার লিড ও কার্ট ৳ সহ ব্র্যান্ডেড শিট' : 'Branded sheet with customer leads & cart ৳'}
                    </span>
                  </div>
                </button>

                {/* 2. Print / Export PDF */}
                <button
                  type="button"
                  onClick={() => {
                    printBrandedPDF(filteredSessions, timeFilter, kpiFilter, liveVisitorCount);
                    setIsExportMenuOpen(false);
                    showToast(isBn ? 'ShopNexus ওয়াটারমার্ক সহ প্রিন্ট-রেডি পিডিএফ খোলা হচ্ছে।' : 'Opening print-ready PDF with ShopNexus watermark.');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {isBn ? 'পিডিএফ প্রিন্ট / এক্সপোর্ট' : 'Print / Export PDF Report'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'ShopNexus ওয়াটারমার্ক ও লেটারহেড' : 'ShopNexus watermark & letterhead'}
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
                      {isBn ? 'র সিএসভি এক্সপোর্ট' : 'Export Raw CSV'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isBn ? 'সাধারণ ডাটা টেবিল এক্সপোর্ট' : 'Plain data table export'}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 Enterprise Telemetry KPI Cards */}
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
          title={isBn ? 'সক্রিয় লাইভ ক্রেতা অনুযায়ী ফিল্টার করুন' : 'Click to filter table by Active Live Shoppers'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isBn ? 'লাইভ ভিজিটর' : 'Live Visitors'}
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
              {isBn ? toBengaliNumber(liveVisitorCount) : liveVisitorCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {isBn ? 'সক্রিয়' : 'Active'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">{isBn ? '+৮.৪% গত ঘণ্টায়' : '+8.4% last hour'}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              {kpiFilter === 'live' ? (isBn ? '✓ সক্রিয়' : '✓ Active') : (isBn ? 'ফিল্টার' : 'Filter')}
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
          title={isBn ? 'উচ্চ পেজভিউ সেশন ফিল্টার করুন (৫+ ভিউ)' : 'Click to filter High Pageview Sessions (5+ hits)'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isBn ? 'মোট পেজভিউস' : 'Pageviews'}
            </span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
              {telemetryMode === 'real'
                ? (isBn ? toBengaliNumber(totalPageviewsCount.toLocaleString('en-US')) : totalPageviewsCount.toLocaleString())
                : timeFilter === 'live'
                ? (isBn ? '১,৮৪০' : '1,840')
                : timeFilter === 'today'
                ? (isBn ? '১৪,২৯০' : '14,290')
                : timeFilter === 'week'
                ? (isBn ? '৮৯,৪০০' : '89,400')
                : (isBn ? '২,৪৮,১০০' : '248,100')}
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {isBn ? 'হিটস' : 'Hits'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">
              ~{totalSessionsCount > 0 ? (isBn ? toBengaliNumber((totalPageviewsCount / totalSessionsCount).toFixed(1)) : (totalPageviewsCount / totalSessionsCount).toFixed(1)) : (isBn ? '১.০' : '1.0')} {isBn ? 'ভিউ / ইউজার' : 'views / user'}
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
              {kpiFilter === 'pageviews' ? (isBn ? '✓ সক্রিয়' : '✓ Active') : (isBn ? 'ফিল্টার' : 'Filter')}
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
          title={isBn ? 'দীর্ঘ সময় অবস্থানরত সেশন ফিল্টার করুন (২০০ সে.+)' : 'Click to filter Deep Engagement Sessions (200s+)'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isBn ? 'গড় সেশন সময়' : 'Avg. Session'}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
              {telemetryMode === 'real' ? (isBn ? toBengaliNumber(formattedAvgDuration) : formattedAvgDuration) : (isBn ? '৪মি ৩৮সে' : '4m 38s')}
            </span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {telemetryMode === 'real' ? (isBn ? 'লাইভ' : 'Live') : (isBn ? 'উচ্চ' : 'High')}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">
              {telemetryMode === 'real' ? `~${isBn ? toBengaliNumber(avgSessionSecs) : avgSessionSecs}s ${isBn ? 'গড় স্থায়িত্ব' : 'active duration'}` : (isBn ? '+৩২ সে. বেঞ্চমার্ক' : '+32s benchmark')}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
              {kpiFilter === 'duration' ? (isBn ? '✓ সক্রিয়' : '✓ Active') : (isBn ? 'ফিল্টার' : 'Filter')}
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
          title={isBn ? 'বাউন্সড সেশন এবং প্রস্থান কারণ দেখুন' : 'Click to view Bounced Sessions and exit reasons'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isBn ? 'বাউন্স রেট' : 'Bounce Rate'}
            </span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
              {telemetryMode === 'real' ? `${isBn ? toBengaliNumber(bounceRatePct) : bounceRatePct}%` : (isBn ? '২৩.৪%' : '23.4%')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {telemetryMode === 'real' && Number(bounceRatePct) === 0 ? (isBn ? 'শূন্য প্রস্থান' : 'Zero Exits') : (isBn ? 'অনুকূল' : 'Optimal')}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">
              {telemetryMode === 'real' ? `${isBn ? toBengaliNumber(bouncedSessions.length) : bouncedSessions.length} ${isBn ? 'একক-পেজ প্রস্থান' : 'single-page exits'}` : (isBn ? 'একক-পেজ প্রস্থান' : 'Single-page exits')}
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
              {kpiFilter === 'bounced' ? (isBn ? '✓ সক্রিয়' : '✓ Active') : (isBn ? 'ফিল্টার' : 'Filter')}
            </span>
          </div>
        </button>

        {/* 5. Live Cart Velocity Card */}
        <button
          type="button"
          onClick={() => setKpiFilter(kpiFilter === 'cart' ? 'all' : 'cart')}
          className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative group col-span-2 sm:col-span-2 lg:col-span-1 ${
            kpiFilter === 'cart'
              ? 'bg-orange-500/15 border-2 border-orange-500 shadow-lg shadow-orange-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 shadow-xs'
          }`}
          title={isBn ? 'সক্রিয় কার্ট ক্রেতা ও কার্ট মূল্য দেখুন' : 'Click to view Active Cart Shoppers & Cart Values'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isBn ? 'কার্ট ভেলোসিটি' : 'Cart Velocity'}
            </span>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 font-mono whitespace-nowrap">
              {isBn ? `${toBengaliNumber(cartVelocityPct)}%` : `${cartVelocityPct}%`}
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {isBn ? 'কার্টে' : 'In Cart'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 dark:text-slate-400">
              {telemetryMode === 'real' ? `${isBn ? toBengaliNumber(cartActiveCount) : cartActiveCount} ${isBn ? 'জন ক্রেতা' : 'shoppers'}` : `${isBn ? toBengaliNumber(Math.round(liveVisitorCount * 0.38)) : Math.round(liveVisitorCount * 0.38)} ${isBn ? 'জন ক্রেতা' : 'shoppers'}`}
            </span>
            <span className="font-bold text-orange-600 dark:text-orange-400 group-hover:underline">
              {kpiFilter === 'cart' ? (isBn ? '✓ সক্রিয়' : '✓ Active') : (isBn ? 'ফিল্টার' : 'Filter')}
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
              {isBn ? 'সক্রিয় ফিল্টার: ' : 'Active Filter: '}
              {kpiFilter === 'live' && (isBn ? '🟢 লাইভ সক্রিয় ক্রেতাগণ' : '🟢 Live Active Shoppers')}
              {kpiFilter === 'pageviews' && (isBn ? '👁️ উচ্চ পেজভিউ সেশন (৫+ ভিউ)' : '👁️ High Pageview Sessions (5+ hits)')}
              {kpiFilter === 'duration' && (isBn ? '⏱️ দীর্ঘ সময় অবস্থানরত সেশন (২০০ সে.+)' : '⏱️ Long Engagement Sessions (200s+)')}
              {kpiFilter === 'bounced' && (isBn ? '🚪 বাউন্সড সেশন (<২০ সে. একক ভিউ)' : '🚪 Bounced Sessions (<20s single pageview)')}
              {kpiFilter === 'cart' && (isBn ? '🛒 সক্রিয় কার্ট পণ্যসহ ক্রেতাগণ' : '🛒 Shoppers with Active Cart Items')}
            </span>
            <span className="text-slate-500 font-normal">
              ({isBn ? toBengaliNumber(filteredSessions.length) : filteredSessions.length} {isBn ? 'টি সেশন পাওয়া গেছে' : 'sessions matched'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setKpiFilter('all')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফিল্টার মুছুন' : 'Clear Filter'}</span>
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
            <span>{isBn ? `লাইভ সেশন ও আইপি অ্যাক্সেস কন্ট্রোল (${toBengaliNumber(filteredSessions.length)})` : `Live Sessions & IP Access Control (${filteredSessions.length})`}</span>
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
            <span>{isBn ? 'জিও-লোকেশন ও সিটি ম্যাট্রিক্স' : 'Geo-Location & City Matrix'}</span>
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
            <span>{isBn ? 'ডিভাইস ও ব্রাউজার' : 'Devices & Browsers'}</span>
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
            <span>{isBn ? 'ট্রাফিক সোর্স' : 'Traffic Acquisition Sources'}</span>
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
            <span>{isBn ? `ব্লকড আইপি শিল্ড (${blockedIPs.length})` : `Blocked IPs Shield (${blockedIPs.length})`}</span>
          </button>
        </div>

        {/* TAB 1: LIVE SESSIONS & IP TABLE */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {/* Search & Filter Bar (Fully Mobile Responsive) */}
            {/* Search & Filter Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-80 lg:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'আইপি, মোবাইল মডেল, শহর বা আইএসপি দিয়ে খুঁজুন...' : 'Search by IP, Mobile Model, City, ISP...'}
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
                  <option value="all">{isBn ? 'সকল ডিভাইস' : 'All Devices'}</option>
                  <option value="mobile">{isBn ? '📱 মোবাইল' : '📱 Mobile'}</option>
                  <option value="desktop">{isBn ? '💻 ডেস্কটপ' : '💻 Desktop'}</option>
                  <option value="tablet">{isBn ? '📟 ট্যাবলেট' : '📟 Tablet'}</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer truncate"
                >
                  <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
                  <option value="active">{isBn ? '🟢 সক্রিয়' : '🟢 Active'}</option>
                  <option value="bounced">{isBn ? '🚪 বাউন্সড' : '🚪 Bounced'}</option>
                  <option value="bot">{isBn ? '🟡 বট স্পাইডার' : '🟡 Bots'}</option>
                  <option value="blocked">{isBn ? '🔴 ব্লকড' : '🔴 Blocked'}</option>
                </select>
              </div>
            </div>

            {/* Sessions Table with Fixed Spacious Layout and Non-wrapping Badges */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[1000px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4 w-[180px]">{isBn ? 'ভিজিটর ও অবস্থান' : 'Visitor & Location'}</th>
                      <th className="py-3 px-4 w-[180px]">{isBn ? 'আইপি ও নেটওয়ার্ক আইএসপি' : 'IP & Network ISP'}</th>
                      <th className="py-3 px-4 w-[230px]">{isBn ? 'ডিভাইস ও সুনির্দিষ্ট মডেল' : 'Device & Exact Model'}</th>
                      <th className="py-3 px-4 w-[240px]">{isBn ? 'বর্তমান পেজ ও কার্যক্রম' : 'Current Page & Activity'}</th>
                      <th className="py-3 px-4 w-[150px]">{isBn ? 'সেশনের স্থায়িত্ব' : 'Session Duration'}</th>
                      <th className="py-3 px-4 w-[130px]">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-3 px-4 text-right w-[110px]">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2.5 max-w-md mx-auto">
                            <Activity className="w-8 h-8 text-orange-500/60 animate-pulse" />
                            <span className="font-bold text-slate-800 dark:text-white text-sm">
                              {telemetryMode === 'real'
                                ? (isBn ? 'বর্তমানে স্টোরফ্রন্টে কোনো সক্রিয় ক্রেতা নেই' : 'No Active Shoppers on Storefront Right Now')
                                : (isBn ? 'ফিল্টারের সাথে কোনো সেশন মিলেনি' : 'No sessions matching the filter')}
                            </span>
                            <p className="text-xs text-slate-500">
                              {telemetryMode === 'real'
                                ? (isBn
                                    ? 'রিয়েল টেলিমেট্রি মোড কেবল গ্রাহকদের স্টোরফ্রন্ট ব্রাউজিং ট্র্যাক করে (অ্যাডমিন পোর্টাল অন্তর্ভুক্ত নয়)। লাইভ দেখতে অন্য ট্যাবে বা ফোনে /products বা /cart খুলুন।'
                                    : 'Real telemetry mode only tracks customer storefront activity (admin portal is excluded). Open any storefront page (/products, /cart) in another tab or mobile device to see live telemetry.')
                                : (isBn ? 'আপনার সার্চ কি-ওয়ার্ড বা ফিল্টার পরিবর্তন করুন।' : 'Try changing your search keywords or KPI filter.')}
                            </p>
                            {kpiFilter !== 'all' && (
                              <button
                                type="button"
                                onClick={() => setKpiFilter('all')}
                                className="text-xs text-orange-600 dark:text-orange-400 font-bold underline cursor-pointer mt-1"
                              >
                                {isBn ? 'বর্তমান কেপিআই ফিল্টার মুছুন' : 'Clear current KPI filter'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((sess) => {
                        const isBlocked = sess.status === 'blocked';
                        const routeCount = sess.routeHistory?.length || 1;
                        return (
                          <tr
                            key={sess.id}
                            onClick={() => setSelectedJourneySession(sess)}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                              sess.isCartActive ? 'bg-orange-500/5 dark:bg-orange-500/5' : ''
                            } ${sess.isBounced ? 'bg-purple-500/5 dark:bg-purple-500/5' : ''}`}
                            title={isBn ? 'সম্পূর্ণ রুট জার্নি ও ডিভাইস স্পেক দেখতে ক্লিক করুন' : 'Click row to inspect complete Route Journey & Device Specs'}
                          >
                            {/* Visitor & Location & Contact Lead */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl shrink-0" title={sess.country}>{sess.flag}</span>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 dark:text-white block truncate text-xs hover:text-orange-600 dark:hover:text-orange-400">
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

                            {/* Current Page & Activity with Route Journey Badge */}
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
                                    <span>{isBn ? 'সক্রিয় কার্ট' : 'Cart Active'}</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate max-w-[210px] mt-0.5">
                                <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-semibold text-[9px] text-slate-600 dark:text-slate-400">
                                  {isBn ? `${routeCount}টি রুট` : `${routeCount} ${routeCount > 1 ? 'routes' : 'route'}`}
                                </span>
                                <span>•</span>
                                <span className="truncate">{sess.referrer}</span>
                              </div>
                            </td>

                            {/* Session Duration & Hits */}
                            <td className="py-3.5 px-4 font-mono text-[11px]">
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">
                                {Math.floor(sess.durationSeconds / 60)}m {sess.durationSeconds % 60}s
                              </span>
                              <span className="text-[10px] text-slate-500 font-sans">
                                {sess.pageviews} {isBn ? 'ভিউ' : 'views'} • {sess.lastActiveAt}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {isBlocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold shrink-0">
                                  <ShieldX className="w-3 h-3" />
                                  <span>{isBn ? 'ব্লকড' : 'Blocked'}</span>
                                </span>
                              ) : sess.status === 'bot' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <Cpu className="w-3 h-3" />
                                  <span>{isBn ? 'সার্চ স্পাইডার' : 'Search Spider'}</span>
                                </span>
                              ) : sess.isBounced ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <span>{isBn ? 'বাউন্সড' : 'Bounced'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0 whitespace-nowrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>{isBn ? 'সক্রিয়' : 'Active'}</span>
                                </span>
                              )}
                            </td>

                            {/* Action Buttons: Journey Inspect + Block */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedJourneySession(sess)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/25 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                  title={isBn ? 'রুট নেভিগেশন টাইমলাইন পর্যালোচনা করুন' : 'Inspect Route Navigation Timeline'}
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'জার্নি' : 'Journey'}</span>
                                </button>

                                {isBlocked ? (
                                  <button
                                    type="button"
                                    onClick={() => handleUnblock(sess.ip)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                    title={isBn ? 'এই আইপি অ্যাড্রেস আনব্লক করুন' : 'Unblock this IP Address'}
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>{isBn ? 'আনব্লক' : 'Unblock'}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedIPToBlock(sess.ip)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                    title={isBn ? 'এই আইপি অ্যাড্রেস ব্লক করুন' : 'Block this IP Address'}
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    <span>{isBn ? 'ব্লক' : 'Block'}</span>
                                  </button>
                                )}
                              </div>
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
                    <span>{isBn ? 'জিও-ফেন্সিং ও কান্ট্রি ফায়ারওয়াল মোড:' : 'Geo-Fencing & Country Firewall Mode:'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      geoPolicyMode === 'domestic_only'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      {geoPolicyMode === 'domestic_only'
                        ? (isBn ? '🇧🇩 কেবল অভ্যন্তরীণ হোয়াইটলিস্ট' : '🇧🇩 Domestic Whitelist Only')
                        : (isBn ? '🌐 গ্লোবাল উইথ সিলেক্টিভ ব্যান' : '🌐 Global with Selective Bans')}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {geoPolicyMode === 'domestic_only'
                      ? (isBn
                          ? 'কেবলমাত্র বাংলাদেশের ভিজিটরদের ব্রাউজ ও অর্ডার করতে অনুমতি দেওয়া হয়েছে। সকল আন্তর্জাতিক ট্রাফিক ব্লকড।'
                          : 'Only Bangladesh visitors are permitted to browse and place orders. All international traffic is blocked.')
                      : (isBn
                          ? 'সাধারণভাবে গ্লোবাল ট্রাফিক অনুমোদিত। আপনি নিচে যেকোনো একক দেশ ব্লক করতে পারেন।'
                          : 'Global traffic is allowed by default. You can selectively block any individual country below.')}
                  </p>
                </div>
              </div>

              {/* Policy Toggle Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-slate-700 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setGeoPolicyMode('global');
                    showToast(isBn ? 'সিলেক্টিভ ব্যান সহ গ্লোবাল ট্রাফিক মোডে পরিবর্তিত হয়েছে।' : 'Switched to Global Traffic Mode with selective country bans.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    geoPolicyMode === 'global'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isBn ? '🌐 গ্লোবাল মোড' : '🌐 Global Mode'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeoPolicyMode('domestic_only');
                    showToast(isBn ? 'ডোমেস্টিক হোয়াইটলিস্ট সক্রিয়: কেবল বাংলাদেশ ট্রাফিক অনুমোদিত।' : 'Domestic Whitelist Active: Only Bangladesh traffic is now permitted.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    geoPolicyMode === 'domestic_only'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isBn ? '🇧🇩 শুধু বাংলাদেশ' : '🇧🇩 Bangladesh Only'}
                </button>
              </div>
            </div>

            {/* Country List & Dynamic City Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card: Top Countries */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      {isBn ? 'ট্রাফিক ভলিউম অনুযায়ী শীর্ষ দেশসমূহ' : 'Top Countries by Traffic Volume'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isBn ? 'ডানপাশে বিস্তারিত বিভাগ ও সিটি ম্যাট্রিক্স দেখতে যেকোনো দেশে ক্লিক করুন।' : 'Click any country to view its detailed city & division matrix on the right.'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {liveVisitorCount} {isBn ? 'সক্রিয়' : 'Active'}
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
                                  {isBn ? 'প্রধান' : 'Primary'}
                                </span>
                              )}
                              {isSelected && (
                                <span className="px-1.5 py-0.2 rounded-md bg-blue-500 text-white text-[9px] font-black uppercase">
                                  {isBn ? 'নির্বাচিত' : 'Selected'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                              <span>{c.count} {isBn ? 'ভিজিটর' : 'visitors'}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{c.pct}% {isBn ? 'মোট ট্রাফিকের' : 'of total traffic'}</span>
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
                              title={isBn ? 'দেশ আনব্লক করুন' : 'Unblock Country'}
                            >
                              <ShieldX className="w-3 h-3" />
                              <span>{isBn ? 'ব্লকড' : 'Blocked'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleToggleCountry(c.code, c.country, e)}
                              className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-500/15 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                              title={isBn ? 'এই দেশ ব্লক করুন' : 'Block this Country'}
                            >
                              <Ban className="w-3 h-3" />
                              <span>{isBn ? 'ব্লক' : 'Block'}</span>
                            </button>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-500 translate-x-0.5' : 'text-slate-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Card: Dynamic City & Division Matrix */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-xl">{activeCountryData.flag}</span>
                      <span>{isBn ? `${activeCountryData.country} আঞ্চলিক বিভাজন` : `${activeCountryData.country} Regional Breakdown`}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isBn
                        ? `বিভাগীয় ও মহানগর ট্রাফিক ঘনত্ব (~${selectedCountryTotalVisitors} লাইভ সেশন • ${selectedCountryPct}%)`
                        : `Subdivision & metropolitan city traffic density (~${selectedCountryTotalVisitors} live sessions • ${selectedCountryPct}%)`}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
                    {activeCountryData.cities.length} {isBn ? 'টি অঞ্চল' : 'Regions'}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeCountryData.cities.map((cityObj) => {
                    const isRealMode = telemetryMode === 'real';
                    let cityLiveCount = 0;
                    let cityPercentage = 0;

                    if (isRealMode) {
                      const countrySessions = sessions.filter((s) => s.countryCode === selectedCountryCode);
                      const matchedSessions = countrySessions.filter(
                        (s) =>
                          s.city?.toLowerCase().includes(cityObj.city.toLowerCase()) ||
                          cityObj.city.toLowerCase().includes(s.city?.toLowerCase() || '') ||
                          s.city?.toLowerCase().includes(cityObj.subdivision.toLowerCase()) ||
                          cityObj.subdivision.toLowerCase().includes(s.city?.toLowerCase() || '')
                      );
                      cityLiveCount = matchedSessions.length;
                      cityPercentage =
                        countrySessions.length > 0
                          ? Math.round((cityLiveCount / countrySessions.length) * 100)
                          : 0;
                    } else {
                      cityLiveCount = Math.round((selectedCountryTotalVisitors * cityObj.percentage) / 100);
                      cityPercentage = cityObj.percentage;
                    }

                    return (
                      <div
                        key={cityObj.city}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                cityLiveCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 opacity-40'
                              }`}
                            />
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
                            <span className="text-slate-500">{cityLiveCount} {isBn ? 'লাইভ' : 'live'}</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {cityPercentage}%
                            </span>
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${cityPercentage}%` }}
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
                {isBn ? 'ডিভাইস ক্যাটাগরি শেয়ার' : 'Device Category Share'}
              </h3>
              <div className="space-y-4">
                {deviceData.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.type} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <Icon className="w-4 h-4 text-orange-500" />
                          <span>{d.type === 'Mobile' ? (isBn ? 'মোবাইল' : 'Mobile') : d.type === 'Desktop' ? (isBn ? 'ডেস্কটপ' : 'Desktop') : (isBn ? 'ট্যাবলেট' : 'Tablet')}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                          {d.pct}% ({d.count} {isBn ? 'জন ইউজার' : 'users'})
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
                {isBn ? 'অপারেটিং সিস্টেম বিভাজন' : 'Operating System Distribution'}
              </h3>
              <div className="space-y-2.5 text-xs">
                {osDistribution.map((item) => (
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
                {isBn ? 'ব্রাউজার ইকোসিস্টেম' : 'Browser Ecosystem'}
              </h3>
              <div className="space-y-2.5 text-xs">
                {browserDistribution.map((item) => (
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
              {isBn ? 'ট্রাফিক সোর্স ও ক্যাম্পেইন প্রবাহ' : 'Traffic Acquisition & Campaign Inflows'}
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
                    ~{src.visitors} {isBn ? 'লাইভ সক্রিয় সেশন' : 'live active sessions'}
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
                  {isBn ? `আইপি ফায়ারওয়াল ব্ল্যাকলিস্ট (${blockedIPs.length}টি ব্লকড আইপি)` : `IP Firewall Blacklist (${blockedIPs.length} Blocked Addresses)`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'ব্লকড আইপি অ্যাড্রেস থেকে চেকআউট বা অটোমেটেড রিকোয়েস্ট সম্পূর্ণ নিষিদ্ধ।' : 'Blocked IP addresses are barred from making checkout transactions or automated requests.'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {blockedIPs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  {isBn ? 'বর্তমানে কোনো আইপি ব্ল্যাকলিস্টে নেই।' : 'No IP addresses currently in the blacklist shield.'}
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
                            {isBn ? 'নিষিদ্ধ' : 'Banned'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {isBn ? 'কারণ: ' : 'Reason: '}{b.reason}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isBn ? 'ব্লক করার তারিখ: ' : 'Blocked on: '}{b.blockedAt} {isBn ? 'কর্তৃক' : 'by'} {b.blockedBy}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUnblock(b.ip)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {isBn ? 'আনব্লক ও হোয়াইটলিস্ট' : 'Unblock & Whitelist'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 VISITOR ROUTE JOURNEY & HARDWARE DRILLDOWN DRAWER */}
      {selectedJourneySession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200" onClick={() => setSelectedJourneySession(null)}>
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl shrink-0" title={selectedJourneySession.country}>
                  {selectedJourneySession.flag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      {selectedJourneySession.customerName || (isBn ? 'গেস্ট ক্রেতা' : 'Guest Shopper')}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedJourneySession.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : selectedJourneySession.status === 'blocked'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {selectedJourneySession.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {selectedJourneySession.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    IP: {selectedJourneySession.ip} • {selectedJourneySession.city}, {selectedJourneySession.country}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJourneySession(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                title={isBn ? 'বন্ধ করুন' : 'Close Drawer'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-5 space-y-6 flex-1">
              {/* 4 Summary Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{isBn ? 'মোট হিটস' : 'Total Hits'}</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{selectedJourneySession.pageviews} {isBn ? 'ভিউ' : 'Views'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{isBn ? 'মোট সময়' : 'Total Duration'}</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    {Math.floor(selectedJourneySession.durationSeconds / 60)}m {selectedJourneySession.durationSeconds % 60}s
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{isBn ? 'ডিভাইসের ধরন' : 'Device Type'}</span>
                  <span className="font-bold text-xs text-orange-600 dark:text-orange-400 truncate block">{selectedJourneySession.device}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{isBn ? 'কার্ট মূল্য' : 'Cart Value'}</span>
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {selectedJourneySession.isCartActive ? `৳${selectedJourneySession.cartValueBDT?.toLocaleString() || '0'}` : (isBn ? 'কার্ট নেই' : 'No Cart')}
                  </span>
                </div>
              </div>

              {/* Hardware & Client Environment Specs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-500" />
                  {isBn ? 'হার্ডওয়্যার ও সিস্টেম এনভায়রনমেন্ট' : 'Hardware & System Environment'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">{isBn ? 'সুনির্দিষ্ট হার্ডওয়্যার মডেল:' : 'Exact Hardware Model:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedJourneySession.deviceModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">{isBn ? 'অপারেটিং সিস্টেম:' : 'Operating System:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedJourneySession.os}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">{isBn ? 'ব্রাউজার ও সংস্করণ:' : 'Browser & Version:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedJourneySession.browser}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">{isBn ? 'ইন্টারনেট সার্ভিস প্রোভাইডার:' : 'Internet Service Provider:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate">{selectedJourneySession.isp}</span>
                  </div>
                </div>
              </div>

              {/* NAVIGATION ROUTE TIMELINE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-orange-500" />
                    {isBn ? `সম্পূর্ণ রুট নেভিগেশন জার্নি (${selectedJourneySession.routeHistory?.length || 1}টি রুট)` : `Complete Route Navigation Journey (${selectedJourneySession.routeHistory?.length || 1} Routes)`}
                  </h4>
                  <span className="text-[10px] text-slate-500">{isBn ? 'প্রবেশের ক্রমানুসারে সাজানো' : 'Sorted by entry order'}</span>
                </div>

                <div className="space-y-2.5">
                  {(selectedJourneySession.routeHistory || [
                    {
                      path: selectedJourneySession.currentUrl,
                      durationSeconds: selectedJourneySession.durationSeconds,
                      lastVisitedAt: selectedJourneySession.startedAt,
                    }
                  ]).map((route, rIdx) => {
                    const pctOfTotal = Math.min(100, Math.round(((route.durationSeconds || 1) / Math.max(1, selectedJourneySession.durationSeconds)) * 100));
                    const isHighEngagement = (route.durationSeconds || 1) >= 60;
                    const isCurrent = route.path === selectedJourneySession.currentUrl;

                    return (
                      <div
                        key={`${route.path}-${rIdx}`}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/40 shadow-xs ring-1 ring-orange-500/20'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {rIdx + 1}
                            </span>
                            <span className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400 truncate">
                              {route.path}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold shrink-0">
                                {isBn ? 'বর্তমানে এই পেজে' : 'Live On Page'}
                              </span>
                            )}
                            {isHighEngagement && (
                              <span className="px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold shrink-0 flex items-center gap-1">
                                {isBn ? '🔥 উচ্চ আগ্রহ' : '🔥 High Interest'}
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 shrink-0">
                            {Math.floor((route.durationSeconds || 1) / 60)}m {(route.durationSeconds || 1) % 60}s
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                              style={{ width: `${pctOfTotal}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{pctOfTotal}% {isBn ? 'সেশনের' : 'of session'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedJourneySession.ip);
                  showToast(isBn ? `আইপি ${selectedJourneySession.ip} ক্লিপবোর্ডে কপি করা হয়েছে।` : `IP ${selectedJourneySession.ip} copied to clipboard.`);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {isBn ? 'আইপি অ্যাড্রেস কপি করুন' : 'Copy IP Address'}
              </button>

              <div className="flex items-center gap-2">
                {selectedJourneySession.status === 'blocked' ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleUnblock(selectedJourneySession.ip);
                      setSelectedJourneySession((prev) => (prev ? { ...prev, status: 'active' } : null));
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    {isBn ? 'আইপি আনব্লক করুন' : 'Unblock IP'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIPToBlock(selectedJourneySession.ip);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    {isBn ? 'আইপি অ্যাড্রেস ব্লক করুন' : 'Block IP Address'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {isBn ? 'আইপি অ্যাড্রেস ব্লক নিশ্চিতকরণ' : 'Confirm IP Address Block'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn ? 'এই ভিজিটরকে স্টোরফ্রন্ট এবং চেকআউট থেকে নিষিদ্ধ করুন।' : 'Bar this visitor from accessing storefront and checkout.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              IP: {selectedIPToBlock}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isBn ? 'ব্লক করার কারণ (ঐচ্ছিক):' : 'Block Reason (Optional):'}
              </label>
              <input
                type="text"
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                placeholder={isBn ? 'উদাঃ অতিরিক্ত বট স্ক্র্যাপিং / ক্ষতিকারক প্রচেষ্টা' : 'e.g. Excessive bot scraping / malicious attempts'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIPToBlock(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all cursor-pointer"
              >
                {isBn ? 'আইপি ব্লক নিশ্চিত করুন' : 'Confirm Block IP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

