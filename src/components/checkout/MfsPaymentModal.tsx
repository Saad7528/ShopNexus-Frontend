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

