'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { MASTER_TOTP_SECRET, MASTER_ADMIN_EMAIL, verifyMasterTotp, getTotpAuthUri, EMERGENCY_MASTER_CODE } from '@/lib/totp';

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
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const totpUri = getTotpAuthUri(email, MASTER_TOTP_SECRET);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=svg&data=${encodeURIComponent(totpUri)}`;

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
        setError('ভুল অথেন্টিকেটর কোড! আপনার ফোনের Google Authenticator অ্যাপের লাইভ ৬-সংখ্যার কোডটি দিন।');
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

  const handleCopySecret = () => {
    navigator.clipboard.writeText(MASTER_TOTP_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-500/25 space-y-5 animate-in zoom-in-95 duration-200 text-center">
        
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
            <Key className="w-3 h-3 text-orange-400" />
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-orange-400" />
            Super Admin Master Verification
          </div>
          <h2 className="text-xl font-black text-white leading-tight">
            Google Authenticator 2FA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-orange-400 font-semibold">{email}</span> অ্যাকাউন্টে প্রাইমারি মাস্টার এক্সেস পেতে আপনার ফোনের ৬-সংখ্যার TOTP কোডটি দিন।
          </p>
        </div>

        {/* QR Code Setup Accordion */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-left space-y-2">
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-orange-400">
              <QrCode className="w-4 h-4" />
              {showQr ? 'কিউআর কোড স্ক্যানার লুকান' : '📱 প্রথমবার স্ক্যান করতে QR কোড দেখুন'}
            </span>
            <span className="text-[11px] text-slate-500">{showQr ? 'সংকোচন' : 'প্রদর্শন'}</span>
          </button>

          {showQr && (
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
              <div className="w-28 h-28 bg-white p-1.5 rounded-xl shrink-0 shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="ShopNexus Google Authenticator QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <p>
                  ১. ফোনে <strong>Google Authenticator</strong> অ্যাপ খুলুন।
                </p>
                <p>
                  ২. <strong>+</strong> বাটনে চাপ দিয়ে এই QR কোডটি স্ক্যান করুন।
                </p>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700 truncate max-w-[140px]">
                    {MASTER_TOTP_SECRET}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                    title="Copy Secret Key"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6 Digit Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <span>ভেরিফাই করে প্রাইমারি মাস্টার আনলক করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Emergency Note */}
        <p className="text-[10px] text-slate-500 pt-1">
          জরুরি প্রয়োজনে ইমার্জেন্সি মাস্টার ব্যাকআপ পিন: <span className="font-mono text-slate-400 font-bold">{EMERGENCY_MASTER_CODE}</span>
        </p>
      </div>
    </div>
  );
}
