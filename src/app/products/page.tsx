'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore, Product } from '@/store/useProductStore';
import { useBundleStore, convertBundleToProduct } from '@/store/useBundleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getLocalizedCategory } from '@/lib/localizedProducts';
import { toBengaliNumber } from '@/lib/translations';
import { ALL_PRODUCTS } from '@/data/products';
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
    search,
    category,
    brand,
    maxPrice,
    minRating,
    sortBy,
    isFlashSale,
    setSearch,
    setCategory,
    resetFilters,
  } = useProductStore();

  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [liveDbProducts, setLiveDbProducts] = useState<Product[]>([]);
  const rawBundles = useBundleStore((state) => state.bundles);

  useEffect(() => {
    let isCancelled = false;
    const fetchDbProducts = async () => {
      try {
        let res = await fetch('/api/products?limit=100').catch(() => null);
        if ((!res || !res.ok) && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          res = await fetch(`${API_URL}/products?limit=100`).catch(() => null);
        }
        if (!res || !res.ok) return;
        const data = await res.json().catch(() => null);
        const productsList = data?.data?.products || (Array.isArray(data?.data) ? data.data : null);
        if (!isCancelled && productsList && Array.isArray(productsList) && productsList.length > 0) {
          const mapped: Product[] = productsList.map((p: any) => ({
            _id: p._id || p.id,
            title: p.title || p.name,
            slug: p.slug || p._id || p.id,
            description: p.description || '',
            category: p.category || 'Audio',
            brand: p.brand || 'ShopNexus Official',
            price: p.price || 0,
            discountPrice: p.discountPrice,
            stock: p.stock ?? 20,
            images: p.images?.length > 0 ? p.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
            vendorName: p.vendorName || 'ShopNexus Official',
            isFlashSale: !!p.isFlashSale,
            flashSaleDiscountPercent: p.flashSaleDiscountPercent || (p.discountPrice && p.price ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0),
            averageRating: p.averageRating || 4.8,
            totalReviews: p.totalReviews || 12,
            tags: p.tags || ['popular', 'official'],
          }));
          setLiveDbProducts(mapped);
        }
      } catch (_err) {}
    };

    fetchDbProducts();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Merge custom dynamic bundles with live DB products and base products stably
  const allCatalogProducts = React.useMemo(() => {
    const bundleProducts = rawBundles
      .filter((b) => b.status === 'Active')
      .map(convertBundleToProduct);
    const nonCombos = ALL_PRODUCTS.filter((p) => p.category !== 'Combo Packages');

    // Create a lookup for live DB updates to preserve stable list order
    const liveMap = new Map<string, Product>();
    liveDbProducts.forEach((p) => {
      if (p._id) liveMap.set(p._id, p);
      if (p.slug) liveMap.set(p.slug, p);
    });

    const catalogMerged = nonCombos.map((base) => {
      const live = liveMap.get(base._id) || liveMap.get(base.slug);
      return live ? { ...base, ...live } : base;
    });

    const baseIds = new Set(nonCombos.map((p) => p._id));
    const baseSlugs = new Set(nonCombos.map((p) => p.slug));
    const newDbProducts = liveDbProducts.filter((p) => !baseIds.has(p._id) && !baseSlugs.has(p.slug));

    return [...bundleProducts, ...catalogMerged, ...newDbProducts];
  }, [rawBundles, liveDbProducts]);

  const [products, setProducts] = useState<Product[]>(allCatalogProducts);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams, setSearch, setCategory]);

  useEffect(() => {
    let filtered = [...allCatalogProducts];
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (brand) filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (isFlashSale) filtered = filtered.filter((p) => p.isFlashSale);
    if (maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= maxPrice);
    if (minRating) filtered = filtered.filter((p) => p.averageRating >= minRating);

    if (sortBy === 'price_asc') filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sortBy === 'price_desc') filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sortBy === 'rating') filtered.sort((a, b) => b.averageRating - a.averageRating);

    setProducts(filtered);
  }, [search, category, brand, maxPrice, minRating, sortBy, isFlashSale, allCatalogProducts]);

  const activeFiltersCount = (category ? 1 : 0) + (brand ? 1 : 0) + (isFlashSale ? 1 : 0) + (minRating > 0 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
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
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mounted ? getLocalizedCategory(cat, language) : cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>{mounted ? t('filter_title') : 'Filters & Refinements'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-black">
                {mounted && language === 'bn' ? toBengaliNumber(activeFiltersCount) : activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-500 text-xs font-bold cursor-pointer"
              title={mounted ? t('filter_reset') : 'Reset Filters'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desktop Sidebar Filters (Hidden on Mobile) */}
        <aside className="hidden lg:block lg:col-span-3">
          <ProductFilter />
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {mounted ? t('filter_showing') : 'Showing'}{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {mounted && language === 'bn' ? toBengaliNumber(products.length) : products.length}
              </span>{' '}
              {mounted ? t('filter_products_found') : 'official items'}
            </p>
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
                {mounted ? (language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No matching products found') : 'No matching products found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {mounted ? (language === 'bn' ? 'আপনার নির্বাচিত ফিল্টার বা বাজেটের সাথে কোনো পণ্য মেলেনি। অন্যান্য ফিল্টার দিয়ে চেষ্টা করুন।' : 'We couldn\'t find any items matching your budget or selected filters. Try broadening your criteria.') : 'We couldn\'t find any items matching your budget.'}
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {mounted ? t('filter_reset') : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
          Loading official hardware catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
