'use client';

import React from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Filter, RotateCcw, Search, X } from 'lucide-react';

const CATEGORIES = [
  'All',
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

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <Filter className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Filters & Refinements</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
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
          Search Products
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audio, keyboard, watches..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Category
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Brand
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
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider & Presets in Bangladeshi Taka (৳ BDT) */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Max Budget (BDT)</span>
          <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">৳{maxPrice.toLocaleString()}</span>
        </div>

        {/* Quick Budget Chips */}
        <div className="grid grid-cols-4 gap-1 mb-2.5">
          {[10000, 25000, 50000, 150000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPriceRange(minPrice, preset)}
              className={`py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                maxPrice === preset
                  ? 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {preset >= 150000 ? 'All' : `<৳${(preset / 1000).toFixed(0)}k`}
            </button>
          ))}
        </div>

        <input
          type="range"
          min="1000"
          max="150000"
          step="2500"
          value={maxPrice}
          onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
          className="w-full accent-[#ff4400] bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Minimum Rating
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
              {star > 0 ? `${star}★+` : 'All'}
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
          <span className="font-semibold text-amber-600 dark:text-amber-400">⚡ Flash Sale Deals Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/25"
        >
          Apply Filters & View Results
        </button>
      )}
    </div>
  );
};
