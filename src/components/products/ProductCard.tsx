'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { Star, ShoppingBag, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-orange-500 dark:hover:border-orange-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950/60">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Flash Sale Badge */}
        {product.isFlashSale && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] backdrop-blur-md text-white font-black text-[10px] shadow-md">
            <Zap className="w-3 h-3 fill-current" />
            <span>FLASH {product.flashSaleDiscountPercent}% OFF</span>
          </div>
        )}

        {/* Low Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3.5">
        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-orange-600 dark:text-orange-400 truncate">{product.category}</span>
          <span className="text-slate-400 dark:text-slate-500 truncate text-[10px] uppercase font-bold tracking-wider">{product.brand}</span>
        </div>

        <Link href={`/products/${product._id || product.slug}`} className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 text-xs sm:text-sm tracking-tight mb-1.5" title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-500 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
            <span className="ml-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">{product.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">({product.totalReviews})</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">৳{displayPrice.toLocaleString()}</span>
              {product.isFlashSale && product.discountPrice && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">৳{originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white shadow-orange-500/25'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdded ? 'Added! ✓' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
