import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-200">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
