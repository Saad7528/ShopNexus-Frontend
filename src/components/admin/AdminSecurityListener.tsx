'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoginAuthorizationPrompt, SessionDurationType } from '@/components/auth/LoginAuthorizationPrompt';
import { ILoginAuthRequest } from '@/app/api/auth/login-requests/route';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CheckCircle2, Clock, AlertTriangle, LogOut, Ban } from 'lucide-react';

export function AdminSecurityListener() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const [activeRequest, setActiveRequest] = useState<ILoginAuthRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Secondary Session Expiration Timer & State
  const [isTemporarySession, setIsTemporarySession] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isSessionRevoked, setIsSessionRevoked] = useState(false);
  const isLoggingOutRef = useRef(false);

  // 1. Determine Device Type (Primary Master vs Secondary/Temporary 2FA Session)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const expiresAtStr = localStorage.getItem('shopnexus_session_expires_at');
    const sessionId = localStorage.getItem('shopnexus_session_id');

    // If this session was created via 2FA (has session_id or temporary expiration), it is a SECONDARY device
    if (sessionId || (expiresAtStr && expiresAtStr !== 'until_revoked')) {
      setIsTemporarySession(true);
      localStorage.removeItem('shopnexus_primary_master');
    } else if (user?.role === 'admin' && !sessionId) {
      // Primary authenticated Master Admin device
      setIsTemporarySession(false);
      localStorage.setItem('shopnexus_primary_master', 'authorized_master_root');
    } else {
      // Unauthenticated / Incognito / Untrusted device
      setIsTemporarySession(true);
      localStorage.removeItem('shopnexus_primary_master');
    }
  }, [user]);

  // 2. Secondary Device: Live Expiration Countdown & Auto-Logout Watcher
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const expiresAtStr = localStorage.getItem('shopnexus_session_expires_at');
      if (expiresAtStr && expiresAtStr !== 'until_revoked') {
        const checkExpiration = () => {
          if (isLoggingOutRef.current) return;
          const currentExpStr = localStorage.getItem('shopnexus_session_expires_at');
          if (!currentExpStr || currentExpStr === 'until_revoked') return;

          const expiresAt = Number(currentExpStr);
          const diffMs = expiresAt - Date.now();
          const secs = Math.max(0, Math.floor(diffMs / 1000));

          setRemainingSeconds(secs);

          if (secs <= 0 && !isLoggingOutRef.current) {
            isLoggingOutRef.current = true;
            setIsSessionExpired(true);

            localStorage.removeItem('shopnexus_session_id');
            localStorage.removeItem('shopnexus_session_expires_at');
            localStorage.removeItem('shopnexus_session_duration');

            setTimeout(() => {
              logout();
              router.push('/login');
            }, 3000);
          }
        };

        checkExpiration();
        const interval = setInterval(checkExpiration, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [logout, router]);

  // 3. Secondary Device: Active Revocation / Termination Poller (Checks if Primary Admin revoked session)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionId = localStorage.getItem('shopnexus_session_id');
    if (!sessionId) return;

    const checkRevocation = async () => {
      if (isLoggingOutRef.current) return;
      try {
        const res = await fetch(`/api/auth/login-requests?requestId=${sessionId}`).catch(() => null);
        if (!res) return;

        if (res.status === 404) {
          // Session deleted or revoked
          isLoggingOutRef.current = true;
          setIsSessionRevoked(true);
          localStorage.removeItem('shopnexus_session_id');
          localStorage.removeItem('shopnexus_session_expires_at');
          localStorage.removeItem('shopnexus_session_duration');
          setTimeout(() => {
            logout();
            router.push('/login');
          }, 3000);
          return;
        }

        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json?.data) {
            const status = json.data.status;
            if (status === 'denied' || status === 'denied_and_blocked') {
              isLoggingOutRef.current = true;
              setIsSessionRevoked(true);
              localStorage.removeItem('shopnexus_session_id');
              localStorage.removeItem('shopnexus_session_expires_at');
              localStorage.removeItem('shopnexus_session_duration');
              setTimeout(() => {
                logout();
                router.push('/login');
              }, 3000);
            }
          }
        }
      } catch {
        // ignore network error
      }
    };

    const interval = setInterval(checkRevocation, 1500);
    return () => clearInterval(interval);
  }, [logout, router]);

  // 4. Primary Device: Poll for incoming pending login requests (Runs across ALL pages)
  const checkPendingRequests = useCallback(async () => {
    if (!user || user.role !== 'admin' || isTemporarySession) return;

    try {
      const res = await fetch('/api/auth/login-requests?status=pending');
      if (!res.ok) return;

      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const latestPending = result.data[0];
        setActiveRequest((prev) => {
          if (!prev || prev.id !== latestPending.id) {
            return latestPending;
          }
          return prev;
        });
      } else {
        setActiveRequest(null);
      }
    } catch {
      // Ignore network errors in background poll
    }
  }, [user, isTemporarySession]);

  useEffect(() => {
    if (!user || user.role !== 'admin' || isTemporarySession) return;

    checkPendingRequests();
    const interval = setInterval(checkPendingRequests, 2000);
    return () => clearInterval(interval);
  }, [user, isTemporarySession, checkPendingRequests]);

  // 5. Handle Decision Action by Primary Admin
  const handleDecision = async (
    requestId: string,
    decision: 'approved' | 'denied' | 'denied_and_blocked',
    duration?: SessionDurationType,
    customMinutes?: number
  ) => {
    try {
      const res = await fetch('/api/auth/login-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          requestId,
          decision,
          duration: duration || '1h',
          customMinutes: customMinutes || 45,
        }),
      });

      await res.json().catch(() => null);
      setActiveRequest(null);

      if (decision === 'approved') {
        const durationText =
          duration === 'until_revoked'
            ? isBn ? 'স্থায়ীভাবে (ব্লক না করা পর্যন্ত)' : 'Until Revoked'
            : duration === 'custom'
            ? `${customMinutes} ${isBn ? 'মিনিট' : 'mins'}`
            : duration === '20m'
            ? isBn ? '২০ মিনিট' : '20 Mins'
            : duration === '30m'
            ? isBn ? '৩০ মিনিট' : '30 Mins'
            : isBn ? '১ ঘণ্টা' : '1 Hour';

        setToastMessage(
          isBn
            ? `✅ রিমোট ডিভাইসে লগইন অনুমোদন সফল হয়েছে! মেয়াদ: ${durationText}`
            : `✅ Remote login approved! Duration: ${durationText}`
        );
      } else if (decision === 'denied_and_blocked') {
        setToastMessage(
          isBn
            ? '🛑 লগইন বাতিল করা হয়েছে এবং ক্ষতিকর আইপি ব্লকলিস্টে যোগ করা হয়েছে।'
            : '🛑 Login denied and IP permanently blacklisted in Fraud Shield.'
        );
      } else {
        setToastMessage(
          isBn ? '❌ দূরবর্তী ডিভাইসের লগইন বাতিল করা হয়েছে।' : '❌ Remote login attempt denied.'
        );
      }

      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.error('Failed to respond to login request:', err);
    }
  };

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      {/* ⏱️ Floating Temporary Session Countdown Banner on Secondary Devices */}
      {isTemporarySession && remainingSeconds !== null && !isSessionExpired && !isSessionRevoked && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[110] px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-950/95 border border-orange-500/40 text-white shadow-xl backdrop-blur-md flex items-center gap-2 text-xs animate-in slide-in-from-top-4">
          <Clock className={`w-3.5 h-3.5 ${remainingSeconds < 60 ? 'text-rose-400 animate-ping' : 'text-orange-400 animate-pulse'}`} />
          <span className="font-semibold text-slate-300">
            {isBn ? 'সাময়িক ২এফএ সেশন:' : 'Temporary 2FA Session:'}
          </span>
          <span className={`font-mono font-black ${remainingSeconds < 60 ? 'text-rose-400' : 'text-amber-300'}`}>
            {formatSeconds(remainingSeconds)}
          </span>
          <span className="text-[10px] text-slate-400">
            {isBn ? 'বাকি' : 'left'}
          </span>
        </div>
      )}

      {/* 🔴 Modal when Session is Terminated / Revoked Remotely by Primary Admin */}
      {isSessionRevoked && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-rose-500 text-center space-y-4 shadow-2xl shadow-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Ban className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-white">
              {isBn ? 'সেশন বন্ধ করা হয়েছে!' : 'Session Revoked by Admin!'}
            </h2>
            <p className="text-xs text-slate-300">
              {isBn
                ? 'প্রাইমারি অ্যাডমিন কর্তৃক আপনার এই ডিভাইসের এক্সেস তাৎক্ষণিকভাবে টার্মিনেট / বাতিল করা হয়েছে।'
                : 'Your session on this device has been revoked remotely by the Primary Admin.'}
            </p>
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold pt-2">
              <LogOut className="w-4 h-4 animate-spin" />
              <span>{isBn ? 'লগইন পেজে রিডাইরেক্ট হচ্ছে...' : 'Redirecting to login...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Modal when Temporary Session Expires */}
      {isSessionExpired && !isSessionRevoked && (
        <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-rose-500 text-center space-y-4 shadow-2xl shadow-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-lg font-black text-white">
              {isBn ? 'সেশনের মেয়াদ সমাপ্ত হয়েছে!' : 'Session Expired!'}
            </h2>
            <p className="text-xs text-slate-300">
              {isBn
                ? 'প্রাইমারি অ্যাডমিন কর্তৃক নির্ধারিত সময় পার হওয়ায় নিরাপত্তার স্বার্থে আপনাকে লগআউট করা হচ্ছে।'
                : 'Your authorized session duration has elapsed. Logging out for platform security.'}
            </p>
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold pt-2">
              <LogOut className="w-4 h-4 animate-spin" />
              <span>{isBn ? 'লগইন পেজে রিডাইরেক্ট হচ্ছে...' : 'Redirecting to login...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert for Primary Admin */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-md p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white shadow-2xl animate-in slide-in-from-bottom-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Global 2FA Authorization Pop-up Modal on Primary Admin Device */}
      {activeRequest && (
        <LoginAuthorizationPrompt
          request={activeRequest}
          onDecision={handleDecision}
          onDismiss={() => setActiveRequest(null)}
        />
      )}
    </>
  );
}
