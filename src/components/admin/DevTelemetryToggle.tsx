'use client';

import React, { useEffect, useState } from 'react';
import { useVisitorAnalyticsStore } from '@/store/useVisitorAnalyticsStore';
import { Radio, Sparkles, Laptop, Shield } from 'lucide-react';

export default function DevTelemetryToggle({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const { telemetryMode, setTelemetryMode } = useVisitorAnalyticsStore();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocal(
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.local')
      );
    }
  }, []);

  if (!mounted || !isLocal) {
    return null; // Localhost only: automatically hidden in production builds
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg backdrop-blur-md text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors ${
        compact ? 'scale-95' : ''
      }`}
    >
      <div className="px-2 py-0.5 flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider border-r border-slate-200 dark:border-slate-800">
        <Laptop className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span className="hidden sm:inline">DEV TELEMETRY</span>
      </div>

      {/* Real Local Connection Toggle Button */}
      <button
        type="button"
        onClick={() => setTelemetryMode('real')}
        className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
          telemetryMode === 'real'
            ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800'
        }`}
        title="Show Real Active Customer Storefront Sessions (Admin Traffic Excluded)"
      >
        <span className="relative flex h-2 w-2">
          {telemetryMode === 'real' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span>Real (Live Shopper)</span>
      </button>

      {/* Demo Multi-Visitor Simulation Toggle Button */}
      <button
        type="button"
        onClick={() => setTelemetryMode('demo')}
        className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
          telemetryMode === 'demo'
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/30 ring-1 ring-orange-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800'
        }`}
        title="Show 48 Simulated Global Demo Visitors (For Presentation)"
      >
        <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-200" />
        <span>Demo (48 Sim)</span>
      </button>
    </div>
  );
}
