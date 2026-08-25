'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/useAuthStore';
import { ShieldAlert, Lock, ArrowLeft, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackUrl = '/login',
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400 text-sm">
        <div className="animate-pulse">Verifying security credentials...</div>
      </div>
    );
  }

  // If not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Authentication Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              This management portal is restricted. Please sign in with an authorized account to access these controls.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Sign In to Account
            </Link>
            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If logged in, but role is not authorized (e.g. Customer visiting Admin or Vendor Portal)
  if (!allowedRoles.includes(user.role)) {
    const isSeekingVendor = allowedRoles.includes('vendor');
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-rose-500/20 backdrop-blur-xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Restricted Access (403)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your current account role (<span className="text-orange-600 dark:text-orange-400 font-bold uppercase">{user.role}</span>) is not authorized to view this management console.
            </p>
          </div>

          {isSeekingVendor && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-left space-y-2">
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Want to become a ShopNexus Merchant?</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Upgrade your account or register a store to publish hardware, track orders, and configure payouts.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {isSeekingVendor ? (
              <Link
                href="/vendor/settings"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                Apply for Vendor Account <ArrowRight className="w-4 h-4" />
              </Link>
            ) : null}
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
