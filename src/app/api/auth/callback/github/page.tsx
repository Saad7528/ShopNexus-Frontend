'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const processGitHubAuth = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code returned from GitHub.');
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const backendRes = await fetch(`${API_URL}/auth/github`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        let data: any = {};
        try {
          data = await backendRes.json();
        } catch (_jsonErr) {
          throw new Error(`Server returned unexpected response (${backendRes.status})`);
        }

        if (!backendRes.ok || !data.success) {
          throw new Error(data.message || 'GitHub login failed.');
        }

        login(data.data.user, data.data.token);
        setStatus('success');

        setTimeout(() => {
          router.push('/products');
        }, 1200);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'GitHub authentication failed.');
      }
    };

    processGitHubAuth();
  }, [router, searchParams, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center space-y-4 shadow-2xl">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white">Authenticating with GitHub...</h2>
            <p className="text-xs text-slate-400">Exchanging credentials and establishing secure session...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in fade-in-50">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">GitHub Sign-In Successful!</h2>
            <p className="text-xs text-slate-300">Welcome to ShopNexus. Redirecting to marketplace...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in-50">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-rose-300">{errorMsg}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-slate-400 text-sm">
          Processing GitHub callback...
        </div>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
}
