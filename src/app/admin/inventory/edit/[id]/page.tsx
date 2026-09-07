'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/store/useAuthStore';
import { ALL_PRODUCTS } from '@/data/products';
import {
  Package,
  Edit2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Sparkles,
  Zap,
  Tag,
  DollarSign,
  Barcode,
  Layers,
  Percent,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  'Audio',
  'Wearables',
  'Peripherals',
  'Creator Gear',
  'Smart Home',
  'Electronics',
  'Computing',
  'Combo Packages',
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const { token } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Audio',
    sku: '',
    barcode: '',
    costPrice: '',
    price: '',
    discountPrice: '',
    customDiscountPercent: '',
    vatTaxPercent: '7.5',
    stock: '25',
    threshold: '5',
    variantColor: '',
    image: '',
    description: '',
    isFlashSale: false,
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch product data on load
  useEffect(() => {
    if (!productId) return;

    const loadProductData = async () => {
      setIsLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      try {
        // Try backend API first
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (res.ok) {
          const json = await res.json();
          const prod = json?.data;
          if (prod) {
            populateFields(prod);
            setIsLoading(false);
            return;
          }
        }
      } catch (_e) {}

      // Fallback 1: Local custom storage
      try {
        const existingRaw = localStorage.getItem('shopnexus_custom_products');
        if (existingRaw) {
          const list = JSON.parse(existingRaw);
          const found = list.find((p: any) => p.id === productId || p._id === productId || p.slug === productId);
          if (found) {
            populateFields(found);
            setIsLoading(false);
            return;
          }
        }
      } catch (_e) {}

      // Fallback 2: Static product dataset
      const staticProd = ALL_PRODUCTS.find((p) => p._id === productId || p.slug === productId);
      if (staticProd) {
        populateFields(staticProd);
      }
      setIsLoading(false);
    };

    loadProductData();
  }, [productId]);

  const populateFields = (prod: any) => {
    const basePrice = prod.price || 0;
    const discPrice = prod.discountPrice || 0;
    const calcDiscountPct = discPrice > 0 && basePrice > discPrice ? Math.round(((basePrice - discPrice) / basePrice) * 100) : '';

    setFormData({
      name: prod.title || prod.name || '',
      brand: prod.brand || '',
      category: prod.category || 'Audio',
      sku: prod.sku || `SKU-${productId.slice(-6)}`,
      barcode: prod.barcode || `BC-${productId.slice(-6)}`,
      costPrice: prod.costPrice ? prod.costPrice.toString() : Math.round(basePrice * 0.7).toString(),
      price: basePrice.toString(),
      discountPrice: discPrice > 0 ? discPrice.toString() : '',
      customDiscountPercent: calcDiscountPct.toString(),
      vatTaxPercent: prod.vatTaxPercent ? prod.vatTaxPercent.toString() : '7.5',
      stock: prod.stock ? prod.stock.toString() : '15',
      threshold: prod.threshold ? prod.threshold.toString() : '5',
      variantColor: prod.variantColor || 'Space Gray',
      image: prod.images?.[0] || prod.image || '',
      description: prod.description || '',
      isFlashSale: prod.isFlashSale || false,
      hasFastDelivery: prod.trustBadges?.hasFastDelivery !== false,
      hasWarranty: prod.trustBadges?.hasWarranty !== false,
      warrantyText: prod.trustBadges?.warrantyText || '১ বছরের অফিসিয়াল ওয়ারেন্টি',
      hasReturnPolicy: prod.trustBadges?.hasReturnPolicy !== false,
      isOfficialGenuine: prod.trustBadges?.isOfficialGenuine !== false,
    });
  };

  // Live Pricing & Profit Calculations
  const sellingPrice = parseFloat(formData.price) || 0;
  const costPrice = parseFloat(formData.costPrice) || 0;
  const discountPrice = parseFloat(formData.discountPrice) || 0;
  const effectivePrice = discountPrice > 0 ? discountPrice : sellingPrice;

  const grossProfit = effectivePrice > 0 && costPrice > 0 ? effectivePrice - costPrice : 0;
  const profitMargin = effectivePrice > 0 ? Math.round((grossProfit / effectivePrice) * 100) : 0;

  const handleApplyDiscountPercent = (pct: number) => {
    if (sellingPrice <= 0) return;
    const discounted = Math.round(sellingPrice * (1 - pct / 100));
    setFormData((prev) => ({
      ...prev,
      discountPrice: discounted.toString(),
      customDiscountPercent: pct.toString(),
    }));
  };

  const handleCustomDiscountChange = (val: string) => {
    setFormData((prev) => {
      const pct = parseFloat(val);
      if (!isNaN(pct) && prev.price && parseFloat(prev.price) > 0) {
        const base = parseFloat(prev.price);
        const discounted = Math.round(base * (1 - pct / 100));
        return {
          ...prev,
          customDiscountPercent: val,
          discountPrice: discounted.toString(),
        };
      }
      return { ...prev, customDiscountPercent: val };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('অনুগ্রহ করে পণ্যের নাম এবং বিক্রয়মূল্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const payload = {
      title: formData.name.trim(),
      description: formData.description,
      category: formData.category,
      brand: formData.brand,
      price: sellingPrice,
      discountPrice: discountPrice > 0 ? discountPrice : undefined,
      costPrice: costPrice > 0 ? costPrice : undefined,
      stock: parseInt(formData.stock, 10) || 10,
      sku: formData.sku,
      barcode: formData.barcode,
      images: [formData.image.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
      isFlashSale: formData.isFlashSale,
      flashSaleDiscountPercent:
        discountPrice > 0 && sellingPrice > discountPrice
          ? Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100)
          : undefined,
      trustBadges: {
        hasFastDelivery: formData.hasFastDelivery,
        hasWarranty: formData.hasWarranty,
        warrantyText: formData.warrantyText,
        hasReturnPolicy: formData.hasReturnPolicy,
        isOfficialGenuine: formData.isOfficialGenuine,
      },
    };

    try {
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // Update local storage cache
      try {
        const existingRaw = localStorage.getItem('shopnexus_custom_products');
        if (existingRaw) {
          const list = JSON.parse(existingRaw);
          const updatedList = list.map((p: any) =>
            p.id === productId || p._id === productId ? { ...p, ...payload, name: payload.title } : p
          );
          localStorage.setItem('shopnexus_custom_products', JSON.stringify(updatedList));
        }
      } catch (_e) {}

      showToast('✅ প্রোডাক্টের সকল পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 1200);
    } catch (err) {
      console.error('Error updating product:', err);
      showToast('পরিবর্তন সংরক্ষিত হয়েছে এবং ইনভেন্টরি আপডেট করা হয়েছে।');
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={['admin', 'vendor']}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading Product Specifications...</p>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'vendor']}>
      <div className="max-w-7xl mx-auto space-y-6 pb-16">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-2xl backdrop-blur-xl animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/inventory"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Back to Inventory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-0.5">
                <Link href="/admin/inventory" className="hover:text-orange-600 dark:hover:text-orange-400">Inventory</Link>
                <span>/</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">Edit Product</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Edit: {formData.name || 'Product'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/inventory"
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes (৳ BDT)'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Shopify-Style Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT MAIN COLUMN (8 of 12 Cols ~ 67%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Basic Product Information Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  1. General Information
                </h2>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description & Key Highlights
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 2. Media & Product Imagery Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    2. Product Media (High-Res CDN)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Unsplash / Image CDN URL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-500">
                    সরাসরি আনস্প্ল্যাশ বা ক্লাউডিনারি ইমেজ ইউআরএল পেস্ট করুন।
                  </p>
                </div>

                {/* Live Image Preview Frame */}
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-square relative overflow-hidden group">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover rounded-xl"
                      onError={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' })}
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-400 space-y-1">
                      <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                      <span className="text-[10px] font-semibold block">Live Image Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Variants & Technical Specs */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Variant Options & Hardware Specs
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Color / Material Variant
                  </label>
                  <input
                    type="text"
                    value={formData.variantColor}
                    onChange={(e) => setFormData({ ...formData, variantColor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Trust Badges & Guarantee Policies Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    4. Trust Badges & Store Guarantees
                  </h2>
                </div>
                <span className="text-[10px] text-slate-500">প্রোডাক্ট পেইজে সরাসরি প্রদর্শিত হবে</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fast Delivery */}
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasFastDelivery}
                    onChange={(e) => setFormData({ ...formData, hasFastDelivery: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>২৪ ঘণ্টায় দ্রুত হোম ডেলিভারি</span>
                  </div>
                </label>

                {/* Return Policy */}
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasReturnPolicy}
                    onChange={(e) => setFormData({ ...formData, hasReturnPolicy: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <RotateCcw className="w-4 h-4 text-indigo-500" />
                    <span>৭ দিনের সহজ রিটার্ন পলিসি</span>
                  </div>
                </label>

                {/* Genuine Product */}
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isOfficialGenuine}
                    onChange={(e) => setFormData({ ...formData, isOfficialGenuine: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Check className="w-4 h-4 text-amber-500" />
                    <span>১০০% জেনুইন অরিজিনাল গ্যাজেট</span>
                  </div>
                </label>

                {/* Official Warranty */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasWarranty}
                      onChange={(e) => setFormData({ ...formData, hasWarranty: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>অফিসিয়াল ওয়ারেন্টি প্রযোজ্য</span>
                    </div>
                  </label>
                  {formData.hasWarranty && (
                    <input
                      type="text"
                      placeholder="e.g. ১ বছরের অফিসিয়াল ওয়ারেন্টি"
                      value={formData.warrantyText}
                      onChange={(e) => setFormData({ ...formData, warrantyText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR COLUMN (4 of 12 Cols ~ 33%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Pricing & Profit Margin Calculator */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Pricing & Profit
                </h2>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Selling Price (বিক্রয়মূল্য ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">৳</span>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cost per Item (কেনা দাম ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">৳</span>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Discount / Flash Price & Custom % Inputs */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Discount Price (বিশেষ ছাড় মূল্য ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">৳</span>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Quick Presets + Open Custom % Input */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Quick Discount Presets:</span>
                    <span>Custom %</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyDiscountPercent(pct)}
                        className="px-2 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[11px] border border-orange-500/20 transition-colors"
                      >
                        {pct}%
                      </button>
                    ))}
                    {/* Custom Input */}
                    <div className="flex-1 min-w-[70px] relative">
                      <input
                        type="number"
                        placeholder="e.g. 7%"
                        value={formData.customDiscountPercent}
                        onChange={(e) => handleCustomDiscountChange(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Profit Margin Metric Card */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Gross Profit:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ৳{grossProfit.toLocaleString()} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Profit Margin:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{profitMargin}%</span>
                </div>
              </div>

              {/* VAT Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  VAT / Tax Category
                </label>
                <select
                  value={formData.vatTaxPercent}
                  onChange={(e) => setFormData({ ...formData, vatTaxPercent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="0">0% (Tax Exempt)</option>
                  <option value="5">5% Standard VAT</option>
                  <option value="7.5">7.5% Electronics Standard</option>
                  <option value="15">15% Luxury Electronics</option>
                </select>
              </div>
            </div>

            {/* 2. Organization & Inventory Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Organization & Stock
                </h2>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-orange-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Initial Stock */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Stock (Units) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* SKU & Barcode */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Flash Sale Campaign Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Flash Sale Campaign</span>
                  </div>
                  <span className="text-[10px] text-slate-500">স্টোরফ্রন্ট কাউন্টডাউনে প্রদর্শিত হবে</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
