'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Edit2,
  Save,
  Plus,
  Trash2,
  X,
  Sparkles,
  Package,
  DollarSign,
  Tag,
  Layers,
  Barcode,
  Layers2,
  Globe,
  Sliders,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
} from 'lucide-react';

interface IInventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  costPrice: number;
  price: number;
  discountPrice?: number;
  vatTaxPercent: number;
  stock: number;
  threshold: number;
  image: string;
  isFlashSale?: boolean;
  variantColor?: string;
  slug: string;
  // Trust Badges & Policy Options
  hasFastDelivery?: boolean;
  hasWarranty?: boolean;
  warrantyText?: string;
  hasReturnPolicy?: boolean;
  isOfficialGenuine?: boolean;
}

const INITIAL_INVENTORY: IInventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'SKU-AUD-001',
    barcode: 'BC-880192',
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    category: 'Audio',
    brand: 'Sony',
    costPrice: 28000,
    price: 38500,
    discountPrice: 32500,
    vatTaxPercent: 7.5,
    stock: 45,
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    isFlashSale: true,
    variantColor: 'Silver & Black',
    slug: 'sony-wh-1000xm5-wireless-anc',
  },
  {
    id: 'inv-2',
    sku: 'SKU-WR-002',
    barcode: 'BC-880193',
    name: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
    category: 'Wearables',
    brand: 'Apple',
    costPrice: 65000,
    price: 88900,
    discountPrice: 79900,
    vatTaxPercent: 7.5,
    stock: 4, // Low stock
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    isFlashSale: true,
    variantColor: 'Titanium Loop',
    slug: 'apple-watch-ultra-2-titanium',
  },
  {
    id: 'inv-3',
    sku: 'SKU-KEY-003',
    barcode: 'BC-880194',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Peripherals',
    brand: 'Keychron',
    costPrice: 14000,
    price: 21500,
    discountPrice: 17900,
    vatTaxPercent: 5,
    stock: 3, // Low stock
    threshold: 8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    isFlashSale: true,
    variantColor: 'Carbon Gray',
    slug: 'keychron-q1-pro-wireless-custom',
  },
  {
    id: 'inv-4',
    sku: 'SKU-AUD-004',
    barcode: 'BC-880195',
    name: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    category: 'Audio',
    brand: 'Bose',
    costPrice: 32000,
    price: 44500,
    discountPrice: 38900,
    vatTaxPercent: 7.5,
    stock: 28,
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    isFlashSale: false,
    variantColor: 'White Smoke',
    slug: 'bose-qc-ultra-spatial-headphones',
  },
  {
    id: 'inv-5',
    sku: 'SKU-GAM-005',
    barcode: 'BC-880196',
    name: 'Razer Viper V2 Pro Ultra-Lightweight Wireless Mouse',
    category: 'Gaming',
    brand: 'Razer',
    costPrice: 9500,
    price: 15500,
    discountPrice: 11900,
    vatTaxPercent: 5,
    stock: 15,
    threshold: 5,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    isFlashSale: true,
    variantColor: 'Matte Black',
    slug: 'razer-viper-v2-pro-wireless',
  },
  {
    id: 'inv-6',
    sku: 'SKU-CR-006',
    barcode: 'BC-880197',
    name: 'Shure SM7B Cardioid Dynamic Vocal Studio Microphone',
    category: 'Creator Gear',
    brand: 'Shure',
    costPrice: 29000,
    price: 42000,
    discountPrice: 36500,
    vatTaxPercent: 7.5,
    stock: 12,
    threshold: 5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    isFlashSale: true,
    variantColor: 'Studio Black',
    slug: 'shure-sm7b-dynamic-microphone',
  },
];

