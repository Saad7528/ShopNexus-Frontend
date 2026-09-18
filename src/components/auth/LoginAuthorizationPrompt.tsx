'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Laptop,
  Check,
  X,
  Ban,
  Clock,
  Radio,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ILoginAuthRequest } from '@/app/api/auth/login-requests/route';

interface LoginAuthorizationPromptProps {
  request: ILoginAuthRequest;
  onDecision: (requestId: string, decision: 'approved' | 'denied' | 'denied_and_blocked') => Promise<void> | void;
  onDismiss: () => void;
}

export function LoginAuthorizationPrompt({
  request,
  onDecision,
  onDismiss,
}: LoginAuthorizationPromptProps) {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAction = async (decision: 'approved' | 'denied' | 'denied_and_blocked') => {
    setIsProcessing(decision);
    try {
      await onDecision(request.id, decision);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-orange-500/50 dark:border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-500/20 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Pulsing Security Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider mb-1">
                <Radio className="w-3 h-3 animate-ping" />
                {isBn ? 'রিয়েল-টাইম লগইন অথোরাইজেশন রিকোয়েস্ট' : 'Live Login Authorization Prompt'}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {isBn ? 'নতুন ডিভাইস থেকে লগইন চেষ্টা!' : 'New Login Attempt Detected!'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            {isBn
              ? `আপনার অ্যাকাউন্ট "${request.email}"-এ অন্য একটি কম্পিউটার বা শহর থেকে লগইন করার চেষ্টা করা হচ্ছে। এটি কি আপনি?`
              : `Someone is attempting to log into "${request.email}" from a new location. Is this you?`}
          </span>
        </div>

        {/* Device & Location Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-orange-500" />
              {isBn ? 'ডিভাইস ও অপারেটিং সিস্টেম:' : 'Device & OS:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {request.device} ({request.os})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              {isBn ? 'ভৌগোলিক অবস্থান ও আইপি:' : 'Location & IP:'}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {request.location} • <span className="text-orange-500">{request.ipAddress}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {isBn ? 'অনুরোধের সময়:' : 'Attempt Timestamp:'}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {request.timestamp} ({isBn ? 'এইমাত্র' : 'Just now'})
            </span>
          </div>
        </div>

        {/* 3 Decision Actions */}
        <div className="space-y-2.5 pt-1">
          {/* Action 1: Approve */}
          <button
            type="button"
            disabled={!!isProcessing}
            onClick={() => handleAction('approved')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isProcessing === 'approved' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>
              {isBn
                ? '✅ হ্যাঁ, এটি আমি — লগইন অনুমোদন করুন (Approve)'
                : '✅ Yes, It’s Me — Approve Login'}
            </span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Action 2: Deny */}
            <button
              type="button"
              disabled={!!isProcessing}
              onClick={() => handleAction('denied')}
              className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-rose-500/10 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-500/40 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isProcessing === 'denied' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              <span>{isBn ? 'না, লগইন বাতিল করুন (Deny)' : 'No, Deny Access'}</span>
            </button>

            {/* Action 3: Deny & 1-Click Block IP */}
            <button
              type="button"
              disabled={!!isProcessing}
              onClick={() => handleAction('denied_and_blocked')}
              className="py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01]"
            >
              {isProcessing === 'denied_and_blocked' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              <span>{isBn ? '🛑 বাতিল ও ১-ক্লিকে IP ব্লক' : '🛑 Deny & Block IP'}</span>
            </button>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {isBn
                ? 'ShopNexus আউট-অফ-ব্যান্ড পুশ সিকিউরিটি গার্ড দ্বারা সুরক্ষিত'
                : 'Protected by ShopNexus Out-of-Band Push Security Guard'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
