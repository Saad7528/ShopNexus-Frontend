'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  X,
  AlertCircle,
  QrCode,
  Barcode,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';

interface IOrderItem {
  title: string;
  quantity: number;
  price: number;
  sku: string;
}

interface IOrderIssue {
  category: 'address' | 'variant' | 'delay' | 'payment' | 'custom';
  title: string;
  note: string;
  reportedAt: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
}

interface IOrder {
  numericId?: number;
  isToday?: boolean;
  hasPastReturnAlert?: string;
  activeIssue?: IOrderIssue;
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: { title: string; quantity: number; price: number; sku: string }[];
  subtotal: number;
  vatTax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'bKash Online' | 'Nagad Instant' | 'Stripe Card' | 'Cash on Delivery (COD)';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  courier: string;
  trackingCode: string;
  createdAt: string;
}

const getPredefinedIssueMessage = (order: IOrder, category: string): string => {
  const customer = order.customerName || 'সম্মানিত গ্রাহক';
  switch (category) {
    case 'address':
      return `আসসালামু আলাইকুম ${customer}। ShopNexus থেকে আপনার অর্ডার #${order.orderNumber}-এর ডেলিভারি ঠিকানা/ফোন নম্বরে কিছুটা অসম্পূর্ণতা পাওয়া গেছে। কুরিয়ারে সঠিক সময়ে পার্সেল পৌঁছানোর জন্য অনুগ্রহ করে আপনার পূর্ণাঙ্গ ঠিকানা ও বিকল্প ফোন নম্বরটি রিপ্লাই দিন। ধন্যবাদ!`;
    case 'variant':
      return `আসসালামু আলাইকুম ${customer}। আপনার অর্ডার #${order.orderNumber}-এর কাঙ্ক্ষিত কালার/ভ্যারিয়েন্ট সংক্রান্ত কনফার্মেশনের জন্য যোগাযোগ করা হলো। অনুগ্রহ করে আপনার পছন্দের ভ্যারিয়েন্টটি নিশ্চিত করুন।`;
    case 'delay':
      return `আসসালামু আলাইকুম ${customer}। আপনার অর্ডার #${order.orderNumber}-এর পার্সেলটি ট্রানজিটে রয়েছে। আবহাওয়া/কুরিয়ার লোডের কারণে ডেলিভারিতে সামান্য বিলম্ব হতে পারে। দ্রুততম সময়ে ডেলিভারি নিশ্চিত করতে আমরা কাজ করছি।`;
    case 'payment':
      return `আসসালামু আলাইকুম ${customer}। আপনার অর্ডার #${order.orderNumber}-এর অনলাইন পেমেন্টটি ভেরিফিকেশন পেন্ডিং রয়েছে। অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) দিয়ে সাহায্য করুন।`;
    default:
      return `আসসালামু আলাইকুম ${customer}। আপনার ShopNexus অর্ডার #${order.orderNumber} সংক্রান্ত একটি জরুরি আপডেটের জন্য মেসেজ দেওয়া হলো।`;
  }
};

