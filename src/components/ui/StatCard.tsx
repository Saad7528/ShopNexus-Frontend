import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from './Button';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number | string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  changeLabel?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  changeLabel = 'vs last period',
  icon,
  iconColor = 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  className,
  loading = false,
}: StatCardProps) {
  return (
    <Card className={cn('p-5 sm:p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="h-8 w-28 bg-slate-800 animate-pulse rounded-lg mt-2" />
          ) : (
            <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1 tracking-tight">
              {value}
            </h4>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl border shrink-0', iconColor)}>
            {icon}
          </div>
        )}
      </div>

      {change !== undefined && !loading && (
        <div className="flex items-center gap-1.5 mt-3.5 text-xs">
          {changeType === 'increase' ? (
            <span className="flex items-center font-semibold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          ) : changeType === 'decrease' ? (
            <span className="flex items-center font-semibold text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          ) : (
            <span className="flex items-center font-medium text-slate-400">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
          )}
          <span className="text-slate-500">{changeLabel}</span>
        </div>
      )}
    </Card>
  );
}
