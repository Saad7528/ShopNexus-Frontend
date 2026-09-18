'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  Smartphone,
  Lock,
} from 'lucide-react';
import { MASTER_ADMIN_EMAIL, verifyMasterTotp } from '@/lib/totp';

interface GoogleAuthenticatorModalProps {
  email?: string;
  isOpen: boolean;
  onSuccess: (token: string) => void;
  onCancel: () => void;
}

export function GoogleAuthenticatorModal({
  email = MASTER_ADMIN_EMAIL,
  isOpen,
  onSuccess,
  onCancel,
}: GoogleAuthenticatorModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/\D/g, '');

    // If pasted full 6 digit code
    if (cleaned.length >= 6) {
      const newDigits = cleaned.slice(0, 6).split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      triggerVerification(newDigits.join(''));
      return;
    }

    const singleDigit = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '') && index === 5) {
      triggerVerification(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const triggerVerification = async (code: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await verifyMasterTotp(code);
      if (isValid) {
        // Master verified successfully
        const masterToken = `master-root-token-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
        onSuccess(masterToken);
      } else {
        setError('ভুল সিকিউরিটি কোড! আপনার ফোনের Google Authenticator অ্যাপের চলতি ৬-সংখ্যার কোডটি দিন।');
      }
    } catch {
      setError('ভেরিফিকেশন প্রক্রিয়ায় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length === 6) {
      triggerVerification(fullCode);
    } else {
      setError('অনুগ্রহ করে ৬ সংখ্যার সম্পূর্ণ কোডটি পূরণ করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-500/25 space-y-6 animate-in zoom-in-95 duration-200 text-center">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
          <ShieldCheck className="w-9 h-9" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center">
            <Lock className="w-3 h-3 text-orange-400" />
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <Smartphone className="w-3 h-3 text-orange-400" />
            2FA Security Verification
          </div>
          <h2 className="text-xl font-black text-white leading-tight">
            Google Authenticator কোড দিন
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            আপনার মোবাইলের <span className="text-orange-400 font-semibold">Google Authenticator</span> অ্যাপ খুলে চলতি ৬-ডিজিটের ওটিপি (OTP) কোডটি প্রবেশ করান।
          </p>
        </div>

        {/* 6 Digit Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-950 border-2 border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 rounded-2xl text-center text-xl sm:text-2xl font-black text-white tracking-wider outline-none transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || digits.some((d) => d === '')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>ভেরিফাই করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-500">
          🔒 শুধুমাত্র অথোরাইজড ডিভাইসের Authenticator কোড দিয়ে প্রবেশাধিকার মিলবে।
        </p>
      </div>
    </div>
  );
}
