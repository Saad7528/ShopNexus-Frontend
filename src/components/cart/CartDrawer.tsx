'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { CartItem } from './CartItem';
import { X, ShoppingBag, ArrowRight, Sparkles, Truck } from 'lucide-react';

import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeDrawer, items, getTotals } = useCartStore();
  const { t, language } = useLanguageStore();
  const orders = useOrderStore((state) => state.orders);
  const isFirstOrder = orders.length === 0;

  const { subtotal, discount, shippingFee, itemCount, freeShippingProgress, amountUntilFreeShipping } = getTotals();

  const firstOrderDiscount = isFirstOrder ? Math.round(subtotal * 0.10) : 0;
  const effectiveDiscount = isFirstOrder ? firstOrderDiscount : discount;
  const discountedSubtotal = Math.max(0, subtotal - effectiveDiscount);
  const tax = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + shippingFee + tax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-md transition-all duration-300"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('cart_title')}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? toBengaliNumber(itemCount) : itemCount} {itemCount === 1 ? t('cart_item_selected') : t('cart_items_selected')}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  {amountUntilFreeShipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {t('cart_free_delivery_unlocked')}
                    </span>
                  ) : (
                    <span>
                      {language === 'bn' ? (
                        <>ফ্রি ডেলিভারি পেতে আরও <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(amountUntilFreeShipping, 'bn')}</strong> যোগ করুন</>
                      ) : (
                        <>Add <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(amountUntilFreeShipping, 'en')}</strong> more for <strong>FREE Delivery</strong></>
                      )}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                  {language === 'bn' ? toBengaliNumber(freeShippingProgress) : freeShippingProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    freeShippingProgress >= 100
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-[#ff4400] to-[#ff7700]'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-600 dark:text-orange-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">{t('cart_empty_title')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  {t('cart_empty_desc')}
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all"
                >
                  {t('btn_continue_shopping')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.productId} item={item} />)
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{t('cart_subtotal')}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono">{formatCurrency(subtotal, language)}</span>
                </div>
                {isFirstOrder && firstOrderDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {language === 'bn' ? 'প্রথম অর্ডার ১০% ছাড়' : 'First Order 10% Off'}
                    </span>
                    <span className="font-mono font-bold">-{formatCurrency(firstOrderDiscount, language)}</span>
                  </div>
                )}
                {!isFirstOrder && discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Coupon Discount'}</span>
                    <span className="font-mono">-{formatCurrency(discount, language)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('cart_delivery_fee')}</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-900 dark:text-slate-200 font-mono'}>
                    {shippingFee === 0 ? (language === 'bn' ? 'ফ্রি' : 'FREE') : formatCurrency(shippingFee, language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart_vat')}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono">{formatCurrency(tax, language)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  <span>{t('cart_total_due')}</span>
                  <span className="text-orange-600 dark:text-orange-400 font-black text-lg font-mono">{formatCurrency(total, language)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition-colors"
                >
                  {t('btn_view_full_cart')}
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all"
                >
                  {t('btn_checkout')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
