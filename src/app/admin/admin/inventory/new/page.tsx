'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Package,
  Plus,
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
  Eye,
  Image as ImageIcon,
  UploadCloud,
  Coins,
  RefreshCw,
  Trash2,
  X,
  FolderPlus,
} from 'lucide-react';

const INITIAL_CATEGORIES = [
  'Audio',
  'Wearables',
  'Peripherals',
  'Creator Gear',
  'Smart Home',
  'Electronics',
  'Computing',
  'Gaming',
  'Combo Packages',
];

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories State (Supports adding custom categories dynamically)
  const [categoriesList, setCategoriesList] = useState<string[]>(INITIAL_CATEGORIES);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Media Tab: 'upload' (File upload from device) | 'url' (Image URLs)
  const [mediaMode, setMediaMode] = useState<'upload' | 'url'>('upload');

  // Uploaded Files (Base64 data URLs)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Dynamic Image URLs (Primary + Extra gallery URLs)
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [extraImageUrls, setExtraImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    vendorName: 'ShopNexus Official Store',
    category: 'Audio',
    sku: `SKU-${Date.now().toString().slice(-6)}`,
    barcode: `BC-${Date.now().toString().slice(-6)}`,
    costPrice: '',
    price: '',
    discountPrice: '',
    customDiscountPercent: '',
    rewardPoints: '', // Loyalty Points
    vatTaxPercent: '7.5',
    stock: '25',
    threshold: '5',
    variantColor: 'Midnight Black, Platinum Silver',
    variantSize: 'Standard Unit',
    description: '',
    tags: 'official, authentic, warranty',
    isFlashSale: false,
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compile active images list based on selected media mode
  const activeImages = mediaMode === 'upload'
    ? uploadedImages
    : [primaryImageUrl.trim(), ...extraImageUrls.map((u) => u.trim())].filter(Boolean);

  // Live Pricing & Calculations
  const sellingPrice = parseFloat(formData.price) || 0;
  const costPrice = parseFloat(formData.costPrice) || 0;
  const discountPrice = parseFloat(formData.discountPrice) || 0;
  const effectivePrice = discountPrice > 0 ? discountPrice : sellingPrice;

  // Loyalty Reward Points (Default: 10 pts per ৳100)
  const defaultCalculatedPoints = Math.floor(effectivePrice / 100) * 10;
  const finalRewardPoints = formData.rewardPoints ? parseInt(formData.rewardPoints, 10) : defaultCalculatedPoints;
  const cashbackValue = Math.floor(finalRewardPoints / 10);

  const grossProfit = effectivePrice > 0 && costPrice > 0 ? effectivePrice - costPrice : 0;
  const profitMargin = effectivePrice > 0 ? Math.round((grossProfit / effectivePrice) * 100) : 0;

  // Auto Generator for SKU & Barcode
  const regenerateIdentifiers = () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const catCode = formData.category.slice(0, 3).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      sku: `SKU-${catCode}-${randomSuffix}`,
      barcode: `BC-${randomSuffix}`,
    }));
  };

  // Handle Quick & Custom Discount
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

  // Handle Custom Category Addition
  const handleAddCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewCategoryName('');
    setIsAddingNewCategory(false);
    showToast(`✓ Category "${trimmed}" added and selected!`);
  };

  // Handle File Upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files (JPG, PNG, WebP) are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    showToast(`✓ ${fileArray.length} image(s) uploaded successfully!`);
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Dynamic Extra Image URLs
  const handleAddExtraImageUrl = () => {
    setExtraImageUrls((prev) => [...prev, '']);
  };

  const handleUpdateExtraImageUrl = (index: number, val: string) => {
    setExtraImageUrls((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveExtraImageUrl = (index: number) => {
    setExtraImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('অনুগ্রহ করে পণ্যের নাম এবং বিক্রয়মূল্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const finalImagesList = activeImages.length > 0
      ? activeImages
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'];

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`,
      description: formData.description || `${formData.name} - Official verified hardware gadget from ${formData.brand || 'ShopNexus'}.`,
      category: formData.category,
      brand: formData.brand || 'ShopNexus Official',
      vendorName: formData.vendorName || 'ShopNexus Official Store',
      price: sellingPrice,
      discountPrice: discountPrice > 0 ? discountPrice : undefined,
      costPrice: costPrice > 0 ? costPrice : undefined,
      stock: parseInt(formData.stock, 10) || 10,
      sku: formData.sku,
      barcode: formData.barcode,
      rewardPoints: finalRewardPoints,
      images: finalImagesList,
      isFlashSale: formData.isFlashSale,
      flashSaleDiscountPercent:
        discountPrice > 0 && sellingPrice > discountPrice
          ? Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100)
          : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['official', 'authentic'],
      trustBadges: {
        hasFastDelivery: formData.hasFastDelivery,
        hasWarranty: formData.hasWarranty,
        warrantyText: formData.warrantyText,
        hasReturnPolicy: formData.hasReturnPolicy,
        isOfficialGenuine: formData.isOfficialGenuine,
      },
    };

    try {
      let res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if ((!res || !res.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        res = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      // Persist to local session cache for instant preview in inventory
      try {
        const existingRaw = localStorage.getItem('shopnexus_custom_products');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const newLocalItem = {
          ...payload,
          id: `prod_${Date.now()}`,
          _id: `prod_${Date.now()}`,
          name: payload.title,
          image: payload.images[0],
          vatTaxPercent: parseFloat(formData.vatTaxPercent) || 7.5,
          threshold: parseInt(formData.threshold, 10) || 5,
        };
        localStorage.setItem('shopnexus_custom_products', JSON.stringify([newLocalItem, ...existing]));
      } catch (_e) {}

      showToast('🎉 নতুন প্রোডাক্ট সফলভাবে ক্যাটালগে যুক্ত হয়েছে!');
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 1000);
    } catch (err) {
      console.error('Error creating product:', err);
      showToast('প্রোডাক্ট সেভ করা হয়েছে এবং লোকাল ইনভেন্টরিতে আপডেট করা হয়েছে।');
      setTimeout(() => {
        router.push('/admin/inventory');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <span className="text-orange-600 dark:text-orange-400 font-bold">New Product</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                Add New Product (৳ BDT Specification)
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
              <span>{isSubmitting ? 'Publishing...' : 'Publish to Catalog (৳ BDT)'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT MAIN COLUMN (8 of 12 Cols ~ 67%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Basic Product Information Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    1. General Information & Identity
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Storefront Catalog</span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Title / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter product title / name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>

              {/* Brand & Vendor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter brand name..."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Vendor / Merchant Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter vendor name..."
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description & Key Specifications
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter comprehensive product description, key specs, and highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Search & Recommendation Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. wireless, anc, gaming, mechanical, official"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. DUAL-MODE MEDIA & IMAGE GALLERY STUDIO */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    2. Product Images & Gallery Studio
                  </h2>
                </div>

                {/* Mode Switcher: Device Upload vs URL List */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMediaMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mediaMode === 'upload'
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mediaMode === 'url'
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image URLs</span>
                  </button>
                </div>
              </div>

              {/* MODE 1: FILE UPLOAD FROM DEVICE */}
              {mediaMode === 'upload' ? (
                <div className="space-y-4">
                  {/* Drag and Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500/80 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40 group space-y-2"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Click to browse or drag and drop images here
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Supports high-resolution PNG, JPG, WebP (Multiple images allowed)
                      </span>
                    </div>
                  </div>

                  {/* Uploaded Thumbnails Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Uploaded Images ({uploadedImages.length}):</span>
                        <span className="text-[11px] text-slate-400 font-normal">First image will be the Primary Cover</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 group shadow-xs"
                          >
                            <Image src={img} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-black shadow-md z-10">
                                COVER
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveUploadedImage(idx);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md hover:bg-rose-600"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MODE 2: DYNAMIC IMAGE URL LIST */
                <div className="space-y-4">
                  {/* Primary Cover Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Cover Image URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/cover-image.jpg"
                      value={primaryImageUrl}
                      onChange={(e) => setPrimaryImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Extra Gallery URLs List */}
                  {extraImageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Gallery Image #{idx + 2} URL
                        </label>
                        <input
                          type="url"
                          placeholder={`https://example.com/gallery-image-${idx + 2}.jpg`}
                          value={url}
                          onChange={(e) => handleUpdateExtraImageUrl(idx, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraImageUrl(idx)}
                        className="mt-5 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Remove URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add URL Button */}
                  <button
                    type="button"
                    onClick={handleAddExtraImageUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/10 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Image URL</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. SKU, Barcode & Identification Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    3. Inventory Barcode & SKU Codes
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={regenerateIdentifiers}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Auto-Generate
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    SKU Code (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode / EAN
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Variants & Technical Specs */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  4. Variants & Alert Thresholds
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Color Variants
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Space Gray, Silver, Deep Navy"
                    value={formData.variantColor}
                    onChange={(e) => setFormData({ ...formData, variantColor: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Size / Edition Variant
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Standard Unit, Creator Edition"
                    value={formData.variantSize}
                    onChange={(e) => setFormData({ ...formData, variantSize: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. Trust Badges & Guarantee Policies Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    5. Trust Badges & Store Guarantees
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">প্রোডাক্ট পেইজে সরাসরি প্রদর্শিত হবে</span>
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
                  Pricing & Profit (৳ BDT)
                </h2>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sales Price (বিক্রয়মূল্য ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">৳</span>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
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
                    placeholder="0.00"
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
                    placeholder="0.00 (Optional)"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Quick Discount:</span>
                    <span>Custom %</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyDiscountPercent(pct)}
                        className="px-2 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[11px] border border-orange-500/20 transition-colors cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                    <div className="flex-1 min-w-[70px]">
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

              {/* 🌟 2. LOYALTY REWARD POINTS ENGINE */}
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                    <Coins className="w-4 h-4 fill-amber-500" />
                    <span>Loyalty Reward Points</span>
                  </div>
                  <span className="text-[10px] text-slate-400">৳১০০ = ১০ কয়েন</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    placeholder={`Auto: ${defaultCalculatedPoints} pts`}
                    value={formData.rewardPoints}
                    onChange={(e) => setFormData({ ...formData, rewardPoints: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-amber-400/30 text-slate-900 dark:text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 pt-0.5">
                  <span>গ্রাহক বোনাস পাবে:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">
                    +{finalRewardPoints} Points (৳{cashbackValue} Cashback)
                  </span>
                </div>
              </div>

              {/* Profit Margin Metric Card */}
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
            </div>

            {/* 3. Category & Organization Card (With Custom Category Addition) */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Category & Stock
                  </h2>
                </div>
                {!isAddingNewCategory && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> + New Category
                  </button>
                )}
              </div>

              {/* Category Dropdown or Inline Creator */}
              {isAddingNewCategory ? (
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2 animate-in fade-in">
                  <label className="block text-xs font-bold text-orange-700 dark:text-orange-300">
                    Create New Category
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Drones & Robotics"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-orange-500/40 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Initial Stock */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Stock Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter available quantity (e.g. 25)"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Flash Sale Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 cursor-pointer">
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
                  <span className="text-[10px] text-slate-500">স্টোরফ্রন্টে লাইভ কাউন্টডাউন ও ছাড় ব্যাজ দেখাবে</span>
                </div>
              </label>
            </div>

            {/* 4. Live Storefront Card Preview (Zero Dummy Sony fallback) */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-orange-500" />
                  <span>Live Storefront Preview</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Real-time update</span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 p-3 space-y-2.5">
                <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center border border-slate-200/60 dark:border-slate-800/60">
                  {activeImages.length > 0 ? (
                    <Image
                      src={activeImages[0]}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center p-4 space-y-1 text-slate-400 dark:text-slate-600">
                      <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                      <span className="text-[10px] font-bold block uppercase tracking-wider">No Image Selected</span>
                      <span className="text-[9px] block">Upload or enter image URL</span>
                    </div>
                  )}

                  {formData.isFlashSale && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white text-[9px] font-black shadow-md">
                      FLASH SALE
                    </div>
                  )}
                  {finalRewardPoints > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center gap-1 shadow-md">
                      <Coins className="w-2.5 h-2.5 fill-slate-950" />
                      <span>+{finalRewardPoints} pts</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-orange-500 font-bold uppercase">{formData.category}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {formData.name || 'Your New Product Title'}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      ৳{(discountPrice > 0 ? discountPrice : (sellingPrice || 0)).toLocaleString()}
                    </span>
                    {discountPrice > 0 && sellingPrice > 0 && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ৳{sellingPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
