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
      deviceModel: 'MacBook Pro / PC',
      os: 'macOS / Windows',
      browser: 'Google Chrome',
    };
  }

  const ua = navigator.userAgent;
  const width = window.screen.width;
  const height = window.screen.height;
  const ratio = window.devicePixelRatio || 1;

  // 1. Tablet Detection (iPad, Android Tablet, Surface)
  const isIPad =
    /iPad/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !/iPhone/i.test(ua));
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  const isTablet = isIPad || isAndroidTablet;

  // 2. Mobile Phone Detection
  const isIPhone = /iPhone/i.test(ua) && !isIPad;
  const isAndroidPhone = /Android/i.test(ua) && /Mobile/i.test(ua);
  const isMobile = isIPhone || isAndroidPhone || (!isTablet && /Mobi|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua));

  let device: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (isTablet) device = 'Tablet';
  else if (isMobile) device = 'Mobile';

  // 3. OS Detection & Version
  let os = 'Unknown OS';
  let deviceModel = 'Personal Computer';

  if (isIPhone) {
    const iosMatch = ua.match(/OS (\d+[_\.]\d+)/i);
    const iosVer = iosMatch ? iosMatch[1].replace('_', '.') : '17.5';
    os = `iOS ${iosVer}`;

    // Precise iPhone Model from viewport & pixel ratio
    if (ratio >= 3) {
      if (height >= 932 || width >= 430) deviceModel = 'Apple iPhone 15/16 Pro Max';
      else if (height >= 852 || width >= 393) deviceModel = 'Apple iPhone 15/16 Pro';
      else if (height >= 844 || width >= 390) deviceModel = 'Apple iPhone 14/13 Pro';
      else deviceModel = 'Apple iPhone Pro (OLED)';
    } else {
      deviceModel = 'Apple iPhone (Retina)';
    }
  } else if (isIPad) {
    const iosMatch = ua.match(/OS (\d+[_\.]\d+)/i);
    const iosVer = iosMatch ? iosMatch[1].replace('_', '.') : '17.5';
    os = `iPadOS ${iosVer}`;
    deviceModel = width >= 1024 ? 'Apple iPad Pro 12.9"' : 'Apple iPad Air / Pro';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    const macMatch = ua.match(/Mac OS X (\d+[_\.]\d+)/i);
    const macVer = macMatch ? macMatch[1].replace(/_/g, '.') : '14.5';
    os = macVer.startsWith('10.15') ? 'macOS Catalina' : macVer.startsWith('14') ? 'macOS Sonoma' : macVer.startsWith('15') ? 'macOS Sequoia' : `macOS ${macVer}`;
    
    // Hardware Architecture
    const isAppleSilicon = !/Intel/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0 || (window.screen.colorDepth === 30 || window.devicePixelRatio === 2);
    deviceModel = isAppleSilicon ? 'Apple Mac (Apple Silicon M-Series)' : 'Apple Mac (Intel)';
  } else if (/Android/i.test(ua)) {
    const androidMatch = ua.match(/Android (\d+(\.\d+)?)/i);
    const androidVer = androidMatch ? androidMatch[1] : '14';
    os = `Android ${androidVer}`;

    // Brand Identification
    if (/SM-|Samsung/i.test(ua)) deviceModel = 'Samsung Galaxy (OneUI 6)';
    else if (/Pixel/i.test(ua)) deviceModel = 'Google Pixel 5G';
    else if (/Xiaomi|Redmi|POCO|Mi /i.test(ua)) deviceModel = 'Xiaomi / Redmi (HyperOS)';
    else if (/OnePlus/i.test(ua)) deviceModel = 'OnePlus 5G (OxygenOS)';
    else if (/Vivo/i.test(ua)) deviceModel = 'Vivo 5G (Funtouch OS)';
    else if (/Oppo/i.test(ua)) deviceModel = 'OPPO (ColorOS)';
    else if (/Realme/i.test(ua)) deviceModel = 'Realme 5G';
    else if (/Infinix/i.test(ua)) deviceModel = 'Infinix (XOS)';
    else if (/Tecno/i.test(ua)) deviceModel = 'Tecno (HiOS)';
    else deviceModel = 'Android Smartphone 5G';
  } else if (/Windows/i.test(ua)) {
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 11 / 10 Pro';
    else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
    else os = 'Windows PC';
    deviceModel = 'Desktop PC / Laptop (x64)';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux x86_64';
    deviceModel = /Ubuntu/i.test(ua) ? 'Ubuntu Linux Workstation' : 'Linux Workstation';
  }

  // 4. Browser Detection
  let browser = 'Google Chrome';
  if (/Edg/i.test(ua)) {
    const v = ua.match(/Edg\/(\d+)/i)?.[1] || '124';
    browser = `Microsoft Edge ${v}`;
  } else if (/SamsungBrowser/i.test(ua)) {
    const v = ua.match(/SamsungBrowser\/(\d+)/i)?.[1] || '24';
    browser = `Samsung Internet ${v}`;
  } else if (/Firefox/i.test(ua)) {
    const v = ua.match(/Firefox\/(\d+)/i)?.[1] || '125';
    browser = `Mozilla Firefox ${v}`;
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    const v = ua.match(/Version\/(\d+)/i)?.[1] || '17';
    browser = `Apple Safari ${v}`;
  } else if (/OPR|Opera/i.test(ua)) {
    browser = 'Opera Browser';
  } else if (/Chrome/i.test(ua)) {
    const v = ua.match(/Chrome\/(\d+)/i)?.[1] || '124';
    browser = `Google Chrome ${v}`;
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
      const payload = {
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
      };

      // 1. Direct Next.js Serverless Route (Always works on Vercel without localhost barrier)
      fetch('/api/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // 2. Also ping dedicated backend if configured
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        fetch(`${API_URL}/telemetry/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
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

    // 2. Ping backend immediately & every 4 seconds for real-time live presence
    sendPing();
    const interval = setInterval(sendPing, 4000);
    return () => clearInterval(interval);
  }, [pathname, user?.role, user?.name, user?.phoneNumber, items, getTotals, trackStorefrontVisit]);

  return null;
}
