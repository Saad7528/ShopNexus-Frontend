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

