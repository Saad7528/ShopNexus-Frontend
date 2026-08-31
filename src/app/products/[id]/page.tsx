'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ReviewForm } from '@/components/products/ReviewForm';
import { getProductByIdOrSlug, ALL_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Check,
  Store,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  // Dynamically resolve the real product
  const rawProduct = getProductByIdOrSlug(productId);

  const product = {
    id: rawProduct?._id || productId,
    name: rawProduct?.title || 'Nexus Pro Precision Device',
    brand: rawProduct?.brand || 'ShopNexus Official',
    vendorId: 'vendor_001',
    vendorName: rawProduct?.vendorName || 'ShopNexus Official Store',
    price: rawProduct?.discountPrice || rawProduct?.price || 24500,
    originalPrice: rawProduct?.price || 28000,
    rating: rawProduct?.averageRating || 4.9,
    reviewCount: rawProduct?.totalReviews || 128,
    inStock: (rawProduct?.stock || 10) > 0,
    stockCount: rawProduct?.stock || 12,
    category: rawProduct?.category || 'Hardware & Acoustics',
    description:
      rawProduct?.description ||
      'Engineered with industry-leading materials, rigorous laboratory testing, and seamless ecosystem connectivity for true enthusiasts.',
    images: rawProduct?.images && rawProduct.images.length > 0 ? rawProduct.images : [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    ],
    isFlashSale: rawProduct?.isFlashSale || false,
    flashSaleDiscountPercent: rawProduct?.flashSaleDiscountPercent || 0,
    colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    sizes: ['Standard Unit', 'Creator Edition'],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Farhan Rahman',
      rating: 5,
      date: '2 days ago',
      comment: 'অসাধারণ কোয়ালিটি! সাউন্ড এবং বিল্ড কোয়ালিটি টপ-লেভেলের। ১ দিনের মধ্যেই ডেলিভারি পেয়েছি।',
    },
    {
      id: 'rev-2',
      author: 'Tariqul Islam',
      rating: 5,
      date: '1 week ago',
      comment: 'Super fast delivery in Dhaka and 100% genuine sealed box. Build quality is solid.',
    },
  ]);

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

  const handleReviewSubmitted = (newRev: { rating: number; comment: string; author: string }) => {
    setReviews([
      {
        id: `rev-${Date.now()}`,
        author: newRev.author,
        rating: newRev.rating,
        date: 'Just now',
        comment: newRev.comment,
      },
      ...reviews,
    ]);
  };

  const isFavorite = isInWishlist(product.id);

  // Dynamic Trust Badges resolution
  const trustConfig = rawProduct?.trustBadges || {
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  };

  const activeTrustBadges = [];
  if (trustConfig.hasFastDelivery !== false) {
    activeTrustBadges.push({
      icon: <Truck className="w-4 h-4 text-orange-500 shrink-0" />,
      text: '২৪ ঘণ্টায় দ্রুত ডেলিভারি (ঢাকা ৳৬০)',
    });
  }
  if (trustConfig.hasWarranty !== false) {
    activeTrustBadges.push({
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: trustConfig.warrantyText || '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    });
  }
  if (trustConfig.hasReturnPolicy !== false) {
    activeTrustBadges.push({
      icon: <RotateCcw className="w-4 h-4 text-indigo-500 shrink-0" />,
      text: '৭ দিনের সহজ রিটার্ন পলিসি',
    });
  }
  if (trustConfig.isOfficialGenuine !== false) {
    activeTrustBadges.push({
      icon: <Check className="w-4 h-4 text-amber-500 shrink-0" />,
      text: '১০০% জেনুইন অরিজিনাল প্রোডাক্ট',
    });
  }

  // Related products from same category
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === rawProduct?.category && p._id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-3 sm:p-6 md:p-10 pt-2 sm:pt-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Desktop Breadcrumb / Back Link (Hidden on Mobile since image has floating controls) */}
        <div className="hidden md:flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/products" className="hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" /> All Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-400 dark:text-slate-500 font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs font-bold">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Left Column: Gallery with Floating Glass Buttons (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} productName={product.name} productId={product.id} />
          </div>

          {/* Right Column: Product Info & Purchase Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 flex flex-col justify-between">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Verified Genuine Guarantee
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-slate-500 dark:text-slate-400">({product.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> In Stock ({product.stockCount} left)
                </span>
              </div>

              {/* Pricing in ৳ BDT */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-mono">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 line-through font-mono">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.isFlashSale && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold border border-rose-500/30">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Color: <span className="text-orange-600 dark:text-orange-400">{selectedColor}</span>
                </span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size / Edition Selector */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Edition: <span className="text-orange-600 dark:text-orange-400">{selectedSize}</span>
                </span>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Action Buttons (Add to Cart + Direct Buy Now) */}
              <div className="space-y-3 pt-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between sm:justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-black cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-xs font-black font-mono">{quantity}</span>
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
                      addedSuccess
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30 border-emerald-600'
                        : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add to Cart (৳{(product.price * quantity).toLocaleString()})
                      </>
                    )}
                  </button>

                  {/* Direct Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 bg-gradient-to-r from-[#ff4400] via-[#ff6600] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff5500] text-white transition-all active:scale-95 cursor-pointer hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4 fill-white" /> Buy Now
                  </button>
                </div>
              </div>

              {/* Dynamic Trust Badges (Only render configured / checked perks) */}
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

        {/* Related Category Hardware */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  Related {product.category}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Discover matching audio and workstation gear</p>
              </div>
              <Link href={`/products?category=${encodeURIComponent(rawProduct?.category || '')}`} className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
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
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <div className="max-w-4xl space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Customer Reviews ({reviews.length})
            </h3>

            <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />

            <div className="space-y-3 pt-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{rev.author}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
