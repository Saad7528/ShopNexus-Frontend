'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore, Product } from '@/store/useProductStore';
import { Sparkles, PackageSearch, RotateCcw } from 'lucide-react';

const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: 'p1',
    title: 'AuraSound Pro Active Noise-Cancelling Headphones',
    slug: 'aurasound-pro-anc-headphones',
    description: 'Studio-grade spatial audio with 40-hour ultra battery life and pure titanium drivers.',
    category: 'Audio',
    brand: 'PureSound',
    price: 299,
    discountPrice: 229,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'PureSound Audio Corp',
    isFlashSale: true,
    flashSaleDiscountPercent: 23,
    averageRating: 4.9,
    totalReviews: 128,
    tags: ['wireless', 'noise-cancelling', 'bluetooth 5.3'],
  },
  {
    _id: 'p2',
    title: 'Nexus Watch Ultra 2 OLED Smartwatch',
    slug: 'nexus-watch-ultra-2',
    description: 'Precision aerospace titanium casing with continuous biometric health tracking and ECG.',
    category: 'Electronics',
    brand: 'NexusTech',
    price: 499,
    discountPrice: 449,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.8,
    totalReviews: 89,
    tags: ['smartwatch', 'fitness', 'titanium'],
  },
  {
    _id: 'p3',
    title: 'Apex RGB Mechanical Hot-Swap Keyboard',
    slug: 'apex-rgb-mechanical-keyboard',
    description: 'Custom lubed linear switches with sound-dampening silicone gasket and south-facing RGB.',
    category: 'Gaming',
    brand: 'NexusTech',
    price: 189,
    discountPrice: 149,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 62,
    tags: ['gaming', 'keyboard', 'mechanical'],
  },
  {
    _id: 'p4',
    title: 'EcoLiving Smart Hydroponic Indoor Garden',
    slug: 'ecoliving-smart-indoor-garden',
    description: 'Automated spectrum LED lighting and smart watering reservoir for fresh herbs year-round.',
    category: 'Home & Living',
    brand: 'EcoLiving',
    price: 189,
    discountPrice: 149,
    stock: 9,
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: true,
    flashSaleDiscountPercent: 21,
    averageRating: 4.6,
    totalReviews: 67,
    tags: ['smart home', 'garden', 'green'],
  },
  {
    _id: 'p5',
    title: 'Veloce Carbon Fiber Running Shoes',
    slug: 'veloce-carbon-running-shoes',
    description: 'Full-length carbon propulsion plate and ultra-lightweight responsive foam cushioning.',
    category: 'Footwear',
    brand: 'Veloce',
    price: 220,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    vendorName: 'Veloce Sports',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 94,
    tags: ['marathon', 'running', 'carbon'],
  },
  {
    _id: 'p6',
    title: 'Studio True Wireless ANC Earbuds (Gen 3)',
    slug: 'studio-tw-earbuds-gen-3',
    description: 'Ultra-low latency wireless earbuds with custom dynamic drivers and IPX7 waterproofing.',
    category: 'Audio',
    brand: 'PureSound',
    price: 179,
    discountPrice: 139,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    vendorName: 'PureSound Audio Corp',
    isFlashSale: true,
    flashSaleDiscountPercent: 22,
    averageRating: 4.9,
    totalReviews: 87,
    tags: ['earbuds', 'waterproof', 'wireless charging'],
  },
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

  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  // Sync URL search params with store
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategory !== null) setCategory(urlCategory);
  }, [searchParams, setSearch, setCategory]);

  useEffect(() => {
    let filtered = [...FALLBACK_PRODUCTS];
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
  }, [search, category, brand, maxPrice, minRating, sortBy, isFlashSale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-slate-900/90 border border-indigo-500/20 p-8 sm:p-12 mb-10 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Catalog & Faceted Search
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Explore Premium Innovations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Discover audio acoustics, titanium electronics, and multi-vendor verified hardware with persistent cart ordering.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters & Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 sticky top-24">
          <ProductFilter />
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-400">
              Showing <span className="font-bold text-white">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
            </p>
            {(search || category || brand || isFlashSale) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear active filters
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800 rounded-3xl text-center">
              <PackageSearch className="w-14 h-14 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1.5">No matching products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                We couldn&apos;t find any items matching your current filters. Try changing your search query or reset your filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
          Loading catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
