'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Plus, Tag, Coins, ArrowRight, Check } from 'lucide-react';
import { IBundleDeal } from '@/data/bundles';
import { useBundleStore } from '@/store/useBundleStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

export const ComboDealsSection: React.FC = () => {
  const { language } = useLanguageStore();
  const [mounted, setMounted] = React.useState(false);
  const [addedBundleId, setAddedBundleId] = React.useState<string | null>(null);
  const { addItem, openDrawer } = useCartStore();
  const rawBundles = useBundleStore((state) => state.bundles);
  const activeBundles = React.useMemo(() => rawBundles.filter((b) => b.status === 'Active'), [rawBundles]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddBundle = (bundle: IBundleDeal) => {
    bundle.items.forEach((item) => {
      addItem({
        productId: item.id,
        title: item.title,
        price: Math.round(item.regularPrice * (bundle.bundlePrice / bundle.originalTotal)),
        image: item.image,
        quantity: 1,
        stock: 20,
        vendorName: 'ShopNexus Official Store',
      });
    });
    setAddedBundleId(bundle.id);
    openDrawer();
    setTimeout(() => setAddedBundleId(null), 2500);
  };

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mounted && language === 'bn' ? 'এক্সক্লুসিভ বান্ডেল ডিল' : 'Exclusive Combo Bundles'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {mounted && language === 'bn' ? '🔥 হট কম্বো প্যাকেজ অফার' : '🔥 Top Hot Combo Packages'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {mounted && language === 'bn'
                ? 'সেরা গ্যাজেট কম্বিনেশন একসাথে কিনুন, অতিরিক্ত ১৫% পর্যন্ত সাশ্রয় ও প্রতিটি বান্ডেলে বিশেষ লয়্যালটি পয়েন্ট ক্যাশব্যাক উপভোগ করুন!'
                : 'Buy matching hardware suites together to unlock up to 15% instant savings & bonus loyalty points!'}
            </p>
          </div>

          <Link
            href="/products?category=Combo+Packages"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors self-start sm:self-auto group"
          >
            <span>{mounted && language === 'bn' ? 'সকল কম্বো দেখুন' : 'Explore All Combos'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Combo Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBundles.map((bundle) => {
            const isAdded = addedBundleId === bundle.id;
            const cashbackTaka = Math.floor(bundle.rewardPoints / 10);

            return (
              <div
                key={bundle.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:border-orange-500/50"
              >
                {/* Top Badge */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {bundle.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {mounted && language === 'bn'
                        ? `সাশ্রয় ${formatCurrency(bundle.savings, language)}`
                        : `Save ${formatCurrency(bundle.savings, language)}`}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-2.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {bundle.description}
                  </p>
                </div>

                {/* Bundle Item Previews */}
                <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {bundle.items.map((item, idx) => (
                      <React.Fragment key={item.id || idx}>
                        {idx > 0 && <Plus className="w-4 h-4 text-slate-400 shrink-0" />}
                        <div className="flex flex-col items-center text-center space-y-1">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[85px]">
                            {item.title}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Bottom Pricing, Loyalty Points & Buy Button */}
                <div className="p-5 space-y-3">
                  {/* Pricing */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {mounted && language === 'bn' ? 'কম্বো মূল্য' : 'Combo Price'}:
                      </span>
                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          {mounted ? formatCurrency(bundle.bundlePrice, language) : `৳${bundle.bundlePrice.toLocaleString()}`}
                        </span>
                        <span className="text-xs line-through text-slate-400 dark:text-slate-500">
                          {mounted ? formatCurrency(bundle.originalTotal, language) : `৳${bundle.originalTotal.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🪙 Loyalty Points Reward Badge */}
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {mounted && language === 'bn'
                        ? `বোনাস: ${toBengaliNumber(bundle.rewardPoints)} লয়্যালটি পয়েন্ট (৳${toBengaliNumber(cashbackTaka)} ক্যাশব্যাক)`
                        : `Bonus: ${bundle.rewardPoints} Points (৳${cashbackTaka} Cashback)`}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handleAddBundle(bundle)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white shadow-orange-500/25 hover:scale-[1.01]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{mounted && language === 'bn' ? 'কম্বো যোগ হয়েছে!' : 'Combo Added!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {mounted && language === 'bn'
                            ? `কম্বো কার্টে যোগ করুন (${toBengaliNumber(bundle.items.length)} আইটেম)`
                            : `Add Combo to Cart (${bundle.items.length} Items)`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
