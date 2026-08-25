'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/components/cart/CartItem';
import { CouponApply } from '@/components/cart/CouponApply';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    clearCart,
    shippingMethod,
    setShippingMethod,
    getTotals,
  } = useCartStore();

  const {
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    itemCount,
    freeShippingProgress,
    amountUntilFreeShipping,
  } = getTotals();

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto text-orange-500">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Cart is Empty</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Explore our catalog of official high-performance electronics and audio equipment.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-sm font-bold shadow-lg shadow-orange-500/25 transition-all"
          >
            Browse Products (৳ BDT)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            You have <span className="text-slate-900 dark:text-white font-semibold">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors self-start sm:self-auto p-2 rounded-lg hover:bg-rose-500/10 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Clear All Items
        </button>
      </div>

      {/* Free Shipping Progress Banner in ৳ BDT */}
      <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            {amountUntilFreeShipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Congratulations! You qualified for FREE Standard Delivery!
              </span>
            ) : (
              <span className="text-slate-700 dark:text-slate-300">
                Add <strong className="text-slate-900 dark:text-white font-bold font-mono">৳{amountUntilFreeShipping.toLocaleString()}</strong> more to unlock <strong className="text-emerald-600 dark:text-emerald-400">FREE Standard Delivery</strong>
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-xl divide-y divide-slate-100 dark:divide-slate-800/80">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          {/* Delivery Options Selector in ৳ BDT */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Shipping & Delivery Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'bg-orange-500/10 border-orange-500 ring-1 ring-orange-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-1 text-orange-600 accent-[#ff4400] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Inside Dhaka (Standard)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">24-48 Hours Delivery</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {subtotal >= 50000 ? <span className="text-emerald-600 dark:text-emerald-400">FREE</span> : '৳60'}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'bg-orange-500/10 border-orange-500 ring-1 ring-orange-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-1 text-orange-600 accent-[#ff4400] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Outside Dhaka (All BD)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Nationwide 48-72 Hours Priority</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">৳120</span>
              </label>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">256-Bit SSL Checkout</span>
              <span className="text-[11px] text-slate-500">Your payments are fully encrypted</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
              <Truck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">Official Bangladesh Dispatch</span>
              <span className="text-[11px] text-slate-500">Real-time parcel live tracking</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">30-Day Money Back</span>
              <span className="text-[11px] text-slate-500">Hassle-free 100% refund policy</span>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal ({itemCount})</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Savings</span>
                  <span className="font-mono">-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono">
                  {shippingFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span> : `৳${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated VAT (5%)</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">৳{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-2 text-slate-900 dark:text-white">
              <span className="text-sm font-semibold">Total Amount</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">৳{total.toLocaleString()} BDT</span>
            </div>

            {/* Coupon Application Box */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Have a Discount Code?</label>
              <CouponApply />
            </div>

            {/* Proceed to Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm active:scale-[0.99]"
            >
              Proceed to Checkout (৳ BDT)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
