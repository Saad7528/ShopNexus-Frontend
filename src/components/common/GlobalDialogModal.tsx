'use client';

import React, { useEffect } from 'react';
import { useDialogStore, DialogType } from '@/store/useDialogStore';
import { 
  AlertTriangle, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  Info,
  ShieldAlert
} from 'lucide-react';

export const GlobalDialogModal: React.FC = () => {
  const { isOpen, options, confirm, cancel } = useDialogStore();

  // Handle ESC and Enter key events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        confirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirm, cancel]);

  if (!isOpen) return null;

  const getIconAndStyle = (type: DialogType = 'warning') => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-500 animate-pulse" />,
          badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-rose-500/10',
          confirmBtn: 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25 border-rose-500/30',
          glowBg: 'bg-rose-500/5',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
          badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10',
          confirmBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-emerald-500/30',
          glowBg: 'bg-emerald-500/5',
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-sky-500" />,
          badgeBg: 'bg-sky-500/10 dark:bg-sky-500/20 border-sky-500/30 text-sky-600 dark:text-sky-400 shadow-sky-500/10',
          confirmBtn: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 border-sky-500/30',
          glowBg: 'bg-sky-500/5',
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-amber-500/10',
          confirmBtn: 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#ff5500] hover:to-[#ff8800] text-white shadow-lg shadow-orange-500/25 border-orange-500/30',
          glowBg: 'bg-orange-500/5',
        };
    }
  };

  const style = getIconAndStyle(options.type);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          cancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-950/40 transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Subtle decorative radial glow */}
        <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${style.glowBg}`} />

        {/* Close X Button */}
        <button
          type="button"
          onClick={cancel}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close dialog (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header & Content */}
        <div className="flex items-start gap-4 pr-6">
          <div className={`shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${style.badgeBg}`}>
            {style.icon}
          </div>
          <div className="space-y-1.5 pt-0.5">
            <h3 id="dialog-title" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {options.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {options.message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-7 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {!options.isAlertOnly && (
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              {options.cancelText || 'Cancel'}
            </button>
          )}
          <button
            type="button"
            onClick={confirm}
            autoFocus
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${style.confirmBtn}`}
          >
            {options.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