const CATEGORIES = [
  'Audio',
  'Wearables',
  'Peripherals',
  'Gaming',
  'Smart Home',
  'Creator Gear',
  'Accessories',
  'Apparel',
];

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function InventoryContent() {
  const searchParams = useSearchParams();
  const [inventory, setInventory] = useState<IInventoryItem[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'low-stock' | 'flash'>(
    searchParams.get('filter') === 'low-stock' ? 'low-stock' : 'all'
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductModal, setEditingProductModal] = useState<IInventoryItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'delete' } | null>(null);

  // Sync with URL query param if user arrives via link
  React.useEffect(() => {
    if (searchParams.get('filter') === 'low-stock') {
      setActiveFilter('low-stock');
    }
  }, [searchParams]);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: `SKU-${Date.now().toString().slice(-4)}`,
    barcode: `BC-${Date.now().toString().slice(-6)}`,
    category: 'Audio',
    brand: '',
    costPrice: '',
    price: '',
    discountPrice: '',
    vatTaxPercent: '7.5',
    stock: '25',
    threshold: '5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    variantColor: 'Default Black',
    metaTitle: '',
    metaDescription: '',
    isFlashSale: false,
    description: '',
    // Trust Badges & Guarantee Policies
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  });

  const showFeedback = (text: string, type: 'success' | 'delete' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const startQuickStock = (item: IInventoryItem) => {
    setEditingId(item.id);
    setEditStockValue(item.stock);
  };

  const saveQuickStock = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: editStockValue } : item))
    );
    setEditingId(null);
    showFeedback('Stock quantity updated in real-time!', 'success');
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the live catalog?`)) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      showFeedback(`Removed "${name}" from catalog.`, 'delete');
    }
  };

  const handleOpenEditModal = (item: IInventoryItem) => {
    setEditingProductModal({
      ...item,
      hasFastDelivery: item.hasFastDelivery ?? true,
      hasWarranty: item.hasWarranty ?? true,
      warrantyText: item.warrantyText || '১ বছরের অফিসিয়াল ওয়ারেন্টি',
      hasReturnPolicy: item.hasReturnPolicy ?? true,
      isOfficialGenuine: item.isOfficialGenuine ?? true,
    });
  };

  const handleSaveFullEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductModal) return;

    setInventory((prev) =>
      prev.map((item) => (item.id === editingProductModal.id ? editingProductModal : item))
    );
    showFeedback(`Product "${editingProductModal.name}" updated successfully!`, 'success');
    setEditingProductModal(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide product title and sales price.');
      return;
    }

    const itemToAdd: IInventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newProduct.sku || `SKU-GEN-${Date.now().toString().slice(-3)}`,
      barcode: newProduct.barcode || `BC-${Date.now().toString().slice(-6)}`,
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand || 'ShopNexus Official',
      costPrice: parseFloat(newProduct.costPrice) || 5000,
      price: parseFloat(newProduct.price) || 8500,
      discountPrice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : undefined,
      vatTaxPercent: parseFloat(newProduct.vatTaxPercent) || 7.5,
      stock: parseInt(newProduct.stock) || 20,
      threshold: parseInt(newProduct.threshold) || 5,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      variantColor: newProduct.variantColor,
      isFlashSale: newProduct.isFlashSale,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      hasFastDelivery: newProduct.hasFastDelivery,
      hasWarranty: newProduct.hasWarranty,
      warrantyText: newProduct.warrantyText,
      hasReturnPolicy: newProduct.hasReturnPolicy,
      isOfficialGenuine: newProduct.isOfficialGenuine,
    };

    setInventory([itemToAdd, ...inventory]);
    setIsAddModalOpen(false);
    showFeedback(`Product "${itemToAdd.name}" published to catalog in ৳ BDT!`, 'success');

    // Reset Form
    setNewProduct({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      barcode: `BC-${Date.now().toString().slice(-6)}`,
      category: 'Audio',
      brand: '',
      costPrice: '',
      price: '',
      discountPrice: '',
      vatTaxPercent: '7.5',
      stock: '25',
      threshold: '5',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      variantColor: 'Default Black',
      metaTitle: '',
      metaDescription: '',
      isFlashSale: false,
      description: '',
      hasFastDelivery: true,
      hasWarranty: true,
      warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
      hasReturnPolicy: true,
      isOfficialGenuine: true,
    });
  };

  const lowStockCount = inventory.filter((item) => item.stock <= item.threshold).length;
  const flashSaleCount = inventory.filter((item) => item.isFlashSale).length;

  const filteredInventory = inventory.filter((item) => {
    if (activeFilter === 'low-stock' && item.stock > item.threshold) return false;
    if (activeFilter === 'flash' && !item.isFlashSale) return false;

    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Products & Inventory Manager</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Add and edit catalog products with Bangladeshi Taka (৳ BDT) pricing, cost margins, variants, and barcodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('low-stock')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'low-stock'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockCount} Low Stock Alerts
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add Product (৳ BDT)
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {feedbackMsg.text}
          </div>
        )}

        {/* Active Low Stock Alert Banner */}
        {activeFilter === 'low-stock' && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Filtering {filteredInventory.length} Low Stock Item(s)
                </span>
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Stock is at or below threshold level. You can quickly replenish quantities below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Products ({inventory.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('low-stock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'low-stock'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock ({lowStockCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('flash')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'flash'
                  ? 'bg-orange-500 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-500'
              }`}
            >
              Flash Sales ({flashSaleCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md w-full relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by SKU, Barcode, Product name, Brand, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Product & Variant</th>
                  <th className="px-5 py-3.5">SKU / Barcode</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Sales Price (৳)</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right min-w-52.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredInventory.map((item) => {
                  const isLow = item.stock <= item.threshold;
                  const isQuickStock = editingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{item.brand} • {item.variantColor || 'Standard'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px]">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold block">{item.sku}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{item.barcode}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        ৳{item.price.toLocaleString()}
                        {item.discountPrice && (
                          <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            Sale: ৳{item.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isQuickStock ? (
                          <input
                            type="number"
                            value={editStockValue}
                            onChange={(e) => setEditStockValue(Number(e.target.value))}
                            className="w-20 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border-2 border-orange-500 text-slate-900 dark:text-white font-mono text-xs focus:outline-none shadow-xs"
                          />
                        ) : (
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{item.stock} pcs</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* Quick Stock Save / Edit */}
                          {isQuickStock ? (
                            <button
                              type="button"
                              onClick={() => saveQuickStock(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startQuickStock(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                              title="Quick Stock Update"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Stock
                            </button>
                          )}

                          {/* 🌟 FULL PRODUCT EDIT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 hover:bg-orange-500/20 dark:hover:bg-orange-500/25 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            title="Edit All Product Details"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Edit
                          </button>

                          {/* Delete Product */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item.id, item.name)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌟 1. FULL-FEATURED EDIT PRODUCT MODAL */}
        {editingProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit Product Specification (৳ BDT)</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Update pricing, cost margin, variants, stock, barcode, and flash sale</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFullEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Product Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProductModal.name}
                      onChange={(e) =>
                        setEditingProductModal({ ...editingProductModal, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingProductModal.category}
                      onChange={(e) =>
                        setEditingProductModal({ ...editingProductModal, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={editingProductModal.brand}
                      onChange={(e) =>
                        setEditingProductModal({ ...editingProductModal, brand: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={editingProductModal.sku}
                      onChange={(e) =>
                        setEditingProductModal({ ...editingProductModal, sku: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Barcode */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Barcode Label
                    </label>
                    <input
                      type="text"
                      value={editingProductModal.barcode}
                      onChange={(e) =>
                        setEditingProductModal({ ...editingProductModal, barcode: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Cost Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Cost per Item (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={editingProductModal.costPrice}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          costPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Selling Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Sales Price (৳ BDT) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProductModal.price}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Discount / Flash Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Discount Price (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={editingProductModal.discountPrice || ''}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          discountPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* VAT / Tax Class */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      VAT / Tax Class
                    </label>
                    <select
                      value={editingProductModal.vatTaxPercent}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          vatTaxPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    >
                      <option value="0">0% (Tax Exempt)</option>
                      <option value="5">5% Standard VAT</option>
                      <option value="7.5">7.5% Electronics VAT</option>
                      <option value="15">15% Luxury Class</option>
                    </select>
                  </div>

                  {/* Current Stock */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Current Stock (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProductModal.stock}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Variant Option */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Variant (Color/Size)
                    </label>
                    <input
                      type="text"
                      value={editingProductModal.variantColor || ''}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          variantColor: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Image CDN URL */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Product Image CDN URL
                    </label>
                    <input
                      type="url"
                      value={editingProductModal.image}
                      onChange={(e) =>
                        setEditingProductModal({
                          ...editingProductModal,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Trust Badges & Guarantees Configuration */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-500" /> Trust Badges & Guarantee Policies (স্টোরে প্রদর্শিত সুবিধা)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">যেসব অপশন সিলেক্ট করবেন কেবল সেগুলোই কাস্টমার পেইজে দেখাবে</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* 1. Fast Delivery */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProductModal.hasFastDelivery !== false}
                        onChange={(e) =>
                          setEditingProductModal({
                            ...editingProductModal,
                            hasFastDelivery: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Truck className="w-3.5 h-3.5 text-orange-500" />
                        <span>২৪ ঘণ্টায় দ্রুত হোম ডেলিভারি</span>
                      </div>
                    </label>

                    {/* 2. Return Policy */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProductModal.hasReturnPolicy !== false}
                        onChange={(e) =>
                          setEditingProductModal({
                            ...editingProductModal,
                            hasReturnPolicy: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                        <span>৭ দিনের সহজ রিটার্ন পলিসি</span>
                      </div>
                    </label>

                    {/* 3. Genuine Product */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProductModal.isOfficialGenuine !== false}
                        onChange={(e) =>
                          setEditingProductModal({
                            ...editingProductModal,
                            isOfficialGenuine: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Check className="w-3.5 h-3.5 text-amber-500" />
                        <span>১০০% জেনুইন অরিজিনাল প্রোডাক্ট</span>
                      </div>
                    </label>

                    {/* 4. Warranty Option & Text */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProductModal.hasWarranty !== false}
                          onChange={(e) =>
                            setEditingProductModal({
                              ...editingProductModal,
                              hasWarranty: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>অফিসিয়াল ওয়ারেন্টি প্রযোজ্য</span>
                        </div>
                      </label>
                      {editingProductModal.hasWarranty !== false && (
                        <input
                          type="text"
                          placeholder="e.g. ১ বছরের অফিসিয়াল ওয়ারেন্টি"
                          value={editingProductModal.warrantyText || '১ বছরের অফিসিয়াল ওয়ারেন্টি'}
                          onChange={(e) =>
                            setEditingProductModal({
                              ...editingProductModal,
                              warrantyText: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[11px] focus:outline-none focus:border-orange-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="editFlashSaleToggle"
                    checked={editingProductModal.isFlashSale || false}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        isFlashSale: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="editFlashSaleToggle" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Enable Flash Sale Promotion Campaign (Shows with Live Countdown)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProductModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
                  >
                    Save All Changes (৳ BDT)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🌟 2. FULL-FEATURED ADD PRODUCT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Add New Product (৳ Taka Specification)</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Enter pricing, cost per item, variants, SEO metadata, and barcodes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Product Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony WH-1000XM5 Wireless ANC Headphones"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="Sony, Apple, Keychron"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Barcode */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Barcode Label
                    </label>
                    <input
                      type="text"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Cost Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Cost per Item (৳ BDT)
                    </label>
                    <input
                      type="number"
                      placeholder="28000"
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Selling Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Sales Price (৳ BDT) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="38500"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Discount / Flash Price (৳) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Discount Price (৳ BDT)
                    </label>
                    <input
                      type="number"
                      placeholder="32500"
                      value={newProduct.discountPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* VAT / Tax */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      VAT / Tax Class
                    </label>
                    <select
                      value={newProduct.vatTaxPercent}
                      onChange={(e) => setNewProduct({ ...newProduct, vatTaxPercent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    >
                      <option value="0">0% (Tax Exempt)</option>
                      <option value="5">5% Standard VAT</option>
                      <option value="7.5">7.5% Electronics VAT</option>
                      <option value="15">15% Luxury Class</option>
                    </select>
                  </div>

                  {/* Initial Stock */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Initial Stock (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Variant Option */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Variant (Color/Size)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Space Gray, Titanium"
                      value={newProduct.variantColor}
                      onChange={(e) => setNewProduct({ ...newProduct, variantColor: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Product Image CDN URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Trust Badges & Guarantees Configuration */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-500" /> Trust Badges & Guarantee Policies (স্টোরে প্রদর্শিত সুবিধা)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">যেসব অপশন সিলেক্ট করবেন কেবল সেগুলোই কাস্টমার পেইজে দেখাবে</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* 1. Fast Delivery */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={newProduct.hasFastDelivery}
                        onChange={(e) => setNewProduct({ ...newProduct, hasFastDelivery: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Truck className="w-3.5 h-3.5 text-orange-500" />
                        <span>২৪ ঘণ্টায় দ্রুত হোম ডেলিভারি</span>
                      </div>
                    </label>

                    {/* 2. Return Policy */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={newProduct.hasReturnPolicy}
                        onChange={(e) => setNewProduct({ ...newProduct, hasReturnPolicy: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                        <span>৭ দিনের সহজ রিটার্ন পলিসি</span>
                      </div>
                    </label>

                    {/* 3. Genuine Product */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-orange-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={newProduct.isOfficialGenuine}
                        onChange={(e) => setNewProduct({ ...newProduct, isOfficialGenuine: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Check className="w-3.5 h-3.5 text-amber-500" />
                        <span>১০০% জেনুইন অরিজিনাল প্রোডাক্ট</span>
                      </div>
                    </label>

                    {/* 4. Warranty Option & Text */}
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newProduct.hasWarranty}
                          onChange={(e) => setNewProduct({ ...newProduct, hasWarranty: e.target.checked })}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>অফিসিয়াল ওয়ারেন্টি প্রযোজ্য</span>
                        </div>
                      </label>
                      {newProduct.hasWarranty && (
                        <input
                          type="text"
                          placeholder="e.g. ১ বছরের অফিসিয়াল ওয়ারেন্টি"
                          value={newProduct.warrantyText}
                          onChange={(e) => setNewProduct({ ...newProduct, warrantyText: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[11px] focus:outline-none focus:border-orange-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="addFlashSaleToggle"
                    checked={newProduct.isFlashSale}
                    onChange={(e) => setNewProduct({ ...newProduct, isFlashSale: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="addFlashSaleToggle" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Enable Flash Sale Promotion Campaign (Shows with Live Countdown)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
                  >
                    Publish to Catalog (৳ BDT)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading Inventory Data...</p>
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
