'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/components/cart/CartItem';
import { CouponApply } from '@/components/cart/CouponApply';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function CartPage() {
  const { items, clearCart, getTotals } = useCartStore();
  const { subtotal, discount, tax, total, itemCount } = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Shopping Cart is Empty</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Looks like you haven&apos;t added any items yet. Explore our fresh collection and find something you love.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-400 mt-1">Review and manage the items in your order</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="divide-y divide-slate-800/80">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Secure SSL Checkout</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-indigo-400" />
              <span>Express Delivery Available</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-indigo-400" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm text-slate-300 pb-4 border-b border-slate-800">
              <div className="flex justify-between">
                <span>Items ({itemCount})</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-semibold text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-4 text-white">
              <span className="text-base font-medium">Total Amount</span>
              <span className="text-2xl font-extrabold text-indigo-400">${total.toFixed(2)}</span>
            </div>

            {/* Coupon Application Box */}
            <div className="mb-6">
              <CouponApply />
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
