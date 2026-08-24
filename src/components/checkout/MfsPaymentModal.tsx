'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X, Lock, ArrowRight, Smartphone, AlertCircle } from 'lucide-react';

interface MfsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trxId: string) => void;
  amount: number;
  provider: 'bkash' | 'nagad' | 'rocket';
  customerPhone?: string;
}

export const MfsPaymentModal: React.FC<MfsPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  provider,
  customerPhone = '01712345678',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Number, 2: OTP, 3: PIN
  const [phone, setPhone] = useState(customerPhone);
  const [otp, setOtp] = useState('1234');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isBkash = provider === 'bkash';
  const brandName = isBkash ? 'bKash' : provider === 'nagad' ? 'Nagad' : 'Rocket';
  const brandColor = isBkash
    ? 'from-[#e2136e] to-[#b80b57]'
    : provider === 'nagad'
    ? 'from-[#f7941d] to-[#d67008]'
    : 'from-[#8c2d8c] to-[#601960]';

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!phone || phone.length < 11) {
        setError('Please enter a valid 11-digit mobile wallet number.');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(2);
      }, 700);
    } else if (step === 2) {
      if (otp !== '1234') {
        setError('Invalid OTP code. Try entering 1234 for simulation.');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 700);
    } else if (step === 3) {
      if (!pin || pin.length < 4) {
        setError('Please enter your 4 or 5 digit wallet PIN.');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const generatedTrxId = `TRX-${provider.toUpperCase().slice(0, 2)}-${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        onSuccess(generatedTrxId);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl text-slate-900 animate-scaleUp">
        {/* Gateway Brand Header */}
        <div className={`p-6 bg-gradient-to-r ${brandColor} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl shadow-md">
              {brandName[0]}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{brandName} Payment Gateway</h3>
              <p className="text-[11px] text-white/80 font-medium">Merchant: ShopNexus Official Store</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Badge */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Payable Amount:</span>
          <span className="text-base font-black text-slate-900 font-mono">
            ৳{amount.toLocaleString()} BDT
          </span>
        </div>

        {/* Step Form */}
        <form onSubmit={handleNextStep} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your {brandName} Account Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By clicking proceed, a 4-digit verification code (OTP) will be simulated for this number.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enter 4-Digit OTP
                  </label>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">Hint: 1234</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1 2 3 4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-[0.5em] text-lg font-black font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                OTP sent to <span className="font-mono font-semibold">{phone}</span> (Enter <strong className="text-slate-800">1234</strong>)
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enter {brandName} 4-Digit PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    maxLength={5}
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-[0.4em] text-lg font-black font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Encrypted secure checkout
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${brandColor} text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50`}
            >
              {isProcessing ? (
                <span>Verifying & Transferring...</span>
              ) : step === 1 ? (
                <>
                  <span>Send Verification Code</span> <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : step === 2 ? (
                <>
                  <span>Confirm OTP Code</span> <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment ৳{amount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Security */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Official Bangladesh Bank Certified Payment Gateway Sandbox
        </div>
      </div>
    </div>
  );
};
