'use client';

import React, { useEffect, useState } from 'react';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore, Product } from '@/store/useProductStore';
import { Sparkles, PackageSearch } from 'lucide-react';

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
    title: 'AuraStyle Minimalist Cashmere Wool Coat',
    slug: 'aurastyle-cashmere-wool-coat',
    description: 'Ethically sourced 100% cashmere wool with ergonomic tailoring for effortless elegance.',
    category: 'Apparel',
    brand: 'AuraStyle',
    price: 340,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80'],
    vendorName: 'Aura Luxury',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 45,
    tags: ['fashion', 'winter', 'cashmere'],
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
    title: 'Nexus Mechanical Keyboard RGB Wireless',
    slug: 'nexus-mechanical-keyboard-rgb',
    description: 'Hot-swappable tactile switches with aircraft aluminum body and tri-mode connectivity.',
    category: 'Electronics',
    brand: 'NexusTech',
    price: 165,
    stock: 31,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 112,
    tags: ['gaming', 'keyboard', 'mechanical'],
  },
];

export default function ProductsPage() {
  const { search, category, brand, maxPrice, minRating, sortBy, isFlashSale } = useProductStore();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (brand) queryParams.append('brand', brand);
        if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
        if (minRating) queryParams.append('minRating', minRating.toString());
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (isFlashSale) queryParams.append('isFlashSale', 'true');

        const res = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.products?.length > 0) {
            setProducts(json.data.products);
            return;
          }
        }
      } catch (_e) {
        // Fallback to client-side filtering on mock data if backend not yet running
      }

      // Client-side filter fallback
      let filtered = [...FALLBACK_PRODUCTS];
      if (search) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (category) filtered = filtered.filter((p) => p.category === category);
      if (brand) filtered = filtered.filter((p) => p.brand === brand);
      if (isFlashSale) filtered = filtered.filter((p) => p.isFlashSale);
      if (maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= maxPrice);
      if (minRating) filtered = filtered.filter((p) => p.averageRating >= minRating);

      if (sortBy === 'price_asc') filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      if (sortBy === 'price_desc') filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      if (sortBy === 'rating') filtered.sort((a, b) => b.averageRating - a.averageRating);

      setProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [search, category, brand, maxPrice, minRating, sortBy, isFlashSale]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 p-8 sm:p-12 mb-10 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Catalog.
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Explore Premium Products
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover verified tech, apparel, and lifestyle innovations with real-time stock validation and multi-criteria filters.
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
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{products.length}</span> results
            </p>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center">
              <PackageSearch className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-semibold text-slate-200 mb-1">No products found</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Try adjusting your search criteria or resetting filters to view all available products.
              </p>
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
