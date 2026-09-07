'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useVisitorAnalyticsStore } from '@/store/useVisitorAnalyticsStore';

const INTERNAL_ROLES = ['admin', 'staff', 'manager', 'support', 'moderator', 'logistics', 'employee', 'care'];

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

    const totals = getTotals ? getTotals() : { itemCount: 0, total: 0 };
    const totalCount = totals.itemCount || (items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
    const totalAmount = totals.total || 0;

    trackStorefrontVisit({
      pathname,
      userRole: user?.role,
      userName: user?.name,
      cartCount: totalCount,
      cartTotal: totalAmount,
    });
  }, [pathname, user?.role, user?.name, items, getTotals, trackStorefrontVisit]);

  return null;
}
