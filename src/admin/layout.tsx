'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  ArrowUpRight,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Truck,
  Users,
  LogOut,
  User,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  // Detect screen size for initial mobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false); // default closed on mobile
      } else {
        setIsMobile(false);
        setSidebarOpen(true); // default open on desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      title: 'Dashboard & Analytics',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Products & Inventory',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      title: 'Orders & Invoices',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Live Parcel Tracking',
      href: '/admin/tracking',
      icon: Truck,
    },
    {
      title: 'Coupons & Promotions',
      href: '/admin/coupons',
      icon: Tag,
    },
    {
      title: 'Customer Reviews',
      href: '/admin/reviews',
      icon: MessageSquare,
    },
    {
      title: 'Staff Roles & Security',
      href: '/admin/customers',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col md:flex-row overflow-x-hidden relative">
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Collapsible / Sliding Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isMobile
            ? sidebarOpen
              ? 'translate-x-0 w-72 shadow-2xl'
              : '-translate-x-full w-72'
            : sidebarOpen
            ? 'w-64 translate-x-0'
            : 'w-20 translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Logo & Collapse Switch */}
          <div className={`flex items-center ${!sidebarOpen && !isMobile ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {(sidebarOpen || isMobile) && (
                <div className="transition-opacity duration-300">
                  <h2 className="text-sm font-black text-white leading-tight">Admin Portal</h2>
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                    ShopNexus Official
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer hidden md:flex"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    !sidebarOpen && !isMobile ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={!sidebarOpen && !isMobile ? item.title : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {(sidebarOpen || isMobile) && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 👤 SIDEBAR FOOTER: ADMIN PROFILE & STOREFRONT LINK */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          {/* Admin Profile Box */}
          {sidebarOpen || isMobile ? (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-md">
                  S
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">S.M. Amirul Islam</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-400">Super Admin (Root)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Log Out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md cursor-pointer"
                title="Saad (Super Admin)"
              >
                S
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Storefront Link */}
          <Link
            href="/"
            className={`flex items-center gap-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all ${
              sidebarOpen || isMobile ? 'justify-between' : 'justify-center'
            }`}
            title="Visit Live Storefront"
          >
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {(sidebarOpen || isMobile) && <span>Live Storefront</span>}
            </div>
            {(sidebarOpen || isMobile) && <span className="text-[10px] text-emerald-400 font-mono">Online</span>}
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area with Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Bar */}
        <header className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white md:hidden cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-500 hidden sm:inline">ShopNexus Admin</span>
              <span className="text-slate-700 hidden sm:inline">/</span>
              <span className="text-indigo-400 font-bold capitalize">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Mobile / Topbar Quick Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
