'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useBundleStore, convertBundleToProduct } from '@/store/useBundleStore';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductReviewsSection } from '@/components/products/ProductReviewsSection';
import { FrequentlyBoughtTogether } from '@/components/products/FrequentlyBoughtTogether';
import { getProductByIdOrSlug, ALL_PRODUCTS } from '@/data/products';
import { INITIAL_BUNDLES, IBundleDeal } from '@/data/bundles';
import { ProductCard } from '@/components/products/ProductCard';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getLocalizedProduct, getLocalizedCategory } from '@/lib/localizedProducts';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Zap,
  CheckCircle2,
  Share2,
  ChevronRight,
  Package,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Layers,
  Check,
  Flame,
  Coins,
  Gift,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export interface IProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

export default function ProductDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const [mounted, setMounted] = useState(false);
  const { language, t } = useLanguageStore();

  const rawId = typeof routeParams?.id === 'string' 
    ? routeParams.id 
    : Array.isArray(routeParams?.id) 
    ? routeParams.id[0] 
    : '';
  const productId = decodeURIComponent(rawId || '').trim();

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const rawBundles = useBundleStore((state) => state.bundles);
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const [addedSuccess, setAddedSuccess] = useState(false);

  // 1. Check if this page matches a Combo Bundle synchronously
  const matchedBundle = useMemo<IBundleDeal | null>(() => {
    if (!productId) return null;
    let b = rawBundles.find((deal) => deal.id === productId || deal.id === `b-${productId}`);
    if (b) return b;
    if (productId === 'combo-1') b = rawBundles.find((deal) => deal.id === 'b-1');
    if (productId === 'combo-2') b = rawBundles.find((deal) => deal.id === 'b-2');
    if (productId === 'combo-3') b = rawBundles.find((deal) => deal.id === 'b-3');
    if (b) return b;
    b = rawBundles.find(
      (deal) =>
        deal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') ===
        productId.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    );
    if (b) return b;
    b = INITIAL_BUNDLES.find((deal) => deal.id === productId || deal.id === `b-${productId}`);
    return b || null;
  }, [productId, rawBundles]);

  // 2. Check Static Catalog synchronously
  const staticProduct = useMemo(() => {
    if (!productId) return null;
    return getProductByIdOrSlug(productId);
  }, [productId]);

  const [apiProduct, setApiProduct] = useState<any | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(!staticProduct && !matchedBundle);
  const [apiFetched, setApiFetched] = useState(false);

  // 3. Fetch from DB if not already available or to refresh real-time stock
  useEffect(() => {
    if (!productId) return;
    let isCancelled = false;

    const fetchLiveProduct = async () => {
      try {
        let res = await fetch(`/api/products/${productId}`).catch(() => null);
        if ((!res || !res.ok) && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          res = await fetch(`${API_URL}/products/${productId}`).catch(() => null);
        }
        if (!res || !res.ok) {
          if (!isCancelled) {
            setIsLoadingApi(false);
            setApiFetched(true);
          }
          return;
        }
        const data = await res.json().catch(() => null);
        if (!isCancelled) {
          if (data?.data?.product) {
            setApiProduct(data.data.product);
          } else if (data?.data) {
            setApiProduct(data.data);
          }
          setIsLoadingApi(false);
          setApiFetched(true);
        }
      } catch (_e) {
        if (!isCancelled) {
          setIsLoadingApi(false);
          setApiFetched(true);
        }
      }
    };

    fetchLiveProduct();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  // 4. Authentic Product Resolution - strictly authentic, no dummy Sony fallback
  const rawProduct = useMemo(() => {
    if (apiProduct) {
      return {
        _id: apiProduct._id || productId,
        title: apiProduct.title || apiProduct.name,
        slug: apiProduct.slug || productId,
        brand: apiProduct.brand || 'ShopNexus Official',
        vendorName: apiProduct.vendorName || 'ShopNexus Official Store',
        price: apiProduct.price || 0,
        discountPrice: apiProduct.discountPrice,
        averageRating: apiProduct.averageRating || 5.0,
        totalReviews: apiProduct.totalReviews || 18,
        stock: apiProduct.stock ?? 12,
        category: apiProduct.category || 'Electronics',
        description: apiProduct.description || '',
        images:
          apiProduct.images && apiProduct.images.length > 0
            ? apiProduct.images
            : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        isFlashSale: !!apiProduct.isFlashSale,
        flashSaleDiscountPercent: apiProduct.flashSaleDiscountPercent || 0,
        tags: apiProduct.tags || ['official', 'authentic'],
        trustBadges: apiProduct.trustBadges || {
          hasFastDelivery: true,
          hasWarranty: true,
          warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
          hasReturnPolicy: true,
          isOfficialGenuine: true,
        },
      };
    }
    if (staticProduct) return staticProduct;
    if (matchedBundle) return convertBundleToProduct(matchedBundle);
    return null;
  }, [apiProduct, staticProduct, matchedBundle, productId]);

  const localized = rawProduct && mounted ? getLocalizedProduct(rawProduct as any, language) : null;

  // Selected Options
  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [selectedSize, setSelectedSize] = useState('Standard Unit');
  const [quantity, setQuantity] = useState(1);
  const cartItems = useCartStore((state) => state.items);

  const productIdentifier = rawProduct?._id || productId;
  const isInCart = cartItems.some((item) => item.productId === productIdentifier);
  const isCartAdded = isInCart || addedSuccess;
  const isFavorite = isInWishlist(productIdentifier);

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    if (!rawProduct) return [];
    return ALL_PRODUCTS.filter(
      (p) => p.category === rawProduct.category && p._id !== rawProduct._id
    ).slice(0, 4);
  }, [rawProduct]);

  // -------------------------------------------------------------
  // LOADING SKELETON STATE (For dynamic non-static items while fetching)
  // -------------------------------------------------------------
  if (isLoadingApi && !rawProduct) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-3 sm:p-6 md:p-10 pt-4 sm:pt-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            <div className="lg:col-span-6">
              <div className="aspect-square w-full rounded-3xl bg-slate-200 dark:bg-slate-800/80" />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER COMBO BUNDLE DEDICATED VIEW IF THIS IS A COMBO PACKAGE
  // -------------------------------------------------------------
  if (matchedBundle) {
    const earnedLoyaltyPoints = Math.floor(matchedBundle.bundlePrice / 100) * 10;
    const cashbackTaka = Math.floor(earnedLoyaltyPoints / 10);
    const discountPercent =
      matchedBundle.originalTotal > matchedBundle.bundlePrice
        ? Math.round(((matchedBundle.originalTotal - matchedBundle.bundlePrice) / matchedBundle.originalTotal) * 100)
        : 15;

    const handleAddBundleToCart = () => {
      matchedBundle.items.forEach((item, idx) => {
        const itemPrice = Math.round(item.regularPrice * (matchedBundle.bundlePrice / (matchedBundle.originalTotal || 1)));
        addItem({
          productId: item.id || `combo-${matchedBundle.id}-${idx}`,
          title: `${item.title} [${matchedBundle.title}]`,
          price: itemPrice,
          image: item.image,
          quantity: 1,
          stock: 20,
          vendorName: 'ShopNexus Official Store',
        });
      });
      setAddedSuccess(true);
      openDrawer();
      setTimeout(() => setAddedSuccess(false), 3000);
    };

    const handleBuyBundleNow = () => {
      matchedBundle.items.forEach((item, idx) => {
        const itemPrice = Math.round(item.regularPrice * (matchedBundle.bundlePrice / (matchedBundle.originalTotal || 1)));
        addItem({
          productId: item.id || `combo-${matchedBundle.id}-${idx}`,
          title: `${item.title} [${matchedBundle.title}]`,
          price: itemPrice,
          image: item.image,
          quantity: 1,
          stock: 20,
          vendorName: 'ShopNexus Official Store',
        });
      });
      router.push('/checkout');
    };

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-3 sm:p-6 md:p-10 pt-4 sm:pt-8">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/products?category=Combo+Packages"
              className="hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1.5 transition-colors font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> {mounted && language === 'bn' ? 'সকল কম্বো প্যাকেজ' : 'All Combo Bundles'}
            </Link>
            <span>/</span>
            <span className="text-orange-500 font-semibold">{matchedBundle.badge}</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs font-bold">{matchedBundle.title}</span>
          </div>

          {/* Hero Combo Banner Header */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-500/20 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md">
                    {matchedBundle.badge}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 dark:bg-amber-500 text-slate-950 text-xs font-black shadow-md">
                    <Coins className="w-3.5 h-3.5 fill-slate-950" />
                    +{mounted && language === 'bn' ? toBengaliNumber(earnedLoyaltyPoints) : earnedLoyaltyPoints} Loyalty Points (৳{mounted && language === 'bn' ? toBengaliNumber(cashbackTaka) : cashbackTaka} Cashback)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    ✓ {mounted && language === 'bn' ? '১টি প্যাকেজে ২টি গ্যাজেট' : '2 Hardware Items in 1 Box'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {matchedBundle.title}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>
                    {mounted && language === 'bn' ? 'কম্বো সেটে যা যা থাকছে: ' : 'Included in this Combo: '}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {matchedBundle.items.map((it) => it.title).join('  +  ')}
                    </strong>
                  </span>
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  {matchedBundle.description || 'দুটি ফ্ল্যাগশিপ গ্যাজেট একসাথে কিনে উপভোগ করুন বিশেষ কম্বো ছাড় এবং আকর্ষণীয় লয়্যালটি কয়েন বোনাস।'}
                </p>
              </div>

              {/* Instant Savings Highlight */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-orange-500/30 shadow-xl shrink-0 text-center lg:text-right space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {mounted && language === 'bn' ? 'কম্বো বিশেষ মূল্য' : 'Combo Special Price'}
                </p>
                <div className="flex items-baseline justify-center lg:justify-end gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {mounted ? formatCurrency(matchedBundle.bundlePrice, language) : `৳${matchedBundle.bundlePrice.toLocaleString()}`}
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through font-mono">
                    {mounted ? formatCurrency(matchedBundle.originalTotal, language) : `৳${matchedBundle.originalTotal.toLocaleString()}`}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                  <Tag className="w-3 h-3" />
                  <span>
                    {mounted && language === 'bn'
                      ? `${toBengaliNumber(matchedBundle.savings)} টাকা সাশ্রয় (-${toBengaliNumber(discountPercent)}% ছাড়)`
                      : `Save ৳${matchedBundle.savings.toLocaleString()} (-${discountPercent}%)`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Products Breakdown Showcase */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              <span>{mounted && language === 'bn' ? 'কম্বো প্যাকেজের অন্তর্ভুক্ত গ্যাজেটসমূহ' : 'Hardware Devices Included in this Bundle'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {matchedBundle.items.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-orange-500/50"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/80 flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                        alt={item.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                        {item.category || (idx === 0 ? 'Item 1' : 'Item 2')}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>১০০% অফিসিয়াল জেনুইন গ্যাজেট • অফিসিয়াল ওয়ারেন্টি সহ</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500">একক রেগুলার বাজারমূল্য:</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
                      {mounted ? formatCurrency(item.regularPrice, language) : `৳${item.regularPrice.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checkout Bar */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {mounted && language === 'bn' ? 'এক ক্লিকে সম্পূর্ণ কম্বো অর্ডার করুন' : 'Order Full Combo Set in 1-Click'}
                </h3>
                <p className="text-xs text-slate-500">
                  {mounted && language === 'bn'
                    ? 'উভয় গ্যাজেট স্বয়ংক্রিয়ভাবে আপনার কার্টে যুক্ত হবে বিশেষ কম্বো প্রাইসে।'
                    : 'Both devices will be added to your cart with guaranteed instant bundle discount.'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className="flex-1 sm:flex-none py-3.5 px-6 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isCartAdded ? (mounted ? t('btn_added') : 'Added to Cart!') : (mounted ? 'কম্বো কার্টে যোগ করুন' : 'Add Combo to Cart')}
                </button>

                <button
                  type="button"
                  onClick={handleBuyBundleNow}
                  className="flex-1 sm:flex-none py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  {mounted ? 'এখনই কম্বো কিনুন' : 'Buy Combo Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // NOT FOUND STATE (If ID does not exist in DB or Catalog)
  // -------------------------------------------------------------
  if (!rawProduct) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
          {mounted && language === 'bn' ? 'প্রোডাক্টটি পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {mounted && language === 'bn'
            ? 'অনুরোধকৃত প্রোডাক্টটির অস্তিত্ব নেই অথবা ক্যাটালগ থেকে সরানো হয়েছে।'
            : 'The requested product could not be located in our official catalog.'}
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {mounted && language === 'bn' ? 'সকল প্রোডাক্টে ফিরে যান' : 'Back to All Products'}
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STANDARD AUTHENTIC PRODUCT VIEW
  // -------------------------------------------------------------
  const product = {
    id: rawProduct._id,
    name: localized?.title || rawProduct.title,
    brand: rawProduct.brand || 'ShopNexus Official',
    vendorId: 'vendor_001',
    vendorName: rawProduct.vendorName || 'ShopNexus Official Store',
    price: rawProduct.discountPrice || rawProduct.price,
    originalPrice: rawProduct.price,
    rating: rawProduct.averageRating || 5.0,
    reviewCount: rawProduct.totalReviews || 18,
    inStock: (rawProduct.stock ?? 10) > 0,
    stockCount: rawProduct.stock ?? 12,
    category: localized ? localized.category : rawProduct.category,
    description: localized?.description || rawProduct.description,
    images: rawProduct.images && rawProduct.images.length > 0
      ? rawProduct.images
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    isFlashSale: !!rawProduct.isFlashSale,
    flashSaleDiscountPercent: rawProduct.flashSaleDiscountPercent || 0,
    colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    sizes: ['Standard Unit', 'Creator Edition'],
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: `${product.name} (${selectedColor}, ${selectedSize})`,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stockCount,
      vendorName: product.vendorName,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      title: `${product.name} (${selectedColor}, ${selectedSize})`,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stockCount,
      vendorName: product.vendorName,
    });
    router.push('/checkout');
  };

  // Trust Badges
  const trustConfig = rawProduct.trustBadges || {
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  };

  const activeTrustBadges = [];
  if (trustConfig.hasFastDelivery !== false) {
    activeTrustBadges.push({
      icon: <Truck className="w-4 h-4 text-orange-500 shrink-0" />,
      text: mounted ? t('details_fast_shipping') : '২৪ ঘণ্টায় দ্রুত ডেলিভারি (ঢাকা ৳৬০)',
    });
  }
  if (trustConfig.hasWarranty !== false) {
    activeTrustBadges.push({
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: mounted ? (language === 'bn' ? trustConfig.warrantyText || '১ বছরের অফিসিয়াল ওয়ারেন্টি' : '1 Year Official Warranty') : '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    });
  }
  if (trustConfig.hasReturnPolicy !== false) {
    activeTrustBadges.push({
      icon: <RotateCcw className="w-4 h-4 text-indigo-500 shrink-0" />,
      text: mounted ? t('details_easy_return') : '৭ দিনের সহজ রিটার্ন পলিসি',
    });
  }
  if (trustConfig.isOfficialGenuine !== false) {
    activeTrustBadges.push({
      icon: <Check className="w-4 h-4 text-amber-500 shrink-0" />,
      text: mounted ? (language === 'bn' ? '১০০% জেনুইন অরিজিনাল প্রোডাক্ট' : '100% Genuine Verified Hardware') : '১০০% জেনুইন অরিজিনাল প্রোডাক্ট',
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-3 sm:p-6 md:p-10 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            {mounted ? t('nav_home') : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-orange-500 transition-colors">
            {mounted ? t('nav_products') : 'Products'}
          </Link>
          <span>/</span>
          <span className="text-slate-400 dark:text-slate-500 font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs font-bold">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} productName={product.name} productId={product.id} />
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Category & Brand Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {mounted && language === 'bn' ? 'ব্র্যান্ড' : 'Brand'}: <strong className="text-slate-700 dark:text-slate-200">{product.brand}</strong>
                </span>
              </div>

              {/* Title & Wishlist */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        category: product.category,
                        inStock: product.inStock,
                      })
                    }
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                    title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Rating & Stock Summary */}
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">
                      {localized ? localized.ratingFormatted : product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {localized ? localized.reviewsFormatted : product.reviewCount} {mounted && language === 'bn' ? 'ভেরিফাইড রিভিউ' : 'verified reviews'}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5 mr-1" /> {mounted && language === 'bn' ? 'স্টকে আছে' : 'In Stock'} ({mounted && language === 'bn' ? toBengaliNumber(product.stockCount) : product.stockCount})
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {mounted ? formatCurrency(product.price, language) : `৳${product.price.toLocaleString()}`}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 line-through font-mono">
                        {mounted ? formatCurrency(product.originalPrice, language) : `৳${product.originalPrice.toLocaleString()}`}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {mounted && language === 'bn'
                        ? `${toBengaliNumber(product.originalPrice - product.price)} টাকা সাশ্রয়`
                        : `Save ৳${(product.originalPrice - product.price).toLocaleString()}`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{mounted && language === 'bn' ? toBengaliNumber(Math.floor(product.price / 100) * 10) : Math.floor(product.price / 100) * 10} pts</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Actions: Quantity + Add to Cart + Buy Now */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-black cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs sm:text-sm">
                      {mounted && language === 'bn' ? toBengaliNumber(quantity) : quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-black cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer border ${
                      isCartAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30 border-emerald-600'
                        : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30'
                    }`}
                  >
                    {isCartAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" /> {mounted ? t('btn_added') : 'Added to Cart!'}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> {mounted ? t('btn_add_to_cart') : 'Add to Cart'}
                      </>
                    )}
                  </button>

                  {/* Direct Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 bg-gradient-to-r from-[#ff4400] via-[#ff6600] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff5500] text-white transition-all active:scale-95 cursor-pointer hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4 fill-white" /> {mounted ? t('btn_buy_now') : 'Buy Now'}
                  </button>
                </div>
              </div>

              {/* Dynamic Trust Badges */}
              {activeTrustBadges.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                  {activeTrustBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800/60"
                    >
                      {badge.icon}
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <FrequentlyBoughtTogether
          mainProduct={{
            _id: product.id,
            title: product.name,
            price: product.price,
            discountPrice: product.originalPrice > product.price ? product.price : undefined,
            images: product.images,
          }}
          complementaryProducts={ALL_PRODUCTS.filter((p) => p._id !== product.id).slice(0, 2).map((p) => ({
            _id: p._id,
            title: p.title,
            price: p.price,
            discountPrice: p.discountPrice,
            images: p.images,
          }))}
        />

        {/* Related Category Hardware */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  {mounted ? t('details_related_products') : `Related ${product.category}`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mounted ? (language === 'bn' ? 'আপনার সেটআপের সাথে মানানসই সম্পর্কিত অডিও ও গ্যাজেট' : 'Discover matching audio and workstation gear') : 'Discover matching gear'}
                </p>
              </div>
              <Link href={`/products?category=${encodeURIComponent(rawProduct.category || '')}`} className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                {mounted ? t('btn_view_all') : 'View All'} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <ProductReviewsSection productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
