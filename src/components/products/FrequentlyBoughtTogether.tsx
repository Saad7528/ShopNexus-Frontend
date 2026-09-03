'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Sparkles, Tag, Coins } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

interface BundleProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
}

interface FrequentlyBoughtTogetherProps {
  mainProduct: BundleProduct;
  complementaryProducts: BundleProduct[];
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  complementaryProducts,
}) => {
  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([
    mainProduct._id,
    ...complementaryProducts.map((p) => p._id),
  ]);

  const { addItem, openDrawer } = useCartStore();

  const allItems = [mainProduct, ...complementaryProducts];
  const activeItems = allItems.filter((item) => selectedIds.includes(item._id));

  const rawTotal = activeItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );

  // 5% extra bundle discount when 2 or more items are selected (প্রতি ১০০ টাকায় ৫ টাকা ছাড়)
  const isMultiSelected = activeItems.length >= 2;
  const bundleDiscount = isMultiSelected ? Math.round(rawTotal * 0.05) : 0;
  const finalPrice = rawTotal - bundleDiscount;

  // 🪙 Loyalty Points: 10 Points per ৳100 purchase. 10 Points = ৳1 Cashback
  const earnedLoyaltyPoints = Math.floor(finalPrice / 100) * 10;
  const cashbackValue = Math.floor(earnedLoyaltyPoints / 10);

  const toggleItem = (id: string) => {
    if (id === mainProduct._id) return; // Main product cannot be unselected
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddBundleToCart = () => {
    activeItems.forEach((item) => {
      addItem({
        productId: item._id,
        title: item.title,
        price: item.discountPrice || item.price,
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        quantity: 1,
        stock: 20,
        vendorName: 'ShopNexus Official Store',
      });
    });
    openDrawer();
  };

  if (complementaryProducts.length === 0) return null;

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {mounted && language === 'bn' ? 'ফ্রিকোয়েন্টলি বট টুগেদার (স্মার্ট কম্বো অফার)' : 'Frequently Bought Together (Smart Bundle)'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {mounted && language === 'bn' ? 'একসাথে কিনুন এবং অতিরিক্ত ৫% কম্বো ডিসকাউন্ট ও লয়্যালটি পয়েন্ট উপভোগ করুন' : 'Buy matching hardware together & unlock extra 5% bundle discount'}
            </p>
          </div>
        </div>

        {isMultiSelected && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
              <Tag className="w-3.5 h-3.5" /> {mounted && language === 'bn' ? '৫% কম্বো ডিসকাউন্ট (প্রতি ৳১০০-তে ৳৫ ছাড়)' : '5% Extra Bundle Discount (৳5 per ৳100)'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 justify-between">
        {/* Visual Item Thumbnails & Selection */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 w-full lg:w-auto">
          {allItems.map((item, idx) => {
            const isSelected = selectedIds.includes(item._id);
            const isMain = item._id === mainProduct._id;
            return (
              <React.Fragment key={item._id}>
                {idx > 0 && <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <div
                  onClick={() => toggleItem(item._id)}
                  className={`relative p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 shadow-xs select-none ${
                    isSelected
                      ? 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60'
                  }`}
                  title={isMain ? 'Main item' : 'Click to toggle item'}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Image
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="mt-1.5 text-center">
                    <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[80px] sm:max-w-[90px]">
                      {item.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {mounted ? formatCurrency(item.discountPrice || item.price, language) : `৳${(item.discountPrice || item.price).toLocaleString()}`}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {isMain && (
                    <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-slate-900/80 text-white text-[8px] font-bold rounded">
                      {mounted && language === 'bn' ? 'মূল পণ্য' : 'Main'}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Pricing Summary, Loyalty Points Badge & Action */}
        <div className="w-full lg:w-80 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3.5 flex-shrink-0 shadow-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {mounted && language === 'bn' ? 'মোট কম্বো মূল্য (৳ BDT):' : 'Total Bundle Price (৳ BDT):'}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5 font-mono">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {mounted ? formatCurrency(finalPrice, language) : `৳${finalPrice.toLocaleString()}`}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-normal">
                  {mounted ? formatCurrency(rawTotal, language) : `৳${rawTotal.toLocaleString()}`}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {mounted && language === 'bn'
                  ? `কম্বোতে আপনার সাশ্রয় ${formatCurrency(bundleDiscount, language)}!`
                  : `You save ${formatCurrency(bundleDiscount, language)} with this bundle!`}
              </p>
            )}
          </div>

          {/* 🪙 Loyalty Points Reward Notice */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {mounted && language === 'bn'
                ? `এই কম্বো কিনলে ${toBengaliNumber(earnedLoyaltyPoints)} লয়্যালটি পয়েন্ট (৳${toBengaliNumber(cashbackValue)} ক্যাশব্যাক) পাবেন!`
                : `Earn ${earnedLoyaltyPoints} Loyalty Points (৳${cashbackValue} Cashback) on this bundle!`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            disabled={activeItems.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95 hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4" />
            {mounted && language === 'bn'
              ? `কম্বো কার্টে যোগ করুন (${toBengaliNumber(selectedIds.length)} টি আইটেম)`
              : `Add Bundle (${selectedIds.length} Items)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
