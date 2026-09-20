'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { useBundleStore, convertBundleToProduct } from '@/store/useBundleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getLocalizedCategory } from '@/lib/localizedProducts';
import { toBengaliNumber } from '@/lib/translations';
import { ALL_PRODUCTS } from '@/data/products';
import { useHydrated } from '@/lib/useHydrated';
import { Product } from '@/types/product';
import { Sparkles, PackageSearch, RotateCcw, SlidersHorizontal } from 'lucide-react';

const CATEGORIES_LIST = [
  'All',
  'Combo Packages',
  'Audio',
  'Wearables',
  'Peripherals',
  'Smart Home',
  'Creator Gear',
  'Gaming',
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const {
    products: storeProducts,
    fetchProducts,
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
    resetFilters,
  } = useProductStore();

  const { t, language } = useLanguageStore();
  const mounted = useHydrated();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const rawBundles = useBundleStore((state) => state.bundles);

  // Merge dynamic custom bundles with products catalog
  const allCatalogProducts = React.useMemo(() => {
    const bundleProducts = rawBundles
      .filter((b) => b.status === 'Active')
      .map(convertBundleToProduct);
    const source = storeProducts && storeProducts.length > 0 ? storeProducts : ALL_PRODUCTS;
    const nonCombos = source.filter((p) => p.category !== 'Combo Packages');
    return [...bundleProducts, ...nonCombos];
  }, [rawBundles, storeProducts]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    const q = searchParams.get('search') ?? searchParams.get('q');
    const cat = searchParams.get('category');
    if (q !== null && q !== undefined) {
      setSearch(q);
    }
    if (cat !== null && cat !== undefined) {
      setCategory(cat);
    }
  }, [searchParams, setSearch, setCategory]);

  const products = React.useMemo(() => {
    let filtered = [...allCatalogProducts];
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          (Array.isArray(p.tags) && p.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }
    if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (brand) filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (isFlashSale) filtered = filtered.filter((p) => p.isFlashSale);
    if (typeof minPrice === 'number' && minPrice > 0) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) >= minPrice);
    }
    if (typeof maxPrice === 'number' && maxPrice < 150000) {
      filtered = filtered.filter((p) => (p.discountPrice || p.price) <= maxPrice);
    }
    if (minRating) filtered = filtered.filter((p) => (p.averageRating ?? 0) >= minRating);

    if (sortBy === 'price_asc') filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sortBy === 'price_desc') filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sortBy === 'rating') filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));

    return filtered;
  }, [search, category, brand, minPrice, maxPrice, minRating, sortBy, isFlashSale, allCatalogProducts]);

  const activeFiltersCount =
    (category ? 1 : 0) +
    (brand ? 1 : 0) +
    (isFlashSale ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (search ? 1 : 0) +
    (minPrice > 0 || (typeof maxPrice === 'number' && maxPrice < 150000) ? 1 : 0);

  return (
    <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#090d16] border border-orange-200 dark:border-orange-500/20 p-5 sm:p-10 mb-6 sm:mb-10 shadow-xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {mounted ? (language === 'bn' ? 'অফিসিয়াল ওয়্যারেন্টি ও ভেরিফাইড ক্যাটালগ' : 'Curated Catalog & Official Warranty') : 'Curated Catalog & Official Warranty'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            {mounted ? (language === 'bn' ? 'প্রিমিয়াম উদ্ভাবনী গ্যাজেটসমূহ' : 'Explore Premium Innovations') : 'Explore Premium Innovations'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {mounted ? (language === 'bn' ? 'অডিওফাইল সাউন্ড, মেকানিক্যাল কিবোর্ড, টাইটানিয়াম স্মার্টওয়াচ এবং স্মার্ট হোম গ্যাজেট অন্বেষণ করুন।' : 'Discover audiophile sound, mechanical keyboards, titanium wearables, and smart home hardware with persistent cart ordering.') : 'Discover audiophile sound, mechanical keyboards, titanium wearables, and smart home hardware with persistent cart ordering.'}
          </p>
        </div>
      </div>

      {/* Mobile Sticky Quick Category Scroll Bar & Filter Trigger */}
      <div className="lg:hidden mb-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = (cat === 'All' && !category) || category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-500/40'
                }`}
              >
                {cat === 'All' ? (mounted && language === 'bn' ? 'সকল বিভাগ' : 'All Categories') : (mounted ? getLocalizedCategory(cat, language) : cat)}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-800 dark:text-white shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          <span>{mounted ? t('filter_title') : 'Filters & Refinements'}</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
              {mounted && language === 'bn' ? toBengaliNumber(activeFiltersCount) : activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilter />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>
                {mounted ? t('filter_showing') : 'Showing'}{' '}
                <strong className="text-orange-600 dark:text-orange-400 font-bold font-mono">
                  {mounted && language === 'bn' ? toBengaliNumber(products.length) : products.length}
                </strong>{' '}
                {mounted ? t('filter_products_found') : 'products found'}
              </span>
              {search && (
                <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-[11px]">
                  &ldquo;{search}&rdquo;
                </span>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {mounted ? t('filter_reset') : 'Clear active filters'}
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm">
              <PackageSearch className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                {search
                  ? mounted && language === 'bn'
                    ? `"${search}" এর সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি`
                    : `No products found matching "${search}"`
                  : mounted && language === 'bn'
                  ? 'কোনো পণ্য পাওয়া যায়নি'
                  : 'No matching products found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {search
                  ? mounted && language === 'bn'
                    ? 'আপনার সার্চ করা কিওয়ার্ডের কোনো প্রোডাক্ট এই মুহূর্তে আমাদের সার্ভার ক্যাটালগে নেই। বানান যাচাই করুন অথবা ফিল্টার রিসেট করুন।'
                    : 'We could not find any products matching your search term in our official catalog. Check your spelling or try another keyword.'
                  : mounted && language === 'bn'
                  ? 'আপনার নির্বাচিত ফিল্টার বা বাজেটের সাথে কোনো পণ্য মেলেনি। অন্যান্য ফিল্টার দিয়ে চেষ্টা করুন।'
                  : 'We could not find any items matching your budget or selected filters. Try broadening your criteria.'}
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {mounted ? t('filter_reset') : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-2.5 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Slide-Over Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-2" />
            <ProductFilter onClose={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] mx-auto px-4 py-20 text-center text-slate-400 text-sm">
          Loading official hardware catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
