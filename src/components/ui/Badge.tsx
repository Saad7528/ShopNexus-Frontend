import React from 'react';
import { cn } from './Button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple'
    | 'amber'
    | 'outline'
    | 'sale';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full shrink-0';

    const variants = {
      default: 'bg-slate-800 text-slate-300 border border-slate-700/80',
      success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
      info: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
      purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
      amber: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
      outline: 'bg-transparent text-slate-300 border border-slate-700',
      sale: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow-sm shadow-orange-500/20',
    };

    const dotColors = {
      default: 'bg-slate-400',
      success: 'bg-emerald-400',
      warning: 'bg-amber-400',
      danger: 'bg-rose-400',
      info: 'bg-sky-400',
      purple: 'bg-purple-400',
      amber: 'bg-orange-400',
      outline: 'bg-slate-400',
      sale: 'bg-white',
    };

    const sizes = {
      sm: 'text-[10px] px-2 py-0.5 gap-1',
      md: 'text-xs px-2.5 py-1 gap-1.5',
      lg: 'text-sm px-3 py-1.5 gap-2',
    };

    return (
      <span ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
