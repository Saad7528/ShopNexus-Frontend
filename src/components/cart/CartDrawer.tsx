'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from './CartItem';
import { X, ShoppingBag, ArrowRight, Sparkles, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeDrawer, items, getTotals } = useCartStore();
  const { subtotal, discount, shippingFee, tax, total, itemCount, freeShippingProgress, amountUntilFreeShipping } = getTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400">{itemCount} {itemCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                  {amountUntilFreeShipping === 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> You unlocked FREE Standard Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-white font-mono">৳{amountUntilFreeShipping.toLocaleString()}</strong> more for <strong>FREE Delivery</strong>
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-indigo-400">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    freeShippingProgress >= 100
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
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
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-white">Your cart is currently empty</p>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  Browse our high-performance catalog and add products to start your order.
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Explore Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.productId} item={item} />)
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200 font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-200 font-mono'}>
                    {shippingFee === 0 ? 'FREE' : `৳${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated VAT (5%)</span>
                  <span className="font-semibold text-slate-200 font-mono">৳{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-indigo-400 font-black text-lg font-mono">৳{total.toLocaleString()} BDT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold text-center transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Checkout
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
