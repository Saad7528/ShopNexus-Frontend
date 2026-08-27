'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const processGoogleAuth = async () => {
      try {
        // Check hash for access_token or query for code
        let accessToken: string | null = null;
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get('access_token');
        }

        const code = searchParams.get('code');

        if (!accessToken && !code) {
          throw new Error('No authentication token or authorization code found from Google.');
        }

        let googleProfile: { email: string; name: string; picture: string; sub: string } | null = null;

        if (accessToken) {
          // Fetch Google User Profile directly
          const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!profileRes.ok) {
            throw new Error('Failed to retrieve user profile from Google.');
          }

          googleProfile = await profileRes.json();
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const backendRes = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleProfile?.email || 'google.user@gmail.com',
            name: googleProfile?.name || 'Google Verified User',
            avatar: googleProfile?.picture || '',
            googleId: googleProfile?.sub || 'google-sub-id',
            code,
          }),
        });

        let data: any = {};
        try {
          data = await backendRes.json();
        } catch (_jsonErr) {
          throw new Error(`Server returned unexpected response (${backendRes.status})`);
        }

        if (!backendRes.ok || !data.success) {
          throw new Error(data.message || 'Failed to authenticate with backend.');
        }

        login(data.data.user, data.data.token);
        setStatus('success');

        setTimeout(() => {
          router.push('/products');
        }, 1200);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Google authentication failed.');
      }
    };

    processGoogleAuth();
  }, [router, searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl text-center space-y-4">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Authenticating with Google...</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Verifying security token and syncing ShopNexus profile...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in fade-in-50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Google Sign-In Successful!</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Welcome to ShopNexus. Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in-50">
            <AlertCircle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Authentication Failed</h2>
            <p className="text-xs text-rose-600 dark:text-rose-300">{errorMsg}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-400 text-sm">
          Processing Google callback...
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
