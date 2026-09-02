'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Globe } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, toggleLanguage } = useLanguageStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={twMerge(
          'p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold',
          className
        )}
      >
        EN
      </div>
    );
  }

  // Next language to switch to  
  const targetLabel = language === 'bn' ? 'EN' : 'বাং';
  const tooltip = language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center justify-center gap-1.5 p-2 sm:p-2.5 min-w-9 h-9 sm:h-9.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 text-slate-800 dark:text-slate-200 text-xs font-black transition-all cursor-pointer shadow-xs select-none ${className}`}
      title={tooltip}
    >
      {showIcon && (
        <Globe className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 shrink-0" />
      )}
      <span className="leading-none">{targetLabel}</span>
    </button>
  );
};

