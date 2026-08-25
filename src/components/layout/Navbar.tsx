/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { VisualSearchModal } from '@/components/ai/VisualSearchModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { useThemeStore } from '@/store/useThemeStore';
import {
  ShoppingBag,
  Heart,
  Search,
  Store,
  ShieldCheck,
  Zap,
  Layers,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Camera,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openDrawer, getTotals } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, openDrawer: openNotificationDrawer } = useNotificationStore();
  const { theme, toggleTheme } = useThemeStore();
  const { itemCount } = getTotals();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide Navbar completely on Auth Pages and Admin Panel
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Flash Deals', href: '/flash-sales', badge: 'HOT' },
    ...(isMounted && user?.role === 'admin'
      ? [{ label: 'Admin Portal', href: '/admin/dashboard', isAdmin: true }]
      : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" title="ShopNexus Home">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#ff4400] via-[#ff6600] to-[#ff8800] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                ShopNexus
              </span>
            </Link>

            {/* Search Bar with AI Camera Trigger */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-2 lg:mx-4">
              <div className="relative w-full flex items-center group">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 dark:text-slate-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products, brands, audio gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-sans shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setVisualSearchOpen(true)}
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Search by Image (AI Vision)"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      link.isAdmin
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/20'
                        : isActive
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/30 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    {link.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-xs animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons: Notification Bell, Wishlist, Cart Drawer, User */}
            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-300 transition-all cursor-pointer shadow-sm"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {isMounted && theme === 'light' ? (
                  <Moon className="w-4 h-4 text-slate-700" />
                ) : (
                  <Sun className="w-4 h-4 text-orange-400" />
                )}
              </button>

              {/* AI Visual Search Button (Mobile) */}
              <button
                type="button"
                onClick={() => setVisualSearchOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-all cursor-pointer"
                title="AI Visual Search"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Notification Bell Button */}
              <button
                type="button"
                onClick={openNotificationDrawer}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all cursor-pointer group shadow-sm"
                title="Price Drops & Notifications"
              >
                <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {isMounted && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/40 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-all group shadow-sm"
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {isMounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/40">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative flex items-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="w-5 h-5 rounded-full bg-white/25 text-white text-[11px] font-bold flex items-center justify-center">
                  {isMounted ? itemCount : 0}
                </span>
              </button>

              {/* User Auth Profile / Login Button */}
              {isMounted && isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                        My Profile & Orders
                      </Link>
                      {user.role === 'vendor' && (
                        <Link
                          href="/vendor/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Store className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                          Vendor Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-orange-600 dark:text-orange-300 hover:text-orange-700 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:text-orange-500 dark:hover:text-orange-400 transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </form>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      pathname === link.href
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Modals & Drawers */}
      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
      />
      <NotificationDrawer />
    </>
  );
};