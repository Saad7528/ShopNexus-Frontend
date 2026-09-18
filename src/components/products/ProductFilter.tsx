'use client';

import React from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getLocalizedCategory } from '@/lib/localizedProducts';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import { useHydrated } from '@/lib/useHydrated';
import { Filter, RotateCcw, Search, X, Play, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Combo Packages',
  'Audio',
  'Wearables',
  'Peripherals',
  'Smart Home',
  'Creator Gear',
  'Gaming',
  'Accessories',
  'Apparel',
];

const BRANDS = [
  'All',
  'Sony',
  'Apple',
  'Bose',
  'Keychron',
  'Logitech',
  'Sennheiser',
  'Razer',
  'Garmin',
  'Shure',
  'Anker',
];

interface ProductFilterProps {
  onClose?: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ onClose }) => {
  const { t, language } = useLanguageStore();
  const mounted = useHydrated();

  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    isFlashSale,
    setSearch,
    setCategory,
    setBrand,
    setPriceRange,
    setMinRating,
    setSortBy,
    setIsFlashSale,
    resetFilters,
  } = useProductStore();

  const [localMin, setLocalMin] = React.useState<string>(minPrice > 0 ? String(minPrice) : '');
  const [localMax, setLocalMax] = React.useState<string>(maxPrice < 150000 ? String(maxPrice) : '');

  // Keep local inputs in sync with store changes (preset buttons, reset, slider, etc.)
  React.useEffect(() => {
    setLocalMin(minPrice > 0 ? String(minPrice) : '');
  }, [minPrice]);

  React.useEffect(() => {
    setLocalMax(maxPrice < 150000 ? String(maxPrice) : '');
  }, [maxPrice]);

  const handleApplyCustomPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedMinNum = localMin.trim() === '' ? 0 : parseInt(localMin.replace(/[^0-9]/g, ''), 10);
    const parsedMaxNum = localMax.trim() === '' ? 150000 : parseInt(localMax.replace(/[^0-9]/g, ''), 10);

    const parsedMin = isNaN(parsedMinNum) ? 0 : Math.max(0, parsedMinNum);
    const parsedMax = isNaN(parsedMaxNum) ? 150000 : Math.max(0, parsedMaxNum);

    if (parsedMin > parsedMax) {
      setPriceRange(parsedMax, parsedMin);
    } else {
      setPriceRange(parsedMin, parsedMax);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <Filter className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>{mounted ? t('filter_title') : 'Filters & Refinements'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {mounted ? t('filter_reset') : 'Reset'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {mounted ? (language === 'bn' ? 'পণ্য খুঁজুন' : 'Search Products') : 'Search Products'}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={mounted ? (language === 'bn' ? 'অডিও, কিবোর্ড, স্মার্টওয়াচ...' : 'Search audio, keyboard, watches...') : 'Search...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          {mounted ? t('filter_categories') : 'Categories'}
        </label>
        <div className="flex flex-wrap lg:flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mounted ? getLocalizedCategory(cat, language) : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          {mounted ? t('filter_brands') : 'Popular Brands'}
        </label>
        <div className="flex flex-wrap lg:flex-col gap-1">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b === 'All' ? '' : b)}
              className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                (b === 'All' && !brand) || brand === b
                  ? 'bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {b === 'All' ? (mounted && language === 'bn' ? 'সকল ব্র্যান্ড' : 'All Brands') : b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider, Presets & Custom Min-Max in Bangladeshi Taka (৳ BDT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold uppercase tracking-wider">{mounted ? t('filter_price_range') : 'Price Range'}</span>
          <span className="font-bold text-orange-600 dark:text-orange-400 font-mono text-[11px] sm:text-xs">
            {mounted
              ? minPrice > 0 || maxPrice < 150000
                ? `${formatCurrency(minPrice, language)} - ${formatCurrency(maxPrice, language)}`
                : formatCurrency(maxPrice, language)
              : minPrice > 0 || maxPrice < 150000
              ? `৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}`
              : `৳${maxPrice.toLocaleString()}`}
          </span>
        </div>

        {/* Custom Min - Max Inputs Row with Theme Styled Arrow Submit Button */}
        <form onSubmit={handleApplyCustomPrice} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder={mounted && language === 'bn' ? 'মিনিমাম' : 'Min'}
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-center"
            />
          </div>
          <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs select-none">-</span>
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder={mounted && language === 'bn' ? 'ম্যাক্সিমাম' : 'Max'}
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono text-center"
            />
          </div>
          <button
            type="submit"
            aria-label="Apply price filter"
            title={mounted && language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Price'}
            className="flex-shrink-0 w-8 h-[30px] rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer border border-orange-400/40"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </button>
        </form>

        {/* Quick Budget Chips */}
        <div className="grid grid-cols-4 gap-1">
          {[10000, 25000, 50000, 150000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                if (preset >= 150000) {
                  setPriceRange(0, 150000);
                } else {
                  setPriceRange(0, preset);
                }
              }}
              className={`py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                minPrice === 0 && maxPrice === preset
                  ? 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {preset >= 150000
                ? (mounted && language === 'bn' ? 'সব' : 'All')
                : (mounted && language === 'bn' ? `<৳${toBengaliNumber((preset / 1000).toFixed(0))}হাজার` : `<৳${(preset / 1000).toFixed(0)}k`)}
            </button>
          ))}
        </div>

        <input
          type="range"
          min="0"
          max="150000"
          step="500"
          value={maxPrice}
          onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
          className="w-full accent-[#ff4400] bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {mounted ? t('filter_min_rating') : 'Customer Rating'}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[4, 3, 2, 0].map((star) => (
            <button
              key={star}
              onClick={() => setMinRating(star)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                minRating === star
                  ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {star > 0
                ? (mounted && language === 'bn' ? `${toBengaliNumber(star)}★+` : `${star}★+`)
                : (mounted && language === 'bn' ? 'সব' : 'All')}
            </button>
          ))}
        </div>
      </div>

      {/* Flash Sale Toggle */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={isFlashSale}
            onChange={(e) => setIsFlashSale(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-800 text-orange-600 focus:ring-orange-500 bg-white dark:bg-slate-950"
          />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {mounted ? t('filter_flash_only') : '⚡ Flash Sale Deals Only'}
          </span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {mounted ? t('filter_sort_by') : 'Sort By'}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="newest">{mounted ? t('sort_newest') : 'Newest Arrivals'}</option>
          <option value="price_asc">{mounted ? t('sort_price_asc') : 'Price: Low to High'}</option>
          <option value="price_desc">{mounted ? t('sort_price_desc') : 'Price: High to Low'}</option>
          <option value="rating">{mounted ? t('sort_rating_desc') : 'Highest Customer Rating'}</option>
        </select>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/25 cursor-pointer"
        >
          {mounted ? (language === 'bn' ? 'ফিল্টার প্রয়োগ করে পণ্য দেখুন' : 'Apply Filters & View Results') : 'Apply Filters'}
        </button>
      )}
    </div>
  );
};
