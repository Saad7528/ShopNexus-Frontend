'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import {
  Heart,
  Search,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  Bell,
  Camera,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { VisualSearchModal } from '@/components/ai/VisualSearchModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { BrandLogo } from '@/components/common/BrandLogo';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { t, language } = useLanguageStore();

  // Stores
  const { items: wishlistItems } = useWishlistStore();
  const { unreadCount, openDrawer: openNotificationDrawer } = useNotificationStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Local state
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleScrollClose = () => {
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollClose, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollClose);
    };
  }, [userDropdownOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push('/');
  };

  const navLinks = [
    { label: isMounted ? t('nav_home') : 'Home', href: '/' },
    { label: isMounted ? t('nav_products') : 'Products', href: '/products' },
    { label: isMounted ? t('nav_flash_deals') : 'Flash Deals', href: '/flash-sales', badge: 'HOT' },
  ];

  // Hide Navbar on authentication pages (Login, Register, Forgot Password, etc.) and Admin Portal
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  return (
    <>
      {/* Frosted Page Backdrop Overlay when Mobile Menu is Open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300 pointer-events-auto lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        className={`sticky top-0 z-50 w-full transition-[padding] duration-300 ease-out pointer-events-none ${
          isScrolled
            ? 'pt-2 sm:pt-3 px-3 sm:px-5 lg:px-8'
            : 'pt-0 px-0'
        }`}
      >
        <div
          className={`pointer-events-auto mx-auto transition-all duration-300 ease-out ${
            isScrolled
              ? 'max-w-6xl rounded-2xl sm:rounded-full bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/90 shadow-xl shadow-slate-900/5 dark:shadow-black/40 px-3.5 sm:px-5 lg:px-6'
              : 'w-full max-w-7xl rounded-none bg-white dark:bg-[#090d16] border border-transparent border-b-slate-200/80 dark:border-b-slate-800/80 px-3 sm:px-6 lg:px-8 shadow-none'
          }`}
        >
          <div
            className={`flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 transition-all duration-300 ${
              isScrolled ? 'h-14 sm:h-15' : 'h-16 sm:h-18'
            }`}
          >
            {/* Brand Logo */}
            <BrandLogo size="md" />

            {/* Desktop Search Bar with AI Camera Trigger */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg min-w-0 mx-2 lg:mx-3">
              <div className="relative w-full flex items-center group">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 dark:text-slate-500 transition-colors shrink-0" />
                <input
                  type="text"
                  placeholder={isMounted ? t('nav_search_placeholder') : 'Search products, brands, audio gear...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-sans shadow-inner truncate"
                />
                <button
                  type="button"
                  onClick={() => setVisualSearchOpen(true)}
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isMounted ? t('nav_ai_search_tooltip') : 'Search by Image (AI Vision)'}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/30 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-linear-to-r from-[#ff4400] to-[#ff7700] text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <LanguageToggle className="hidden lg:inline-flex" />

              <div
                className={`transition-all duration-300 ease-out ${
                  isScrolled
                    ? 'hidden lg:inline-flex opacity-100 scale-100'
                    : 'inline-flex opacity-100 scale-100'
                }`}
              >
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-xs shrink-0"
                  title={isMounted ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Toggle Theme'}
                >
                  {isMounted ? (
                    theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-orange-400 animate-spin-slow" />
                    ) : (
                      <Moon className="w-5 h-5 text-orange-500" />
                    )
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Link
                href="/wishlist"
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all shadow-xs shrink-0"
                title={isMounted ? t('nav_wishlist') : 'Wishlist'}
              >
                <Heart className="w-5 h-5" />
                {isMounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {language === 'bn' ? toBengaliNumber(wishlistItems.length) : wishlistItems.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openNotificationDrawer}
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-xs shrink-0"
                title={isMounted ? t('nav_notifications') : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {isMounted && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                    {language === 'bn' ? toBengaliNumber(unreadCount) : unreadCount}
                  </span>
                )}
              </button>

              <div className="relative hidden lg:block" ref={dropdownRef}>
                {isMounted && isAuthenticated && user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-7 h-7 rounded-lg object-cover border border-orange-500/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#ff4400] to-[#ff7700] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isMounted ? t('nav_sign_in') : 'Sign In'}</span>
                  </Link>
                )}

                {userDropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/50 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{isMounted ? t('nav_my_profile') : 'My Profile'}</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-500/10 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isMounted ? t('nav_admin_dashboard') : 'Admin Dashboard'}</span>
                        </Link>
                      )}

                      {user.role === 'vendor' && (
                        <Link
                          href="/vendor/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Vendor Portal</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{isMounted ? t('nav_sign_out') : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`relative lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer transition-all duration-300 ${
                  isScrolled ? 'hover:border-orange-500/50 shadow-xs' : ''
                }`}
                title="Open Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Mobile & Tablet Glassmorphism Navigation Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto lg:hidden fixed sm:absolute top-18 sm:top-full mt-2 inset-x-3 sm:inset-x-5 max-w-sm sm:max-w-md mx-auto z-50 rounded-3xl bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800/80 shadow-2xl shadow-slate-950/20 dark:shadow-black/70 p-3.5 sm:p-4 space-y-3 animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                    pathname === link.href
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {isMounted && isAuthenticated && user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 flex items-center gap-2 transition-all shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>{isMounted ? t('nav_admin_dashboard') : 'Admin Dashboard'}</span>
                </Link>
              )}
            </div>

            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              {isMounted && isAuthenticated && user ? (
                <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-3 shadow-xs">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} className="w-8 h-8 rounded-xl object-cover border border-orange-500/40 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <User className="w-4 h-4" /> {isMounted ? t('nav_sign_in') : 'Sign In / Create Account'}
                </Link>
              )}
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 pl-1.5">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
                  <span>{language === 'bn' ? (theme === 'dark' ? 'ডার্ক মোড' : 'লাইট মোড') : (theme === 'dark' ? 'Dark Theme' : 'Light Theme')}</span>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 shadow-xs cursor-pointer transition-all"
                >
                  <span>{theme === 'dark' ? '☀️ ' + (language === 'bn' ? 'লাইট' : 'Light') : '🌙 ' + (language === 'bn' ? 'ডার্ক' : 'Dark')}</span>
                </button>
              </div>

              <div className="p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pl-1.5">
                  <span className="text-sm">🌐</span>
                  <span>{language === 'bn' ? 'ভাষা / Language' : 'Language / ভাষা'}</span>
                </span>
                <div className="flex items-center p-0.5 rounded-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  <button
                    type="button"
                    onClick={() => language !== 'en' && useLanguageStore.getState().setLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => language !== 'bn' && useLanguageStore.getState().setLanguage('bn')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      language === 'bn'
                        ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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