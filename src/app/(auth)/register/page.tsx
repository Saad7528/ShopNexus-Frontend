'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  Gift,
  ShoppingBag,
  Percent,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AuthBackground } from '@/components/auth/AuthBackground';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | 'github' | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '366763068082-o3g1ov9e90gfibqkp4pbcetpmispn8i3.apps.googleusercontent.com';
  const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23liAJj2cQQR3JhrHY';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role: 'customer',
      };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (_jsonErr) {
        throw new Error(`Server connection issue (${res.status} ${res.statusText || 'Error'}). Please verify API URL.`);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.data.user, data.data.token);
      setShowWelcomeModal(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsOAuthLoading('google');
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : '';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20email%20profile&include_granted_scopes=true&state=shopnexus_google_auth`;
    window.location.href = googleAuthUrl;
  };

  const handleGitHubOAuth = () => {
    setIsOAuthLoading('github');
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/github` : '';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user:email`;
  };

  const handleContinueShopping = () => {
    setShowWelcomeModal(false);
    router.push('/products');
  };

  return (
    <AuthBackground>
      {/* Centered Clickable ShopNexus Logo */}
      <BrandLogo size="lg" variant="white" className="mb-6 drop-shadow-2xl" />

      {/* Solid Frosted Glass Form Card with backdrop-blur-sm */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-5">
        
        {/* Subtle Ambient Backlights */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Get started with ShopNexus official ecosystem</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Social Logins */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={!!isOAuthLoading}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-white/10 text-slate-200 text-xs font-semibold transition-all duration-200 hover:border-white/20 active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isOAuthLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGitHubOAuth}
            disabled={!!isOAuthLoading}
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-white/10 text-slate-200 text-xs font-semibold transition-all duration-200 hover:border-white/20 active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isOAuthLoading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
            ) : (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>GitHub</span>
          </button>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-slate-900/90 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            or register with email
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Saad Islam"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saad@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:brightness-110 text-white font-semibold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create ShopNexus Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* 🎉 ANIMATED WELCOME 10% OFF POPUP MODAL (with backdrop-blur-sm) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50 duration-300">
          <div className="relative w-full max-w-md bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-300">
            {/* Glow orb */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Banner */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 animate-bounce">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                <Sparkles className="w-3.5 h-3.5" /> প্রথম অর্ডারে বিশেষ উপহার
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                🎉 স্বাগতম ShopNexus-এ!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                আপনার নতুন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনার প্রথম কেনাকাটায় পাচ্ছেন{' '}
                <strong className="text-orange-400 font-bold">১০% ইনস্ট্যান্ট ছাড়</strong>!
              </p>
            </div>

            {/* Promo Voucher Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-orange-500/30 shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  স্বয়ংক্রিয় অফার
                </span>
                <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md font-mono">
                  10% OFF AUTO-APPLIED
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">প্রথম অর্ডারে ১০% ছাড়</h4>
                  <p className="text-[11px] text-slate-400">
                    চেকআউট পেজে স্বয়ংক্রিয়ভাবে মোট মূল্য থেকে ১০% কমে যাবে।
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                ⚠️ নোট: প্রথম অর্ডারে আলাদা কোনো কুপন কোড বসানোর প্রয়োজন নেই।
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              কেনাকাটা শুরু করুন (Start Shopping)
            </button>
          </div>
        </div>
      )}
    </AuthBackground>
  );
}