const INITIAL_ORDERS: IOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'NX-ORD-9021',
    numericId: 9021,
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.dev@gmail.com',
    customerPhone: '+880 1712-345678',
    customerAddress: 'House 42, Road 11, Banani, Dhaka-1213',
    items: [
      { title: 'Sony WH-1000XM5 Wireless ANC', quantity: 1, price: 32500, sku: 'SKU-AUD-001' },
      { title: 'Keychron Q1 Pro Custom Keyboard', quantity: 1, price: 17900, sku: 'SKU-KEY-003' },
    ],
    subtotal: 50400,
    vatTax: 3780,
    deliveryFee: 0,
    total: 54180,
    paymentMethod: 'bKash Online',
    status: 'Shipped',
    courier: 'Pathao Courier',
    trackingCode: 'TRK-NX-88219',
    createdAt: 'Today, 10:15 AM',
    isToday: true,
  },
  {
    id: 'ord-2',
    orderNumber: 'NX-ORD-9018',
    numericId: 9018,
    customerName: 'Sarah Rahman',
    customerEmail: 'sarah.audio@gmail.com',
    customerPhone: '+880 1819-876543',
    customerAddress: 'Flat 5B, Concord Tower, Gulshan-2, Dhaka',
    items: [{ title: 'Bose QuietComfort Ultra Spatial Audio', quantity: 1, price: 38900, sku: 'SKU-AUD-004' }],
    subtotal: 38900,
    vatTax: 2917,
    deliveryFee: 120,
    total: 41937,
    paymentMethod: 'Stripe Card',
    status: 'Delivered',
    courier: 'Steadfast Logistics',
    trackingCode: 'TRK-NX-77402',
    createdAt: 'Yesterday, 04:30 PM',
    isToday: false,
  },
  {
    id: 'ord-3',
    orderNumber: 'NX-ORD-9025',
    numericId: 9025,
    customerName: 'Nusrat Jahan',
    customerEmail: 'nusrat.designer@gmail.com',
    customerPhone: '+880 1911-223344',
    customerAddress: 'Sector 4, Uttara, Dhaka-1230',
    items: [
      { title: 'Apple Watch Ultra 2 Titanium', quantity: 1, price: 79900, sku: 'SKU-WR-002' },
      { title: 'Razer Viper V2 Pro Mouse', quantity: 1, price: 11900, sku: 'SKU-GAM-005' },
    ],
    subtotal: 91800,
    vatTax: 6885,
    deliveryFee: 0,
    total: 98685,
    paymentMethod: 'Nagad Instant',
    status: 'Processing',
    courier: 'RedX Logistics',
    trackingCode: 'TRK-NX-66311',
    createdAt: 'Today, 11:45 AM',
    isToday: true,
  },
  {
    id: 'ord-4',
    orderNumber: 'NX-ORD-9029',
    numericId: 9029,
    customerName: 'Mahmudul Hasan',
    customerEmail: 'mahmud.ctg@yahoo.com',
    customerPhone: '+880 1622-998877',
    customerAddress: 'Nasirabad Housing, Chittagong',
    items: [{ title: 'Shure SM7B Dynamic Studio Mic', quantity: 1, price: 36500, sku: 'SKU-CR-006' }],
    subtotal: 36500,
    vatTax: 2737,
    deliveryFee: 150,
    total: 39387,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Confirmed',
    courier: 'DHL Express',
    trackingCode: 'TRK-NX-55104',
    createdAt: 'Today, 12:10 PM',
    isToday: true,
  },
  {
    id: 'ord-5',
    orderNumber: 'NX-ORD-9031',
    numericId: 9031,
    customerName: 'Raihan Kabir',
    customerEmail: 'raihan.k@gmail.com',
    customerPhone: '+880 1711-889922',
    customerAddress: 'Dhanmondi 27, Dhaka-1209',
    items: [{ title: 'Sony WH-1000XM5 Wireless ANC', quantity: 1, price: 32500, sku: 'SKU-AUD-001' }],
    subtotal: 32500,
    vatTax: 2437,
    deliveryFee: 100,
    total: 35037,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Pending',
    courier: 'Pathao Courier',
    trackingCode: 'TRK-NX-99120',
    createdAt: 'Today, 01:20 PM',
    isToday: true,
    hasPastReturnAlert: '⚠️ Past Return Alert (2 Returns): Advance courier charge recommended',
  },
  {
    id: 'ord-6',
    orderNumber: 'NX-ORD-9032',
    numericId: 9032,
    customerName: 'Zubair Hossain',
    customerEmail: 'zubair.h@outlook.com',
    customerPhone: '+880 1755-123456',
    customerAddress: 'House 14, Road 3, Mirpur DOHS, Dhaka',
    items: [{ title: 'Keychron Q1 Pro Custom Keyboard', quantity: 1, price: 17900, sku: 'SKU-KEY-003' }],
    subtotal: 17900,
    vatTax: 1342,
    deliveryFee: 60,
    total: 19302,
    paymentMethod: 'bKash Online',
    status: 'Confirmed',
    courier: 'Steadfast Logistics',
    trackingCode: 'TRK-NX-11409',
    createdAt: 'Today, 02:40 PM',
    isToday: true,
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportingOrder, setReportingOrder] = useState<IOrder | null>(null);
  const [issueCategory, setIssueCategory] = useState<'address' | 'variant' | 'delay' | 'payment' | 'custom'>('address');
  const [issueNote, setIssueNote] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<IOrder | null>(null);

  const handleStatusChange = (orderId: string, newStatus: IOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = activeFilter === 'All' || ord.status === activeFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      ord.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingCart className="w-3.5 h-3.5" /> Order Fulfillment Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Orders & Invoicing Management</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Process customer orders, update delivery milestones, and generate 1-click printable barcode invoice slips.
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 p-1 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-xs w-full relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search order #, customer, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Order Invoice</th>
                  <th className="px-5 py-3.5">Customer & Phone</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total (৳ BDT)</th>
                  <th className="px-5 py-3.5">Payment Method</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Invoice & Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-black text-orange-600 dark:text-orange-400 block">{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{ord.createdAt}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.customerName}</div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700 dark:text-slate-300">
                            {item.quantity}x {item.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-black text-slate-900 dark:text-white text-sm">
                      ৳{ord.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none cursor-pointer ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                            : ord.status === 'Processing'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400'
                            : ord.status === 'Confirmed'
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
                        title="View & Print Barcode Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                        Invoice Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🖨️ 1-CLICK PRINTABLE BARCODE & QR INVOICE MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-4 print:shadow-none">
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black text-slate-900">Official Packing Slip & Invoice</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Letterhead */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                      SN
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">ShopNexus Official</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct Official Hardware Ecosystem<br />
                    Dhaka, Bangladesh • support@shopnexus.io
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-slate-900 block">{selectedInvoice.orderNumber}</span>
                  <span className="text-[10px] text-slate-500">Date: {selectedInvoice.createdAt}</span>
                  <div className="mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                      Payment: {selectedInvoice.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recipient Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Deliver To:</span>
                  <div className="font-bold text-slate-900">{selectedInvoice.customerName}</div>
                  <div className="text-slate-600">{selectedInvoice.customerPhone}</div>
                  <div className="text-slate-600 mt-0.5">{selectedInvoice.customerAddress}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Carrier Dispatch:</span>
                  <div className="font-bold text-slate-900">{selectedInvoice.courier}</div>
                  <div className="font-mono text-slate-600">Tracking: {selectedInvoice.trackingCode}</div>
                  <div className="text-emerald-600 font-semibold mt-0.5">Status: {selectedInvoice.status}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product Description</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price (৳ BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-900">{item.title}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{item.sku}</td>
                        <td className="p-3 text-center font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-mono font-bold">৳{item.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">৳{selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (7.5%):</span>
                    <span className="font-mono font-semibold">৳{selectedInvoice.vatTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee:</span>
                    <span className="font-mono font-semibold">৳{selectedInvoice.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-slate-900 text-sm">
                    <span>Total Amount:</span>
                    <span className="font-mono font-black text-indigo-700">৳{selectedInvoice.total.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>

              {/* Barcode & QR Code for Parcel Label */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                    Parcel Dispatch Barcode
                  </span>
                  <div className="h-10 px-4 bg-slate-100 rounded-lg flex items-center font-mono text-sm tracking-widest font-black border border-slate-300">
                    ||||| ||| |||| || ||||| | |||||
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{selectedInvoice.trackingCode}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Scan for Delivery Confirmation
                  </span>
                  <div className="inline-flex p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}