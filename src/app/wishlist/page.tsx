'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: 50,
      vendorName: 'ShopNexus Official',
    });
    removeFromWishlist(item.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
              <span className="px-3 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/30">
                {items.length} Saved Items
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Keep track of products you want to buy later or wait for price drops.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear All Saved
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              Explore our trending tech catalog and save items you want to keep an eye on.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-orange-500/40 p-4 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl backdrop-blur-xl"
              >
                <div>
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    {item.category}
                  </span>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mt-1">
                      {item.name}
                    </h3>
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">৳{item.price.toLocaleString()}</span>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                  
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
