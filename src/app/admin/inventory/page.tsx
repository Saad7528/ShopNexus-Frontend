'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

interface IInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<IInventoryItem[]>([
    {
      id: 'inv-1',
      sku: 'SKU-AUD-001',
      name: 'Nexus Pro Wireless ANC Headphones',
      category: 'Audio',
      price: 299.99,
      stock: 45,
      threshold: 10,
    },
    {
      id: 'inv-2',
      sku: 'SKU-WR-002',
      name: 'Ultra Titanium Smartwatch Series 9',
      category: 'Wearables',
      price: 399.00,
      stock: 4, // Low stock
      threshold: 10,
    },
    {
      id: 'inv-3',
      sku: 'SKU-KEY-003',
      name: 'Mechanical RGB Gaming Keyboard (Linear Switches)',
      category: 'Peripherals',
      price: 149.50,
      stock: 3, // Low stock
      threshold: 8,
    },
    {
      id: 'inv-4',
      sku: 'SKU-AUD-004',
      name: 'Studio True Wireless ANC Earbuds (Hi-Res Audio)',
      category: 'Audio',
      price: 179.99,
      stock: 82,
      threshold: 15,
    },
    {
      id: 'inv-5',
      sku: 'SKU-DISP-005',
      name: 'Curved OLED UltraWide Gaming Monitor 34"',
      category: 'Displays',
      price: 899.00,
      stock: 12,
      threshold: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  const startEdit = (item: IInventoryItem) => {
    setEditingId(item.id);
    setEditStockValue(item.stock);
  };

  const saveEdit = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: editStockValue } : item))
    );
    setEditingId(null);
  };

  const lowStockCount = inventory.filter((item) => item.stock <= item.threshold).length;

  const filteredInventory = inventory.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/dashboard"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-3xl font-black text-white">Stock & Inventory Management</h1>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Real-time product variant stock tracking, SKU monitoring, and replenishment alerts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lowStockCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  {lowStockCount} Critical Low Stock Alerts
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by SKU, product name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Inventory Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">SKU Code</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Unit Price</th>
                    <th className="px-6 py-4">Current Stock</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInventory.map((item) => {
                    const isLow = item.stock <= item.threshold;
                    const isEditing = editingId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-indigo-300">{item.sku}</td>
                        <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                        <td className="px-6 py-4 text-xs text-slate-400">{item.category}</td>
                        <td className="px-6 py-4 font-mono text-white">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStockValue}
                              onChange={(e) => setEditStockValue(Number(e.target.value))}
                              className="w-20 px-2 py-1 rounded bg-slate-800 border border-indigo-500 text-white font-mono text-sm focus:outline-none"
                            />
                          ) : (
                            <span className="font-mono font-bold text-white text-base">{item.stock} units</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => saveEdit(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Adjust
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
