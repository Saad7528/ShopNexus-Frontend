'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { Star, Zap, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = React.useState(false);

  const displayPrice = product.isFlashSale && product.discountPrice ? product.discountPrice : product.price;
  const originalPrice = product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      title: product.title,
      price: displayPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      quantity: 1,
      stock: product.stock,
      vendorName: product.vendorName,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      title: product.title,
      price: displayPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      quantity: 1,
      stock: product.stock,
      vendorName: product.vendorName,
    });
    router.push('/checkout');
  };

  const productUrl = `/products/${product._id || product.slug}`;

  return (
    <Link
      href={productUrl}
      className="group relative flex flex-col bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-orange-500 dark:hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* 1. Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950/60">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Flash Sale Badge */}
        {product.isFlashSale && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white font-black text-[9px] shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>{product.flashSaleDiscountPercent ? `-${product.flashSaleDiscountPercent}%` : 'SALE'}</span>
          </div>
        )}

        {/* Low Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 rounded-md bg-rose-500/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-bold">
            {product.stock} left
          </div>
        )}
      </div>

      {/* 2. Compact Product Details */}
      <div className="flex flex-col flex-1 p-2 sm:p-2.5 justify-between">
        <div>
          {/* Product Title */}
          <h3
            className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 text-[11px] sm:text-xs tracking-tight leading-snug transition-colors mb-1"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
              <span className="ml-1 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500">({product.totalReviews})</span>
          </div>
        </div>

        {/* 3. Price & Action Buttons (+ Add & ⚡ Buy Now) */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 mt-1">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono truncate">
              ৳{displayPrice.toLocaleString()}
            </span>
            {product.isFlashSale && product.discountPrice && (
              <span className="text-[9px] text-slate-400 dark:text-slate-500 line-through font-mono truncate">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            {/* Primary Action: Buy Now on the Left (Vivid Solid Gradient) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-[10px] sm:text-xs font-bold shadow-xs shadow-orange-500/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              title="Buy Now (Direct Checkout)"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Buy Now</span>
            </button>

            {/* Secondary Action: Add to Cart on the Right (Soft Orange Tint) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 py-1.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/25'
                  : 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400'
              }`}
              title="Add to Cart"
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
