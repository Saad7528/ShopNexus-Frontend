'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { AddressSelector, IShippingAddressForm } from '@/components/checkout/AddressSelector';
import { PaymentMethodSelector, PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [shippingAddress, setShippingAddress] = useState<IShippingAddressForm>({
    fullName: 'S.M. Amirul Islam Saad',
    phoneNumber: '+880 1712-345678',
    streetAddress: 'House 42, Road 11, Banani Block-D',
    city: 'Dhaka',
    state: 'Dhaka Division',
    zipCode: '1213',
    country: 'Bangladesh',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 150 || items.length === 0 ? 0 : 15;
  const tax = subtotal * 0.05;
  const total = subtotal + shippingFee + tax;

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      const mockOrderId = `NEX-${Date.now().toString().slice(-6)}`;
      router.push(`/checkout/success?orderId=${mockOrderId}&total=${total.toFixed(2)}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" /> End-to-End SSL Encrypted
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {[
            { step: 1, label: 'Shipping', icon: MapPin },
            { step: 2, label: 'Payment', icon: CreditCard },
            { step: 3, label: 'Review', icon: CheckCircle2 },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => isDone && setCurrentStep(s.step as 1 | 2 | 3)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : isDone
                    ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/40 border-white/5 text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-black'
                      : isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : s.step}
                </div>
                <span className="text-xs font-semibold">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Checkout Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Flow Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {currentStep === 1 && (
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" /> 1. Shipping Address & Contact
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Select or confirm where you want your order delivered.
                  </p>
                </div>

                <AddressSelector
                  currentAddress={shippingAddress}
                  onAddressChange={(newAddr) => setShippingAddress(newAddr)}
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" /> 2. Payment Gateway
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Choose your preferred secure payment method.
                  </p>
                </div>

                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onSelect={(method) => setPaymentMethod(method)}
                />

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Review Order Summary <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 3. Review & Place Order
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Please review all details carefully before finalizing your order.
                  </p>
                </div>

                {/* Review Details Summary */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-800/40 border border-white/5 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-500">Deliver To</span>
                      <p className="font-bold text-white mt-0.5">{shippingAddress.fullName}</p>
                      <p className="text-xs text-slate-400">
                        {shippingAddress.streetAddress}, {shippingAddress.city}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      Change
                    </button>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-500">Payment Gateway</span>
                      <p className="font-bold text-white mt-0.5 capitalize">
                        {paymentMethod.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    Back to Payment
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCompleteOrder}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Authorizing & Placing...' : `Confirm & Place Order ($${total.toFixed(2)})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-6">
              <h3 className="text-lg font-bold text-white">Order Items ({items.length})</h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-500">No items currently in checkout.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-semibold text-white truncate max-w-xs">{item.title}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="font-mono font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Shipping</span>
                  <span className="font-mono text-white">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-base font-black text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-xl text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
