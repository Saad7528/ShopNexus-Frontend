'use client';

import React from 'react';
import { Camera, Sparkles, Bot, Zap, Truck } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useHydrated } from '@/lib/useHydrated';
import { toBengaliNumber } from '@/lib/translations';

interface AiSuperpowerItem {
  icon: React.ElementType;
  tagEn: string;
  tagBn: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

const AI_SUPERPOWERS: AiSuperpowerItem[] = [
  {
    icon: Camera,
    tagEn: 'Computer Vision',
    tagBn: 'কম্পিউটার ভিশন',
    titleEn: 'Instant Visual Search',
    titleBn: 'তাত্ক্ষণিক ভিজ্যুয়াল সার্চ',
    descEn: 'Drop any snapshot or camera image to locate visually similar hardware in milliseconds.',
    descBn: 'যেকোনো স্ন্যাপশট বা পণ্যের ছবি দিয়ে কয়েক মিলি সেকেন্ডে পছন্দের গ্যাজেট খুঁজে নিন।',
  },
  {
    icon: Sparkles,
    tagEn: 'Real-Time Vector',
    tagBn: 'রিয়েল-টাইম ভেক্টর',
    titleEn: 'Personalized Recommendations',
    titleBn: 'ব্যক্তিগতকৃত রিকমেন্ডেশন',
    descEn: 'Dynamic neural scoring matches catalog items directly to your browsing taste and active cart.',
    descBn: 'ডায়নামিক নিউরাল স্কোরিং আপনার ব্রাউজিং পছন্দ ও কার্টের ওপর ভিত্তি করে সেরা পণ্য প্রস্তাব করে।',
  },
  {
    icon: Bot,
    tagEn: 'Gemini + Groq',
    tagBn: 'জেমিনি + গ্রক',
    titleEn: '24/7 AI Shopping Assistant',
    titleBn: '২৪/৭ এআই শপিং অ্যাসিস্ট্যান্ট',
    descEn: 'Ask questions, filter by budget, or request product comparisons with our multi-model AI.',
    descBn: 'যেকোনো বাজেট, পণ্যের তুলনা বা কেনাকাটায় সরাসরি ২৪/৭ মাল্টি-মডেল এআই-এর সহায়তা নিন।',
  },
  {
    icon: Zap,
    tagEn: 'Algorithmic Pricing',
    tagBn: 'অ্যালগরিদমিক প্রাইসিং',
    titleEn: 'Dynamic Demand Pricing',
    titleBn: 'ডায়নামিক ডিমান্ড প্রাইসিং',
    descEn: 'Real-time algorithm evaluates catalog inventory thresholds and schedules flash deal savings.',
    descBn: 'রিয়েল-টাইম চাহিদা ও ইনভেন্টরির ওপর ভিত্তি করে স্বয়ংক্রিয় ফ্ল্যাশ ডিল এবং সেরা সাশ্রয়ী মূল্য।',
  },
  {
    icon: Truck,
    tagEn: 'Live Telemetry',
    tagBn: 'লাইভ টেলিমেট্রি',
    titleEn: 'Automated Courier Tracking',
    titleBn: 'অটোমেটেড কুরিয়ার ট্র্যাকিং',
    descEn: 'Deep integration with courier logistics provides instant milestone SMS updates on dispatch.',
    descBn: 'কুরিয়ার লজিস্টিকসের সরাসরি সংযোগে অর্ডার ডিসপ্যাচ ও লাইভ মাইলস্টোন ট্র্যাকিং আপডেট।',
  },
];

export function AiSuperpowersSection() {
  const { language } = useLanguageStore();
  const mounted = useHydrated();
  const isBn = mounted && language === 'bn';

  return (
    <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8">
      <div className="p-4 sm:p-8 rounded-3xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-8">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            {isBn ? 'স্বয়ংক্রিয় কৃত্রিম বুদ্ধিমত্তা' : 'Autonomous Intelligence'}
          </span>
          <h2 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {isBn ? 'শপনেক্সাসের ৫টি এআই সুপারপাওয়ার' : '5 AI Superpowers of ShopNexus'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {isBn
              ? 'আপনার কেনাকাটার অনন্য অভিজ্ঞতায় সংযুক্ত আধুনিক মেশিন লার্নিং ও জেনারেটিভ ভিশন।'
              : 'Next-generation machine learning and generative vision embedded into your shopping experience.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {AI_SUPERPOWERS.map((ai, i) => {
            const Icon = ai.icon;
            const featureIndex = isBn ? `ফিচার ${toBengaliNumber(`0${i + 1}`)}` : `Feature 0${i + 1}`;
            return (
              <div
                key={ai.titleEn}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mb-0.5">
                    {isBn ? ai.tagBn : ai.tagEn}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    {isBn ? ai.titleBn : ai.titleEn}
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isBn ? ai.descBn : ai.descEn}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                  {featureIndex}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
