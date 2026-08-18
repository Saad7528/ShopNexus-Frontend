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
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950/40">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Flash Sale Badge */}
        {product.isFlashSale && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-xs shadow-lg">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>FLASH {product.flashSaleDiscountPercent}% OFF</span>
          </div>
        )}

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-rose-500/80 backdrop-blur-md text-white text-[11px] font-medium">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-indigo-400">{product.category}</span>
          <span className="truncate">{product.brand}</span>
        </div>

        <Link href={`/products/${product.slug}`} className="group-hover:text-indigo-400 transition-colors">
          <h3 className="font-semibold text-slate-100 line-clamp-1 text-base tracking-tight mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="ml-1 text-xs font-bold text-slate-200">{product.averageRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-slate-500">({product.totalReviews} reviews)</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">${displayPrice.toFixed(2)}</span>
              {product.isFlashSale && product.discountPrice && (
                <span className="text-xs text-slate-500 line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">by {product.vendorName}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
