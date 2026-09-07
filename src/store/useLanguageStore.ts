'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, TRANSLATIONS, TranslationKey } from '@/lib/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'bn', // Default to Bengali as requested
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () => {
        const nextLang: Language = get().language === 'en' ? 'bn' : 'en';
        set({ language: nextLang });
      },
      t: (key: TranslationKey, fallback?: string) => {
        const lang = get().language;
        const translation = TRANSLATIONS[lang]?.[key];
        if (translation) return translation;
        return fallback || TRANSLATIONS.en[key] || String(key);
      },
    }),
    {
      name: 'shopnexus-language-preference',
    }
  )
);
