'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import { getLocalizedProduct } from '@/lib/localizedProducts';
import { Star, Zap, Plus, Check, Coins, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const { t, language } = useLanguageStore();
  const [isAdded, setIsAdded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const localized = mounted ? getLocalizedProduct(product, language) : null;
  const productTitle = localized ? localized.title : product.title;

  const isInCart = cartItems.some((item) => item.productId === product._id || item.productId === product.slug);
  const isButtonAdded = isAdded || isInCart;

  const displayPrice = product.isFlashSale && product.discountPrice ? product.discountPrice : product.price;
  const originalPrice = product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      title: productTitle,
      price: displayPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      quantity: 1,
      stock: product.stock,
      vendorName: product.vendorName,
    });
    setIsAdded(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      title: productTitle,
      price: displayPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      quantity: 1,
      stock: product.stock,
      vendorName: product.vendorName,
    });
    router.push('/checkout');
  };

  const productUrl = `/products/${product._id || product.slug}`;

  const isCombo = product.category === 'Combo Packages' || (product.tags && product.tags.includes('combo'));
  const hasDualImages = isCombo && product.images && product.images.length >= 2;
  const earnedLoyaltyPoints = Math.floor(displayPrice / 100) * 10;

  return (
    <Link
      href={productUrl}
      className="group relative flex flex-col bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-orange-500 dark:hover:border-orange-500/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* 1. Product Image & Badges (Compact 4:3 on mobile, 1:1 on desktop) */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950/60">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={productTitle}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized={product.images[0]?.startsWith('/')}
        />

        {/* Flash Sale / Combo Discount Badge */}
        {product.isFlashSale && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white font-black text-[8px] sm:text-[9px] shadow-md z-10">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>
              {product.flashSaleDiscountPercent
                ? `-${mounted && language === 'bn' ? toBengaliNumber(product.flashSaleDiscountPercent) : product.flashSaleDiscountPercent}%${isCombo ? ' COMBO' : ''}`
                : (mounted ? (isCombo ? 'কম্বো' : t('badge_sale')) : (isCombo ? 'COMBO' : 'SALE'))}
            </span>
          </div>
        )}

        {/* Loyalty Coins Badge for Combo */}
        {isCombo ? (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 dark:bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] shadow-md z-10">
            <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-slate-950" />
            <span>+{mounted && language === 'bn' ? toBengaliNumber(earnedLoyaltyPoints) : earnedLoyaltyPoints} pts</span>
          </div>
        ) : (
          /* Low Stock Badge */
          product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 px-1.5 py-0.5 rounded-md bg-rose-500/90 backdrop-blur-md text-white text-[7.5px] sm:text-[9px] font-bold z-10">
              {mounted && language === 'bn' ? toBengaliNumber(product.stock) : product.stock} {mounted ? t('badge_left') : 'left'}
            </div>
          )
        )}

        {/* Bottom Combo Header Tag (Clean, no AI star/sparkle icon) */}
        {isCombo && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent py-1.5 px-2.5 flex items-center justify-between text-[8px] sm:text-[9px] text-white font-bold z-10">
            <span className="text-orange-300 font-semibold tracking-wide">
              {mounted && language === 'bn' ? 'কম্বো বান্ডেল (২টি গ্যাজেট)' : 'Combo Bundle (2 Items)'}
            </span>
            <span className="text-emerald-300 font-mono">
              {mounted && language === 'bn' ? 'বিশেষ সেভার অফার' : 'Super Saver'}
            </span>
          </div>
        )}
      </div>

      {/* 2. Compact Product Details */}
      <div className="flex flex-col flex-1 p-2 sm:p-2.5 justify-between gap-1 sm:gap-1.5">
        <div>
          {/* Product Title */}
          <h3
            className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 text-[10.5px] sm:text-xs tracking-tight leading-snug transition-colors mb-0.5"
            title={productTitle}
          >
            {productTitle}
          </h3>
          {isCombo && product.description && (
            <p className="text-[9px] text-orange-600 dark:text-orange-400 font-medium line-clamp-1 mb-0.5">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-500 dark:fill-amber-400" />
              <span className="ml-0.5 text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-200">
                {localized ? localized.ratingFormatted : product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[8.5px] sm:text-[9px] text-slate-400 dark:text-slate-500">
              ({localized ? localized.reviewsFormatted : product.totalReviews})
            </span>
          </div>
        </div>

        {/* 3. Price & Sleek Action Buttons (+ Add & ⚡ Buy Now) */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono truncate">
              {mounted ? formatCurrency(displayPrice, language) : `৳${displayPrice.toLocaleString()}`}
            </span>
            {product.isFlashSale && product.discountPrice && (
              <span className="text-[8.5px] sm:text-[9px] text-slate-400 dark:text-slate-500 line-through font-mono truncate">
                {mounted ? formatCurrency(originalPrice, language) : `৳${originalPrice.toLocaleString()}`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            {/* Primary Action: Buy Now (Sleek & Compact) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-0.5 py-1 sm:py-1.5 px-1 sm:px-2 rounded-md sm:rounded-lg bg-linear-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-[9px] sm:text-xs font-bold shadow-xs shadow-orange-500/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              title={mounted ? t('btn_buy_now') : 'Buy Now'}
            >
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span>{mounted ? t('btn_buy_now') : 'Buy Now'}</span>
            </button>

            {/* Secondary Action: Add to Cart (Sleek & Compact) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-0.5 py-1 sm:py-1.5 px-1 sm:px-2 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold border transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                isButtonAdded
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-600/25'
                  : 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400'
              }`}
              title={isButtonAdded ? (mounted ? t('btn_added') : 'Added') : (mounted ? t('btn_add_to_cart') : 'Add to Cart')}
            >
              {isButtonAdded ? (
                <>
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[2.5]" />
                  <span>{mounted ? t('btn_added') : 'Added'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{mounted ? t('btn_add') : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
