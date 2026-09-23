'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';
import { ALL_PRODUCTS, getProductByIdOrSlug } from '@/data/products';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { products: storeProducts, fetchProducts } = useProductStore();
  const { t, language } = useLanguageStore();
  const mounted = useHydrated();

  // Background SWR revalidation
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [addedCartId, setAddedCartId] = useState<string | null>(null);

  const handleMoveToCart = (item: (typeof items)[0], stockCount: number) => {
    if (stockCount <= 0) return;
    addItem({
      productId: item.productId || item.id,
      title: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: stockCount,
      vendorName: 'ShopNexus Official',
    });
    setAddedCartId(item.id);
    setTimeout(() => {
      setAddedCartId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 md:p-10">
      <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[85vw] min-[2560px]:max-w-[75vw] min-[4000px]:max-w-[70vw] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {mounted ? t('wishlist_title') : 'My Wishlist'}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/30">
                {mounted && language === 'bn' ? `${toBengaliNumber(items.length)} টি সংরক্ষিত পণ্য` : `${items.length} Saved Items`}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {mounted && language === 'bn'
                ? 'পরবর্তীতে ক্রয়ের জন্য আপনার পছন্দের হার্ডওয়্যার ও গ্যাজেট সংরক্ষণ করে রাখুন।'
                : 'Keep track of products you want to buy later or wait for price drops.'}
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> {mounted && language === 'bn' ? 'সব মুছুন' : 'Clear All Saved'}
            </button>
          )}
        </div>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {mounted ? (language === 'bn' ? 'আপনার উইশলিস্ট খালি' : 'Your wishlist is empty') : 'Your wishlist is empty'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              {mounted ? t('wishlist_empty') : 'Explore our trending tech catalog and save items you want to keep an eye on.'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {mounted ? t('btn_explore_products') : 'Explore Catalog'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const normalize = (str?: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const normItemTitle = normalize(item.name || item.title);
              const normItemSlug = normalize(item.slug);
              const normItemId = normalize(item.id || item.productId);

              // 1. Check reactive real-time store products (instant from admin edits & cache)
              const activeProd =
                storeProducts.find((p) => {
                  const normPTitle = normalize(p.title || (p as any).name);
                  const normPSlug = normalize(p.slug);
                  const normPId = normalize(p._id);
                  return Boolean(
                    (normItemId && (normItemId === normPId || normItemId === normPSlug)) ||
                    (normItemSlug && (normItemSlug === normPSlug || normItemSlug === normPId)) ||
                    (normItemTitle && normPTitle && (normItemTitle === normPTitle || normPTitle.includes(normItemTitle) || normItemTitle.includes(normPTitle)))
                  );
                }) ||
                getProductByIdOrSlug(item.productId || item.slug || item.id) ||
                ALL_PRODUCTS.find((p) => {
                  const normPTitle = normalize(p.title || (p as any).title_en);
                  const normPSlug = normalize(p.slug);
                  const normPId = normalize(p._id);
                  return Boolean(
                    (normItemId && (normItemId === normPId || normItemId === normPSlug)) ||
                    (normItemSlug && (normItemSlug === normPSlug || normItemSlug === normPId)) ||
                    (normItemTitle && normPTitle && (normItemTitle === normPTitle || normPTitle.includes(normItemTitle) || normItemTitle.includes(normPTitle)))
                  );
                });

              const availableStock = activeProd?.stock !== undefined
                ? Number(activeProd.stock)
                : typeof item.stock === 'number'
                ? item.stock
                : item.inStock === false
                ? 0
                : 10;
              const isOutOfStock = availableStock <= 0;
              const isJustAdded = addedCartId === item.id;

              return (
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
                      {isOutOfStock && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-rose-600/95 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <AlertCircle className="w-3 h-3" />
                          <span>{mounted && language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title={mounted && language === 'bn' ? 'মুছুন' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {item.category}
                    </span>
                    <Link href={`/products/${item.slug || item.productId || item.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mt-1">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {mounted ? formatCurrency(item.price, language) : `৳${item.price.toLocaleString()}`}
                    </span>

                    {isOutOfStock ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-200 dark:border-slate-700 select-none opacity-80"
                        title={mounted && language === 'bn' ? 'এই পণ্যটি বর্তমানে স্টকে নেই' : 'This product is currently out of stock'}
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{mounted && language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item, availableStock)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                            : 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white shadow-orange-500/20'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>
                          {isJustAdded
                            ? (mounted && language === 'bn' ? 'কার্টে যুক্ত হয়েছে!' : 'Added to Cart!')
                            : (mounted ? t('btn_move_to_cart') : 'Move to Cart')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
