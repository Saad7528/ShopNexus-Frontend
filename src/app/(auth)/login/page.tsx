'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Laptop,
  Radio,
  XCircle,
  Ban,
  KeyRound,
  QrCode,
} from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { User } from '@/types/user';
import { ILoginAuthRequest } from '@/app/api/auth/login-requests/route';
import { GoogleAuthenticatorModal } from '@/components/auth/GoogleAuthenticatorModal';
import { MASTER_ADMIN_EMAIL } from '@/lib/totp';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | null>(null);

  // 🛡️ Live 2FA Secondary Device Approval State
  const [pendingChallenge, setPendingChallenge] = useState<ILoginAuthRequest | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<'waiting' | 'approved' | 'denied' | 'denied_and_blocked'>('waiting');
  const [showTotpModal, setShowTotpModal] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '366763068082-o3g1ov9e90gfibqkp4pbcetpmispn8i3.apps.googleusercontent.com';

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Poll for Primary Admin Approval when in pendingChallenge mode
  useEffect(() => {
    if (!pendingChallenge || challengeStatus !== 'waiting') return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/login-requests?requestId=${pendingChallenge.id}`);
        if (!res.ok) return;

        const json = await res.json();
        if (json.success && json.data) {
          const reqData: ILoginAuthRequest = json.data;

          if (reqData.status === 'approved') {
            setChallengeStatus('approved');
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

            // Store approved session validity and ID in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('shopnexus_session_id', reqData.id);
              localStorage.setItem(
                'shopnexus_session_expires_at',
                reqData.expiresAt ? String(reqData.expiresAt) : 'until_revoked'
              );
              localStorage.setItem('shopnexus_session_duration', reqData.duration || '1h');
            }

            // Perform login and redirect
            const approvedAdmin: User = {
              _id: 'usr-admin-01',
              name: 'S.M. Amirul Islam Saad',
              email: reqData.email,
              role: 'admin',
              nexusCoins: 5000,
              isVipMember: true,
            };

            setTimeout(() => {
              login(approvedAdmin, reqData.token || 'remote-approved-jwt-token');
              router.push('/admin/dashboard');
            }, 1200);
          } else if (reqData.status === 'denied') {
            setChallengeStatus('denied');
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setError('প্রাইমারি অ্যাডমিন লগইন অনুরোধ বাতিল করেছেন (Access Denied by Admin).');
          } else if (reqData.status === 'denied_and_blocked') {
            setChallengeStatus('denied_and_blocked');
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setError('🛑 নিরাপত্তা অ্যালার্ট: এই আইপি পার্মানেন্টলি ব্লক করা হয়েছে (IP Blocked in Fraud Shield).');
          }
        }
      } catch {
        // Ignore poll failures
      }
    }, 1500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [pendingChallenge, challengeStatus, login, router]);

  const handleCancelChallenge = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setPendingChallenge(null);
    setChallengeStatus('waiting');
    setError(null);
  };

  const executeDirectAdminLogin = (adminEmail: string, token: string = 'demo-admin-jwt-token') => {
    const fallbackAdmin: User = {
      _id: 'usr-admin-01',
      name: 'S.M. Amirul Islam Saad',
      email: adminEmail,
      role: 'admin',
      nexusCoins: 5000,
      isVipMember: true,
    };
    login(fallbackAdmin, token);
    router.push('/admin/dashboard');
  };

  // Google Authenticator TOTP Master Verification Success Handler
  const handleTotpSuccess = async (token: string) => {
    setShowTotpModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopnexus_primary_master', 'authorized_master_root');
      localStorage.removeItem('shopnexus_session_id');
      localStorage.removeItem('shopnexus_session_expires_at');
      localStorage.removeItem('shopnexus_session_duration');
    }

    // Register active master on server with instant sync
    await fetch('/api/auth/login-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'master_register', email: email || MASTER_ADMIN_EMAIL }),
    }).catch(() => null);

    executeDirectAdminLogin(email || MASTER_ADMIN_EMAIL, token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const targetEmail = email.toLowerCase().trim();
    const isAdminAccount =
      targetEmail.includes('admin') ||
      targetEmail.includes('saad') ||
      targetEmail === MASTER_ADMIN_EMAIL.toLowerCase() ||
      targetEmail === 'admin@shopnexus.io';

    // 🔒 1. If attempting Admin login: VERIFY PASSWORD FIRST!
    if (isAdminAccount) {
      try {
        const verifyRes = await fetch('/api/auth/login-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify_admin_credentials',
            email: targetEmail,
            password: password,
          }),
        });

        const verifyData = await verifyRes.json().catch(() => null);
        if (!verifyData || !verifyData.success) {
          setError(verifyData?.message || 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
          setIsLoading(false);
          return;
        }

        // Credentials are valid! Check current device authority:
        const isPrimaryDevice =
          typeof window !== 'undefined' && localStorage.getItem('shopnexus_primary_master') === 'authorized_master_root';

        const activeSessionExpiresAt =
          typeof window !== 'undefined' ? localStorage.getItem('shopnexus_session_expires_at') : null;

        const isSessionStillValid =
          activeSessionExpiresAt === 'until_revoked' ||
          (activeSessionExpiresAt && Number(activeSessionExpiresAt) > Date.now());

        if (isPrimaryDevice || isSessionStillValid) {
          // Already recognized master device -> enter dashboard directly
          executeDirectAdminLogin(targetEmail);
          return;
        }

        // Check if a Primary Master is ALREADY ACTIVE and ONLINE elsewhere:
        const isAnotherMasterOnline = !!verifyData.isMasterOnline;

        if (isAnotherMasterOnline) {
          // Another master device is currently online -> Dispatch 2FA waiting challenge
          const challengeRes = await fetch('/api/auth/login-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create_request',
              email: targetEmail,
            }),
          });

          const challengeData = await challengeRes.json();
          if (challengeData.success && challengeData.data) {
            setPendingChallenge(challengeData.data);
            setChallengeStatus('waiting');
            setIsLoading(false);
            return;
          }
        } else {
          // No Master is currently online (first login / after logout / 0-second latency) -> Directly prompt for 6-digit TOTP
          setIsLoading(false);
          setShowTotpModal(true);
          return;
        }
      } catch (err) {
        console.error('Admin login verification error:', err);
        setError('লগইন প্রক্রিয়ায় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
        setIsLoading(false);
        return;
      }
    }

    // 2. Standard Customer / Vendor Login Flow
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password }),
      }).catch(() => null);

      let data: { message?: string; data?: { user: User; token: string } } = {};
      if (res && res.ok) {
        data = await res.json().catch(() => ({}));
      }

      if (data.data) {
        login(data.data.user, data.data.token);
        if (data.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/products');
        }
        return;
      }

      throw new Error(data.message || 'Invalid email or password');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ 1-Click Fast Admin Login
  const handleAdminQuickLogin = async () => {
    setIsLoading(true);
    setError(null);
    const targetEmail = MASTER_ADMIN_EMAIL;
    setEmail(targetEmail);
    setPassword('Saad@752800');

    const isPrimaryDevice =
      typeof window !== 'undefined' && localStorage.getItem('shopnexus_primary_master') === 'authorized_master_root';

    if (isPrimaryDevice) {
      executeDirectAdminLogin(targetEmail);
      setIsLoading(false);
      return;
    }

    try {
      const checkRes = await fetch('/api/auth/login-requests?checkMaster=true');
      const checkData = await checkRes.json().catch(() => null);

      if (checkData?.isMasterOnline) {
        // Master is online elsewhere -> Dispatch waiting challenge
        const challengeRes = await fetch('/api/auth/login-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_request',
            email: targetEmail,
          }),
        });

        const challengeData = await challengeRes.json().catch(() => null);
        if (challengeData?.success && challengeData.data) {
          setPendingChallenge(challengeData.data);
          setChallengeStatus('waiting');
        }
      } else {
        // No master online -> Direct TOTP modal
        setShowTotpModal(true);
      }
    } catch {
      setShowTotpModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsOAuthLoading('google');
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : '';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20email%20profile&include_granted_scopes=true&state=shopnexus_google_auth`;
    window.location.href = googleAuthUrl;
  };

  return (
    <AuthBackground>
      <BrandLogo size="lg" variant="white" className="mb-6 drop-shadow-2xl" />

      {/* Google Authenticator Master TOTP Verification Modal */}
      <GoogleAuthenticatorModal
        email={email || MASTER_ADMIN_EMAIL}
        isOpen={showTotpModal}
        onSuccess={handleTotpSuccess}
        onCancel={() => setShowTotpModal(false)}
      />

      {/* Glassmorphic Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-5">
        
        {/* Subtle Ambient Light Corner */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 🚨 LIVE AWAITING 2FA AUTHORIZATION VIEW */}
        {pendingChallenge ? (
          <div className="relative z-10 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="relative mx-auto w-16 h-16 rounded-3xl bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 shadow-xl shadow-orange-500/20">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-[10px] font-black uppercase tracking-wider mb-2">
                <Radio className="w-3 h-3 animate-ping" />
                2FA Security Challenge Active
              </div>
              <h2 className="text-xl font-black text-white">প্রাইমারি অ্যাডমিন অনুমোদনের অপেক্ষায়...</h2>
              <p className="text-xs text-slate-400 mt-1">
                আপনার প্রাইমারি কম্পিউটার স্ক্রিনে অনুমোদনের পপআপ পাঠানো হয়েছে। অনুমোদন দিলে এই ডিভাইস স্বয়ংক্রিয়ভাবে প্রবেশ করবে।
              </p>
            </div>

            {/* Device Info Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-orange-400" />
                  ডিভাইস:
                </span>
                <span className="font-bold text-white">{pendingChallenge.device}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">লোকেশন ও আইপি:</span>
                <span className="font-mono text-orange-400">{pendingChallenge.location} • {pendingChallenge.ipAddress}</span>
              </div>
            </div>

            {/* Status Feedback */}
            {challengeStatus === 'waiting' && (
              <div className="flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>লাইভ স্ট্যাটাস চেক করা হচ্ছে...</span>
              </div>
            )}

            {challengeStatus === 'approved' && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>অনুমোদন সফল! ড্যাশবোর্ডে রিডাইরেক্ট হচ্ছে...</span>
              </div>
            )}

            {challengeStatus === 'denied' && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>লগইন অনুরোধ বাতিল করা হয়েছে।</span>
              </div>
            )}

            {challengeStatus === 'denied_and_blocked' && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2">
                <Ban className="w-5 h-5 text-rose-400" />
                <span>🛑 ক্ষতিকর আইপি শনাক্ত: এক্সেস ব্লক করা হয়েছে।</span>
              </div>
            )}

            {/* 🔑 Master Super Admin Emergency Override Option with Google Authenticator */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => setShowTotpModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600/30 to-amber-600/30 hover:from-orange-600/50 hover:to-amber-600/50 border border-orange-500/50 text-orange-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <KeyRound className="w-4 h-4 text-orange-400" />
                <span>মাস্টার ২-ফ্যাক্টর (2FA) কোড দিয়ে যাচাই করুন</span>
              </button>

              <button
                type="button"
                onClick={handleCancelChallenge}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                অনুরোধ বাতিল করে ফিরে যান
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center relative z-10">
              <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
              <p className="text-xs text-slate-400 mt-1">Sign in to access your ShopNexus account</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Google Login */}
            <div className="relative z-10">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={!!isOAuthLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-white/10 text-white text-xs font-bold transition-all duration-200 hover:border-white/20 active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
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
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-slate-900/90 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                or email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
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
                    placeholder="saad0174742@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* ⚡ 1-Click Quick Admin Demo Access */}
              <div className="pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleAdminQuickLogin}
                  disabled={isLoading}
                  className="w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 hover:from-amber-500/25 hover:via-orange-500/25 hover:to-rose-500/25 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-amber-300">1-Click Super Admin</span>
                      <span className="block text-[10px] text-slate-400 font-normal truncate max-w-[200px]">saad0174742@gmail.com</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                    Instant Login <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-slate-400 pt-1 relative z-10">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-orange-400 hover:text-orange-300 hover:underline">
                Create an account
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthBackground>
  );
}