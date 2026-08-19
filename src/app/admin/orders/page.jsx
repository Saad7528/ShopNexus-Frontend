'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OrderStatusBadge, OrderStatus } from '@/components/admin/OrderStatusBadge';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

interface IAdminOrderView {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  itemsCount: number;
  shippingCity: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IAdminOrderView[]>([
    {
      id: 'ord-101',
      orderNumber: 'NEX-892147',
      customerName: 'S.M. Amirul Islam Saad',
      customerEmail: 'saad@shopnexus.io',
      date: '2026-08-18 14:32',
      total: 299.99,
      paymentMethod: 'Stripe (Card)',
      paymentStatus: 'paid',
      orderStatus: 'processing',
      itemsCount: 1,
      shippingCity: 'Dhaka',
    },
    {
      id: 'ord-102',
      orderNumber: 'NEX-892148',
      customerName: 'Asmual Obaidul Hoque',
      customerEmail: 'obaidul@hexadevs.com',
      date: '2026-08-18 16:15',
      total: 798.00,
      paymentMethod: 'bKash MFS',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      itemsCount: 2,
      shippingCity: 'Chittagong',
    },
    {
      id: 'ord-103',
      orderNumber: 'NEX-892149',
      customerName: 'MD Shariar Kabir',
      customerEmail: 'shariar@shopnexus.io',
      date: '2026-08-18 19:40',
      total: 149.50,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      itemsCount: 1,
      shippingCity: 'Sylhet',
    },
    {
      id: 'ord-104',
      orderNumber: 'NEX-892150',
      customerName: 'Shamim Khan',
      customerEmail: 'shamim@shopnexus.io',
      date: '2026-08-17 11:20',
      total: 450.00,
      paymentMethod: 'Stripe (Card)',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      itemsCount: 3,
      shippingCity: 'Rajshahi',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = filterStatus === 'all' || ord.orderStatus === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
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
              <h1 className="text-3xl font-black text-white">Order Fulfillment & Logistics</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Track, inspect, and update customer order lifecycle and fulfillment statuses in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              {orders.length} Total Orders
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Lifecycle Status</th>
                  <th className="px-6 py-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-xs text-slate-400">{ord.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{ord.date}</td>
                    <td className="px-6 py-4 text-xs">{ord.shippingCity}</td>
                    <td className="px-6 py-4 font-mono font-bold text-white">${ord.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-white">{ord.paymentMethod}</div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          ord.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        ● {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={ord.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="pending">Set Pending</option>
                        <option value="processing">Set Processing</option>
                        <option value="shipped">Set Shipped</option>
                        <option value="delivered">Set Delivered</option>
                        <option value="cancelled">Set Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
