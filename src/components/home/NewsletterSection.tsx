'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';
import { TRANSLATIONS, TranslationKey, Language } from '@/lib/translations';

export function NewsletterSection() {
  const { language } = useLanguageStore();
  const mounted = useHydrated();
  const currentLang: Language = mounted ? language : 'bn';

  const t = (key: TranslationKey, fallback?: string) => {
    return TRANSLATIONS[currentLang]?.[key] || fallback || TRANSLATIONS.bn[key] || TRANSLATIONS.en[key] || String(key);
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [couponUnlocked, setCouponUnlocked] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setCouponUnlocked(true);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-rose-600 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4 border border-white/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Drop Alerts & Flash Codes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" suppressHydrationWarning>
            {t('newsletter_title')}
          </h2>
          <p className="text-sm sm:text-base text-white/85 mb-6" suppressHydrationWarning>
            {t('newsletter_desc')}
          </p>

          {couponUnlocked ? (
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
              <div>
                <p className="font-bold text-sm">Coupon Code Unlocked: <span className="font-mono bg-white text-orange-600 px-2 py-0.5 rounded font-black">NEXUS10</span></p>
                <p className="text-xs text-white/80 mt-0.5">Use at checkout for an instant 10% discount on your order!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl font-medium placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <Button
                type="submit"
                variant="dark"
                size="lg"
                rightIcon={<Send className="w-4 h-4" />}
                className="whitespace-nowrap rounded-xl shadow-lg"
              >
                <span suppressHydrationWarning>{t('btn_subscribe')}</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
