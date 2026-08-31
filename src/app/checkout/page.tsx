'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AddressSelector, IShippingAddressForm, validateSmartShippingAddress } from '@/components/checkout/AddressSelector';
import { PaymentMethodSelector, PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import { MfsPaymentModal } from '@/components/checkout/MfsPaymentModal';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Truck,
  Building2,
  Smartphone,
  MessageSquare,
  AlertCircle,
  UserCheck,
  Sparkles,
  Percent,
  Tag,
  Check,
  Clock,
  Award,
  Coins,
  Crown,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated, spendCoins, useVipDiscount } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);

  // Coins & VIP State
  const [useCoinsChecked, setUseCoinsChecked] = useState(false);
  const availableCoins = user?.nexusCoins || 0;
  const coinsDiscount = useCoinsChecked && availableCoins >= 50 ? Math.floor(availableCoins / 50) * 5 : 0;
  const coinsSpent = useCoinsChecked ? availableCoins : 0;

  // VIP First Order discount: ৳200 flat off if user.isVipMember && !user.vipFirstOrderUsed
  const isVipEligible = !!user?.isVipMember && !user?.vipFirstOrderUsed;
  const vipDiscount = isVipEligible ? 200 : 0;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [shippingAddress, setShippingAddress] = useState<IShippingAddressForm>({
    fullName: user?.name || '',
    phoneNumber: user?.phoneNumber || '+880 1',
    streetAddress: user?.address || '',
    city: user?.city || 'Dhaka',
    state: 'Dhaka Division',
    zipCode: user?.zipCode || '1213',
    country: 'Bangladesh',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mfs_bkash_nagad');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMfsModalOpen, setIsMfsModalOpen] = useState(false);
  const [mfsProvider, setMfsProvider] = useState<'bkash' | 'nagad'>('bkash');
  const [smsNotificationToast, setSmsNotificationToast] = useState<{
    phone: string;
    msg: string;
  } | null>(null);

  // First Order Logic: Has the user placed any orders before?
  const [addressError, setAddressError] = useState<string | null>(null);

  const validateAddress = (addr: IShippingAddressForm): boolean => {
    const res = validateSmartShippingAddress(addr);
    if (!res.isValid) {
      setAddressError(res.nameError || res.phoneError || res.addressError || 'Invalid address');
      return false;
    }
    setAddressError(null);
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateAddress(shippingAddress)) {
      setAddressError(null);
      setCurrentStep(2);
    }
  };

  const isFirstOrder = orders.length === 0;

  // Coupon state for returning users
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Dynamic delivery fee calculation: Inside Dhaka ৳60, Outside Dhaka ৳120
  const deliveryFee = deliveryZone === 'inside_dhaka' ? 60 : 120;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 10% First order automatic discount
  const firstOrderDiscount = isFirstOrder ? Math.round(subtotal * 0.10) : 0;
  const discountAmount = isFirstOrder ? firstOrderDiscount : appliedCouponDiscount;
  const totalDiscounts = discountAmount + coinsDiscount + vipDiscount;
  const discountedSubtotal = Math.max(0, subtotal - totalDiscounts);

  const vatTax = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + deliveryFee + vatTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFirstOrder) return;
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEXUS10') {
      setAppliedCouponDiscount(Math.round(subtotal * 0.10));
    } else if (code === 'SAVE15') {
      setAppliedCouponDiscount(Math.round(subtotal * 0.15));
    } else {
      setCouponError('Invalid coupon code. Try NEXUS10 or SAVE15.');
    }
  };

  const handleMfsPaymentSuccess = (trxId: string) => {
    setIsMfsModalOpen(false);
    completeOrderFinal(trxId);
  };

  const handleInitiateOrder = () => {
    if (paymentMethod === 'mfs_bkash_nagad') {
      setIsMfsModalOpen(true);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        completeOrderFinal('COD-VERIFIED');
      }, 1200);
    }
  };

  const completeOrderFinal = (trxId: string) => {
    const mockOrderId = `NX-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Show simulated SMS alert
    setSmsNotificationToast({
      phone: shippingAddress.phoneNumber,
      msg: `ShopNexus Order #${mockOrderId} Confirmed! Total ৳${total.toLocaleString()} BDT. Trx: ${trxId}. Delivery via Pathao Express.`,
    });

    // Persist order to useOrderStore for customer order history
    const newOrderObj = {
      id: `ord_${Date.now()}`,
      orderNumber: mockOrderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: items.map((it, idx) => ({
        id: `item_${idx}`,
        name: it.title,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      })),
      subtotal,
      shipping: deliveryFee,
      tax: vatTax,
      total,
      paymentMethod:
        paymentMethod === 'mfs_bkash_nagad'
          ? `${mfsProvider === 'bkash' ? 'bKash' : 'Nagad'} Instant (${trxId})`
          : paymentMethod === 'cash_on_delivery'
          ? 'Cash on Delivery (COD)'
          : 'Stripe Card (PAID)',
      paymentStatus: (paymentMethod === 'cash_on_delivery' ? 'PENDING' : 'PAID') as 'PAID' | 'PENDING',
      status: 'CONFIRMED' as const,
      trackingNumber: `TRK-NX-${Math.floor(10000 + Math.random() * 90000)}`,
      carrier: deliveryZone === 'inside_dhaka' ? 'Pathao Courier Express' : 'Steadfast Logistics',
      estimatedDelivery: deliveryZone === 'inside_dhaka' ? 'Tomorrow, within 24h' : 'Within 48-72h',
      shippingAddress: `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.country}`,
    };

    // Save to persistent customer order history
    useOrderStore.getState().addOrder(newOrderObj);

    // Deduct redeemed Nexus coins if applied
    if (useCoinsChecked && coinsSpent > 0) {
      spendCoins(coinsSpent);
    }

    // Mark VIP welcome discount as used
    if (isVipEligible) {
      useVipDiscount();
    }

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?orderId=${mockOrderId}&total=${total}&trx=${trxId}`);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>

        {/* 📱 Simulated Live SMS Toast Notification */}
        {smsNotificationToast && (
          <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>SMS Dispatch Alert</span>
                </div>
                <span className="text-[10px] text-slate-400">Just Now</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{smsNotificationToast.msg}</p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" /> Sent to {smsNotificationToast.phone}
              </div>
            </div>
          </div>
        )}

        {/* Multi-Step Indicator Header */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {[
            { step: 1, label: 'Delivery Zone & Address' },
            { step: 2, label: 'Payment Gateway' },
            { step: 3, label: 'Confirm & Place Order' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => isDone && setCurrentStep(s.step as any)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold shadow-md shadow-orange-500/10'
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
            {/* STEP 1: Shipping Address & Delivery Zone Calculator */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" /> 1. Shipping Address & Delivery Zone
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Select your delivery destination zone for automatic courier fee calculation.
                  </p>
                </div>

                {/* 🚚 Automatic Delivery Fee Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Select Delivery Zone (Automatic Charge Calculation)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliveryZone('inside_dhaka')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        deliveryZone === 'inside_dhaka'
                          ? 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Inside Dhaka City
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">৳60 BDT</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Fast delivery within 24-48 Hours via Pathao Express Courier.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliveryZone('outside_dhaka')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        deliveryZone === 'outside_dhaka'
                          ? 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Outside Dhaka (All BD)
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">৳120 BDT</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Nationwide delivery within 48-72 Hours via Steadfast / RedX.
                      </p>
                    </div>
                  </div>
                </div>

                <AddressSelector
                  currentAddress={shippingAddress}
                  onAddressChange={(newAddr) => setShippingAddress(newAddr)}
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-white"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Gateway Selector */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" /> 2. Payment Gateway
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Select your preferred gateway: Instant bKash / Nagad or Cash on Delivery.
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
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Back to Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-white"
                  >
                    Review Order Summary <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Final Verification & Order Placement */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 3. Final Verification & Dispatch
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Please review your shipping and billing details before completing order.
                  </p>
                </div>

                {/* 10% First Order Highlight Notice */}
                {isFirstOrder && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      <span>🎉 প্রথম অর্ডার বিশেষ উপহার: ১০% ছাড় যুক্ত হয়েছে!</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      স্বাগতম! আপনার প্রথম অর্ডারের মোট মূল্য থেকে স্বয়ংক্রিয়ভাবে <strong className="text-emerald-600 dark:text-emerald-400">১০% (৳{firstOrderDiscount.toLocaleString()} BDT)</strong> কেটে নেওয়া হয়েছে।
                    </p>
                  </div>
                )}

                {/* Summary Review Cards */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">Recipient & Address</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{shippingAddress.fullName}</p>
                      <p className="text-slate-500">{shippingAddress.streetAddress}, {shippingAddress.city}</p>
                      <p className="text-slate-500 font-mono">{shippingAddress.phoneNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">Payment Gateway</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {paymentMethod === 'mfs_bkash_nagad'
                          ? `${mfsProvider === 'bkash' ? 'bKash' : 'Nagad'} Mobile Financial Wallet`
                          : paymentMethod === 'cash_on_delivery'
                          ? 'Cash on Delivery (COD)'
                          : 'Stripe Card'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Back to Payment
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleInitiateOrder}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer text-white"
                  >
                    {isProcessing
                      ? 'Verifying & Confirming...'
                      : `Confirm & Place Order (৳${total.toLocaleString()} BDT)`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary ({items.length} Items)</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-500">No items currently in cart.</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon / First Order Benefit Section */}
              {isFirstOrder ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> প্রথম অর্ডার ১০% ছাড়
                    </span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                      -৳{firstOrderDiscount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    🔒 প্রথম অর্ডারে স্বয়ংক্রিয়ভাবে ১০% ছাড় সক্রিয় থাকায় অতিরিক্ত কুপন লক করা আছে।
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-500" /> Have a Coupon Code?
                  </span>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. NEXUS10"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
                  {appliedCouponDiscount > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Coupon applied! Saved ৳{appliedCouponDiscount.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Nexus Coins & VIP Member Discount Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* 1. VIP Member ৳200 Welcome Perk */}
                {isVipEligible && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/30 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> VIP মেম্বারশিপ স্পেশাল ছাড়
                    </span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                      -৳200
                    </span>
                  </div>
                )}

                {/* 2. Nexus Coins Redeem Toggle (50 Coins = ৳5 Off) */}
                {availableCoins >= 50 && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={useCoinsChecked}
                          onChange={(e) => setUseCoinsChecked(e.target.checked)}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <span>Nexus Coins রিডিম করুন ({availableCoins.toLocaleString()} Coins আছে)</span>
                      </label>
                      {useCoinsChecked && coinsDiscount > 0 && (
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                          -৳{coinsDiscount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                      🪙 প্রতি ৫০ কয়েনে ৫ টাকা ক্যাশ ডিসকাউন্ট (অর্ডার শেষে ব্যালান্স ০ হয়ে যাবে)
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">৳{subtotal.toLocaleString()}</span>
                </div>

                {isFirstOrder && firstOrderDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>First Order Discount (10%)</span>
                    <span className="font-mono font-bold">-৳{firstOrderDiscount.toLocaleString()}</span>
                  </div>
                )}

                {!isFirstOrder && appliedCouponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">-৳{appliedCouponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {vipDiscount > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                    <span>VIP Member Welcome Perk</span>
                    <span className="font-mono font-bold">-৳{vipDiscount}</span>
                  </div>
                )}

                {coinsDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Nexus Coins Discount ({coinsSpent} Coins)</span>
                    <span className="font-mono font-bold">-৳{coinsDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>
                    Delivery Charge ({deliveryZone === 'inside_dhaka' ? 'Dhaka ৳60' : 'Outside ৳120'})
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">৳{deliveryFee}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated VAT (5%)</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">৳{vatTax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-xl text-orange-600 dark:text-orange-400">৳{total.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 MFS BKASH / NAGAD PAYMENT SIMULATION MODAL */}
      <MfsPaymentModal
        isOpen={isMfsModalOpen}
        onClose={() => setIsMfsModalOpen(false)}
        onSuccess={handleMfsPaymentSuccess}
        amount={total}
        provider={mfsProvider}
        customerPhone={shippingAddress.phoneNumber}
      />
    </div>
  );
}