'use client';

import React from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Filter, RotateCcw, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Home & Living', 'Accessories', 'Audio', 'Footwear'];
const BRANDS = ['All', 'NexusTech', 'AuraStyle', 'PureSound', 'EcoLiving', 'Veloce'];

export const ProductFilter: React.FC = () => {
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
    <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Category
        </label>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-indigo-600/20 text-indigo-400 font-medium border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Brand
        </label>
        <div className="flex flex-col gap-1">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b === 'All' ? '' : b)}
              className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                (b === 'All' && !brand) || brand === b
                  ? 'bg-indigo-600/20 text-indigo-400 font-medium border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold uppercase tracking-wider">Max Price</span>
          <span className="font-bold text-white">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="10"
          max="2000"
          step="10"
          value={maxPrice}
          onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[4, 3, 2, 0].map((star) => (
            <button
              key={star}
              onClick={() => setMinRating(star)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                minRating === star
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {star > 0 ? `${star}★+` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Flash Sale Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={isFlashSale}
            onChange={(e) => setIsFlashSale(e.target.checked)}
            className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
          />
          <span className="font-medium text-amber-400">⚡ Flash Sale Deals Only</span>
        </label>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};
