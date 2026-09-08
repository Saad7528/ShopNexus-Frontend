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
import { useAuthStore } from '@/store/useAuthStore';

function InventoryContent() {
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
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
  const [isSyncing, setIsSyncing] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch live products from MongoDB on mount (Vercel serverless & local compatible)
  React.useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        let res = await fetch('/api/products?limit=100').catch(() => null);
        if ((!res || !res.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          res = await fetch(`${API_URL}/products?limit=100`).catch(() => null);
        }
        if (!res || !res.ok) return;
        const data = await res.json().catch(() => null);
        if (data?.data?.products && Array.isArray(data.data.products) && data.data.products.length > 0) {
          const mapped: IInventoryItem[] = data.data.products.map((p: any) => ({
            id: p._id || p.id,
            sku: p.variants?.[0]?.sku || `SKU-${p._id?.toString().slice(-4) || '101'}`,
            barcode: `BC-${p._id?.toString().slice(-6) || '202'}`,
            name: p.title || p.name,
            category: p.category || 'Audio',
            brand: p.brand || 'ShopNexus Official',
            costPrice: Math.round((p.price || 5000) * 0.7),
            price: p.price || 0,
            discountPrice: p.discountPrice,
            vatTaxPercent: 7.5,
            stock: p.stock ?? 20,
            threshold: 5,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            isFlashSale: !!p.isFlashSale,
            variantColor: p.variants?.[0]?.name || 'Standard',
            slug: p.slug || p._id || p.id,
            hasFastDelivery: true,
            hasWarranty: true,
            warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
            hasReturnPolicy: true,
            isOfficialGenuine: true,
          }));

          // Merge live DB products with default catalog so nothing is lost
          setInventory((prev) => {
            const existingIds = new Set(mapped.map((m) => m.id));
            const remainingDefault = prev.filter((p) => !existingIds.has(p.id));
            return [...mapped, ...remainingDefault];
          });
        }
      } catch (_err) {
        // Fallback gracefully without throwing unhandled exceptions
      }
    };

    fetchLiveProducts();
  }, [API_URL]);

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

  const saveQuickStock = async (id: string) => {
    // Optimistic UI update
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: editStockValue } : item))
    );
    setEditingId(null);
    showFeedback('Stock quantity updated in real-time!', 'success');

    // Async DB update
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stock: editStockValue }),
      });
    } catch (e) {
      console.error('Failed to sync stock change with DB:', e);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the live catalog?`)) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      showFeedback(`Removed "${name}" from catalog.`, 'delete');

      // Async DB deletion
      try {
        await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } catch (e) {
        console.error('Failed to delete from live DB:', e);
      }
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

  const handleSaveFullEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductModal) return;

    const updated = { ...editingProductModal };
    setInventory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    showFeedback(`Product "${updated.name}" updated successfully!`, 'success');
    setEditingProductModal(null);

    // Async DB update
    try {
      await fetch(`${API_URL}/products/${updated.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: updated.name,
          category: updated.category,
          brand: updated.brand,
          price: updated.price,
          discountPrice: updated.discountPrice,
          stock: updated.stock,
          isFlashSale: updated.isFlashSale,
        }),
      });
    } catch (err) {
      console.error('Failed to sync edit with live DB:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
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

    // Async DB creation
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: itemToAdd.name,
          category: itemToAdd.category,
          brand: itemToAdd.brand,
          price: itemToAdd.price,
          discountPrice: itemToAdd.discountPrice,
          stock: itemToAdd.stock,
          images: [itemToAdd.image],
          description: newProduct.description || `${itemToAdd.name} - Genuine product with official warranty`,
          isFlashSale: itemToAdd.isFlashSale,
          variants: [
            {
              sku: itemToAdd.sku,
              name: itemToAdd.variantColor || 'Standard',
              price: itemToAdd.price,
              stock: itemToAdd.stock,
            },
          ],
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData?.data?.product?._id) {
          setInventory((prev) =>
            prev.map((it) => (it.id === itemToAdd.id ? { ...it, id: resData.data.product._id } : it))
          );
        }
      }
    } catch (err) {
      console.error('Failed to persist new product to DB:', err);
    }
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

            <Link
              href="/admin/inventory/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Add Product (৳ BDT)
            </Link>
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
                  <th className="px-5 py-3.5 text-right min-w-[210px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredInventory.map((item) => {
                  const isLow = item.stock <= item.threshold;
                  const isQuickStock = editingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
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

                          {/* 🌟 FULL PRODUCT EDIT BUTTON (Dedicated Route) */}
                          <Link
                            href={`/admin/inventory/edit/${item.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 hover:bg-orange-500/20 dark:hover:bg-orange-500/25 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            title="Edit All Product Details"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Edit
                          </Link>

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
