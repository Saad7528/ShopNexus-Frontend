'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useVisitorAnalyticsStore } from '@/store/useVisitorAnalyticsStore';

const INTERNAL_ROLES = ['admin', 'staff', 'manager', 'support', 'moderator', 'logistics', 'employee', 'care'];

const getClientEnvironment = () => {
  if (typeof window === 'undefined') {
    return {
      device: 'Desktop' as const,
      deviceModel: 'MacBook Pro 16" (Apple Silicon)',
      os: 'macOS Sonoma',
      browser: 'Google Chrome 124',
    };
  }

  const ua = navigator.userAgent;
  const isTablet = /Tablet|iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = !isTablet && /Mobi|Android|iPhone|iPod/i.test(ua);

  let device: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (isTablet) device = 'Tablet';
  else if (isMobile) device = 'Mobile';

  // OS & Hardware Model Detection
  let os = 'macOS Sonoma';
  let deviceModel = 'Apple Mac (M-Series)';

  if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS Sonoma';
    deviceModel = 'MacBook Pro / Air (Apple Silicon)';
  } else if (/iPhone/i.test(ua)) {
    os = 'iOS 17.5';
    deviceModel = 'Apple iPhone 15 Pro';
  } else if (/iPad/i.test(ua)) {
    os = 'iPadOS 17.5';
    deviceModel = 'Apple iPad Pro';
  } else if (/Android/i.test(ua)) {
    os = 'Android 14 (OneUI / HyperOS)';
    deviceModel = 'Samsung Galaxy / Pixel 5G';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows 11 Pro';
    deviceModel = 'Desktop PC (Dell / ASUS / Lenovo)';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux x86_64';
    deviceModel = 'Linux Workstation';
  }

  // Browser Detection
  let browser = 'Google Chrome 124';
  if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge 124';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari 17.5';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Mozilla Firefox 125';
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = 'Samsung Internet 24';
  } else if (/OPR|Opera/i.test(ua)) {
    browser = 'Opera 109';
  }

  return { device, deviceModel, os, browser };
};

export default function StorefrontTelemetryTracker() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const getTotals = useCartStore((s) => s.getTotals);
  const trackStorefrontVisit = useVisitorAnalyticsStore((s) => s.trackStorefrontVisit);

  const isInternalStaff = (role?: string) => {
    if (!role) return false;
    const normalized = role.toLowerCase().trim();
    return INTERNAL_ROLES.some((r) => normalized.includes(r));
  };

  useEffect(() => {
    // Strict Industry Standard: Exclude all internal /admin paths and internal staff accounts (Admin, Staff, Managers, Support)
    if (!pathname || pathname.startsWith('/admin') || isInternalStaff(user?.role)) {
      return;
    }

    // Get or create unique session ID for this browser tab/incognito window
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = sessionStorage.getItem('shopnexus_client_session_id') || '';
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('shopnexus_client_session_id', sessionId);
      }
    }

    const totals = getTotals ? getTotals() : { itemCount: 0, total: 0 };
    const totalCount = totals.itemCount || (items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
    const totalAmount = totals.total || 0;
    const clientEnv = getClientEnvironment();

    const sendPing = () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      fetch(`${API_URL}/telemetry/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          pathname,
          device: clientEnv.device,
          deviceModel: clientEnv.deviceModel,
          os: clientEnv.os,
          browser: clientEnv.browser,
          userName: user?.name,
          contactPhone: user?.phoneNumber,
          cartCount: totalCount,
          cartTotal: totalAmount,
        }),
      }).catch(() => {});
    };

    // 1. Update local Zustand state
    trackStorefrontVisit({
      pathname,
      userRole: user?.role,
      userName: user?.name,
      cartCount: totalCount,
      cartTotal: totalAmount,
      device: clientEnv.device,
      deviceModel: clientEnv.deviceModel,
      os: clientEnv.os,
      browser: clientEnv.browser,
    });

    // 2. Ping backend immediately & every 12 seconds for real-time live presence
    sendPing();
    const interval = setInterval(sendPing, 12000);
    return () => clearInterval(interval);
  }, [pathname, user?.role, user?.name, user?.phoneNumber, items, getTotals, trackStorefrontVisit]);

  return null;
}
