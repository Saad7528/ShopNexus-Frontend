'use client';

import React from 'react';
import { CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

export type PaymentMethod = 'stripe_card' | 'mfs_bkash_nagad' | 'cash_on_delivery';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const methods = [
    {
      id: 'stripe_card' as PaymentMethod,
      title: 'Credit / Debit Card (Stripe)',
      desc: 'Visa, Mastercard, American Express with 256-bit SSL encryption',
      icon: CreditCard,
      badge: 'Instant',
    },
    {
      id: 'mfs_bkash_nagad' as PaymentMethod,
      title: 'Mobile Financial Services (MFS)',
      desc: 'Direct payment via bKash, Nagad, or Rocket mobile wallet',
      icon: Smartphone,
      badge: 'Zero Fee',
    },
    {
      id: 'cash_on_delivery' as PaymentMethod,
      title: 'Cash on Delivery (COD)',
      desc: 'Pay in cash upon doorstep package inspection and receipt',
      icon: Banknote,
      badge: 'Verified',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-4 ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.title}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-600'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>All transactions are encrypted with enterprise-grade SSL security.</span>
      </div>
    </div>
  );
};
