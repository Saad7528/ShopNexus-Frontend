'use client';

import React from 'react';
import { Clock, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = {
    pending: {
      label: 'Pending',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    processing: {
      label: 'Processing',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: RefreshCw,
    },
    shipped: {
      label: 'Shipped',
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: Truck,
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle,
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
  }[status] || {
    label: status,
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
