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
  MessageSquare,
  MessageCircle,
  AlertTriangle,
  Layers,
  Calendar,
  Download,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  ExternalLink,
  Send,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Copy,
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
  id: string;
  orderNumber: string;
  numericId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: IOrderItem[];
  subtotal: number;
  vatTax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'bKash Online' | 'Nagad Instant' | 'Stripe Card' | 'Cash on Delivery (COD)';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  courier: string;
  trackingCode: string;
  createdAt: string;
  isToday?: boolean;
  hasPastReturnAlert?: string;
  activeIssue?: IOrderIssue;
}

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
  
  // Selection State for Batch Invoicing
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<IOrder | null>(null);
  const [isBatchInvoiceModalOpen, setIsBatchInvoiceModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  
  // Customer Issue Reporting State
  const [reportingOrder, setReportingOrder] = useState<IOrder | null>(null);
  const [issueCategory, setIssueCategory] = useState<'address' | 'variant' | 'delay' | 'payment' | 'custom'>('address');
  const [issueNote, setIssueNote] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  
  // Range Filter State
  const [rangeStart, setRangeStart] = useState('9018');
  const [rangeEnd, setRangeEnd] = useState('9032');

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

  // Filter logic
  const filteredOrders = orders.filter((ord) => {
    if (activeFilter === 'Today') {
      if (!ord.isToday) return false;
    } else if (activeFilter === 'TodayConfirmed') {
      if (!ord.isToday || (ord.status !== 'Confirmed' && ord.status !== 'Processing')) return false;
    } else if (activeFilter !== 'All') {
      if (ord.status !== activeFilter) return false;
    }

    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      ord.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Batch Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1-Click Quick Select Presets
  const selectTodayAllOrders = () => {
    const todayOrders = orders.filter((o) => o.isToday);
    setSelectedOrderIds(todayOrders.map((o) => o.id));
    setActiveFilter('Today');
  };

  const selectTodayConfirmedOrders = () => {
    const confirmedToday = orders.filter((o) => o.isToday && (o.status === 'Confirmed' || o.status === 'Processing'));
    setSelectedOrderIds(confirmedToday.map((o) => o.id));
    setActiveFilter('TodayConfirmed');
  };

  const handleSelectRange = () => {
    const startNum = parseInt(rangeStart) || 0;
    const endNum = parseInt(rangeEnd) || 999999;
    const min = Math.min(startNum, endNum);
    const max = Math.max(startNum, endNum);

    const matched = orders.filter((o) => o.numericId >= min && o.numericId <= max);
    if (matched.length === 0) {
      alert(`No orders found in range #${min} to #${max}`);
      return;
    }
    setSelectedOrderIds(matched.map((o) => o.id));
  };

  // Customer Issue Reporting
  const getPredefinedIssueMessage = (ord: IOrder, cat: string) => {
    switch (cat) {
      case 'address':
        return `আসসালামু আলাইকুম ${ord.customerName}, ShopNexus থেকে আপনার অর্ডার #${ord.orderNumber} প্রসেস করার সময় ডেলিভারি ঠিকানা বা এরিয়া অপূর্ণ পাওয়া গেছে। অনুগ্রহ করে আপনার সম্পূর্ণ বাড়ির ঠিকানা ও বর্তমান লোকেশন মেসেজে জানান। ধন্যবাদ!`;
      case 'variant':
        return `আসসালামু আলাইকুম ${ord.customerName}, আপনার অর্ডারকৃত #${ord.orderNumber}-এর নির্দিষ্ট কালার ভ্যারিয়েন্টটি মুহূর্তে স্টক সীমাবদ্ধ। আমরা কি অন্য পছন্দের কালার অথবা বিকল্প অফিশিয়াল মডেল পাঠিয়ে দিতে পারি? অনুগ্রহ করে জানাবেন।`;
      case 'delay':
        return `আসসালামু আলাইকুম ${ord.customerName}, আপনার অর্ডার #${ord.orderNumber} কুরিয়ারে ডিসপ্যাচ করা হয়েছে। ভারী বর্ষণ/লজিস্টিক জটের কারণে ডেলিভারিতে অতিরিক্ত ২৪ ঘণ্টা সময় লাগতে পারে। ট্র্যাকিং কোড: ${ord.trackingCode}।`;
      case 'payment':
        return `আসসালামু আলাইকুম ${ord.customerName}, আপনার অর্ডার #${ord.orderNumber}-এর পেমেন্ট ভেরিফিকেশনের জন্য bKash/Nagad ট্রানজেকশন আইডি (TrxID) প্রয়োজন। দয়া করে TrxID লিখে রিপ্লাই দিন।`;
      default:
        return `আসসালামু আলাইকুম ${ord.customerName}, আপনার অর্ডার #${ord.orderNumber} সম্পর্কিত একটি জরুরি বিষয়ে ShopNexus কাস্টমার কেয়ার থেকে যোগাযোগ করা হয়েছে।`;
    }
  };

  const handleSaveIssueReport = (channel: 'WhatsApp' | 'SMS' | 'Email') => {
    if (!reportingOrder) return;
    const issueText = issueNote || getPredefinedIssueMessage(reportingOrder, issueCategory);

    const updatedIssue: IOrderIssue = {
      category: issueCategory,
      title:
        issueCategory === 'address'
          ? 'Address Incomplete'
          : issueCategory === 'variant'
          ? 'Variant Swap Request'
          : issueCategory === 'delay'
          ? 'Courier Transit Delay'
          : issueCategory === 'payment'
          ? 'Payment Verification'
          : 'Custom Inquiry',
      note: issueText,
      reportedAt: 'Just now',
      channel,
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === reportingOrder.id ? { ...o, activeIssue: updatedIssue } : o))
    );

    // Trigger WhatsApp / SMS Link if applicable
    if (channel === 'WhatsApp') {
      const cleanPhone = reportingOrder.customerPhone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(issueText)}`;
      window.open(waUrl, '_blank');
    }

    setReportingOrder(null);
    setIssueNote('');
  };

  const selectedOrdersList = orders.filter((o) => selectedOrderIds.includes(o.id));

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingCart className="w-3.5 h-3.5" /> Order Fulfillment Pipeline & Invoicing
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Orders & Batch Invoicing Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              ১-ক্লিকে সারাদিনের সকল অর্ডারের ইনভয়েস বের করুন, রেঞ্জ প্রিন্ট করুন এবং কাস্টমারকে সরাসরি প্রবলেম রিপোর্ট করুন।
            </p>
          </div>

          {/* ⚡ 1-Click Quick Batch Extraction Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={selectTodayConfirmedOrders}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
              title="Select all today's confirmed and processing orders"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>আজকের কনফার্মড অর্ডার ({orders.filter((o) => o.isToday && (o.status === 'Confirmed' || o.status === 'Processing')).length})</span>
            </button>

            <button
              type="button"
              onClick={selectTodayAllOrders}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Select all today's orders regardless of status"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>আজকের সারাদিনের ইনভয়েস</span>
            </button>
          </div>
        </div>

        {/* 🔍 Advanced Filter Presets & Order Number Range Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'All', label: 'All Orders' },
                { id: 'TodayConfirmed', label: '⚡ Today Confirmed' },
                { id: 'Today', label: '📅 Today All' },
                { id: 'Confirmed', label: 'Confirmed' },
                { id: 'Processing', label: 'Processing' },
                { id: 'Shipped', label: 'Shipped' },
                { id: 'Delivered', label: 'Delivered' },
                { id: 'Pending', label: 'Pending' },
                { id: 'Cancelled', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Search Box */}
            <div className="max-w-xs w-full relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search order #, customer, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* 🔢 Order Range Filter Toolbar (এত নম্বর অর্ডার থেকে এত নম্বর অর্ডার পর্যন্ত সবগুলা ইনভয়েস) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-500" /> অর্ডার রেঞ্জ ফিল্টার:
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">NX-ORD-</span>
                <input
                  type="number"
                  placeholder="9018"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:border-orange-500 focus:outline-none"
                />
                <span className="text-slate-400 font-sans font-bold">থেকে</span>
                <span className="text-slate-400">NX-ORD-</span>
                <input
                  type="number"
                  placeholder="9032"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSelectRange}
                className="px-3 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-bold text-xs transition-colors cursor-pointer"
              >
                Select Range (রেঞ্জ সিলেক্ট)
              </button>
            </div>

            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-2">
              <span>Selected: <strong className="text-orange-600 dark:text-orange-400 font-mono">{selectedOrderIds.length}</strong> / {orders.length}</span>
              {selectedOrderIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedOrderIds([])}
                  className="text-rose-500 hover:underline cursor-pointer font-bold"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 🖨️ Floating / Sticky Batch Action Bar */}
        {selectedOrderIds.length > 0 && (
          <div className="sticky top-20 z-30 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-orange-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {selectedOrderIds.length}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
                  Batch Invoicing Ready ({selectedOrderIds.length} Orders Selected)
                </h4>
                <p className="text-[11px] text-slate-300">
                  Total Value: <strong className="text-emerald-400 font-mono">৳{selectedOrdersList.reduce((acc, o) => acc + o.total, 0).toLocaleString()} BDT</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBatchInvoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-black shadow-lg shadow-orange-500/30 transition-all cursor-pointer hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>সবগুলো ইনভয়েস একসাথে প্রিন্ট ({selectedOrderIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManifestModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Courier Dispatch Manifest</span>
              </button>
            </div>
          </div>
        )}

        {/* Orders Table with Checkboxes & Report Issue Action */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                      title="Select / Deselect all visible orders"
                    />
                  </th>
                  <th className="px-4 py-3.5">Order Invoice</th>
                  <th className="px-4 py-3.5">Customer & Phone</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5">Total (৳ BDT)</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions & Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredOrders.map((ord) => {
                  const isChecked = selectedOrderIds.includes(ord.id);
                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                        isChecked ? 'bg-orange-500/5 dark:bg-orange-500/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOrder(ord.id)}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-black text-orange-600 dark:text-orange-400 block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {ord.createdAt}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{ord.customerName}</div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                          {ord.customerPhone}
                        </span>
                        {ord.hasPastReturnAlert && (
                          <div className="mt-1 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>{ord.hasPastReturnAlert}</span>
                          </div>
                        )}
                        {ord.activeIssue && (
                          <div className="mt-1 px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[9px] font-bold text-rose-700 dark:text-rose-300 inline-flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                            <span>ইস্যু রিপোর্ট: {ord.activeIssue.title}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 dark:text-slate-300">
                              {item.quantity}x {item.title}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-black text-slate-900 dark:text-white text-sm">
                        ৳{ord.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
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
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 💬 Direct Report Issue to Customer Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setReportingOrder(ord);
                              setIssueCategory('address');
                              setIssueNote('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Report issue & message customer directly (WhatsApp/SMS)"
                          >
                            <MessageSquare className="w-3 h-3 text-amber-500" />
                            <span>রিপোর্ট</span>
                          </button>

                          {/* 🖨️ Invoice View & Print Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(ord)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-[11px] border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                            title="View & Print Single Barcode Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Invoice</span>
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

        {/* 🖨️ 1. SINGLE 1-CLICK PRINTABLE BARCODE & QR INVOICE MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-4 print:shadow-none">
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h2 className="text-base font-black text-slate-900">Official Packing Slip & Invoice</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Invoice Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Letterhead */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
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
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200">
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
                    <span className="font-mono font-black text-orange-600">৳{selectedInvoice.total.toLocaleString()} BDT</span>
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

        {/* 🖨️ 2. BATCH MULTI-INVOICE CONTINUOUS PRINTING MODAL */}
        {isBatchInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 my-8 max-h-[90vh] overflow-y-auto print:m-0 print:p-0 print:max-w-none print:shadow-none print:bg-transparent">
              {/* Batch Modal Top Control Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Printer className="w-5 h-5 text-orange-600" />
                    Batch Printing ({selectedOrdersList.length} Invoices Ready)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Clicking Print will sequentially format each invoice onto an individual packing slip page.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/30 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print All {selectedOrdersList.length} Invoices
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBatchInvoiceModalOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* All Individual Invoices Loop with page break */}
              <div className="space-y-8 print:space-y-0">
                {selectedOrdersList.map((ord, index) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl border border-slate-200 space-y-5 print:border-none print:p-4 print:break-after-page"
                  >
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                            SN
                          </div>
                          <span className="text-lg font-black text-slate-900">ShopNexus Official</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Direct Official Hardware Ecosystem • support@shopnexus.io
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-sm text-slate-900 block">{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-500">Date: {ord.createdAt}</span>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200">
                            {ord.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliver To:</span>
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-slate-600">{ord.customerPhone}</div>
                        <div className="text-slate-600 mt-0.5">{ord.customerAddress}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch Info:</span>
                        <div className="font-bold text-slate-900">{ord.courier}</div>
                        <div className="font-mono text-slate-600">Tracking: {ord.trackingCode}</div>
                        <div className="text-emerald-600 font-bold mt-0.5">Total: ৳{ord.total.toLocaleString()} BDT</div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Item Description</th>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5 text-center">Qty</th>
                            <th className="p-2.5 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {ord.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-semibold text-slate-900">{item.title}</td>
                              <td className="p-2.5 font-mono text-[11px] text-slate-500">{item.sku}</td>
                              <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                              <td className="p-2.5 text-right font-mono font-bold">৳{item.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <div className="space-y-0.5">
                        <div className="h-8 px-3 bg-slate-100 rounded-md flex items-center font-mono text-xs tracking-widest font-black border border-slate-300">
                          ||||| ||| |||| || ||||| | |||||
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">{ord.trackingCode}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Slip {index + 1} of {selectedOrdersList.length}</span>
                        <span className="font-mono font-black text-sm text-orange-600">৳{ord.total.toLocaleString()} BDT</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 📦 3. COURIER LOGISTICS DISPATCH MANIFEST MODAL */}
        {isManifestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 my-8 print:m-0 print:p-4 print:shadow-none">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-600" />
                    Courier Logistics Dispatch Manifest
                  </h2>
                  <p className="text-xs text-slate-500">
                    Handover sheet for Pathao, Steadfast, RedX & Paperfly drivers with COD signature confirmation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Manifest
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManifestModalOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Manifest Header */}
              <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-900 text-base">ShopNexus Logistics Dispatch Sheet</span>
                  <div className="text-slate-500 mt-0.5">Date: {new Date().toLocaleDateString('en-GB')} • Total Parcels: {selectedOrdersList.length}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Total COD Receivable:</span>
                  <div className="font-mono font-black text-emerald-700 text-base">
                    ৳{selectedOrdersList.reduce((acc, o) => acc + o.total, 0).toLocaleString()} BDT
                  </div>
                </div>
              </div>

              {/* Manifest Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Order # & Tracking</th>
                      <th className="p-3">Recipient & Contact</th>
                      <th className="p-3">Delivery Area</th>
                      <th className="p-3 text-right">Collectable COD (৳)</th>
                      <th className="p-3 text-center w-28">Driver Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {selectedOrdersList.map((ord, idx) => (
                      <tr key={ord.id}>
                        <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block">{ord.orderNumber}</span>
                          <span className="font-mono text-[10px] text-orange-600">{ord.trackingCode}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                          <span className="font-mono text-[10px] text-slate-500">{ord.customerPhone}</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-600 max-w-xs truncate">{ord.customerAddress}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ৳{ord.total.toLocaleString()}
                        </td>
                        <td className="p-3 border-l border-slate-200"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t border-slate-200">
                <div className="border-t border-dashed border-slate-400 pt-2 text-center text-slate-500">
                  ShopNexus Dispatch Officer Signature
                </div>
                <div className="border-t border-dashed border-slate-400 pt-2 text-center text-slate-500">
                  Courier Driver / Rider Signature & Seal
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💬 4. CUSTOMER ISSUE REPORTING & NOTIFICATION MODAL */}
        {reportingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Report Order Issue to Customer
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      কাস্টমারকে সরাসরি WhatsApp, SMS অথবা Email-এ প্রবলেম রিপোর্ট পাঠান
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReportingOrder(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Snapshot */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Recipient:</span>
                  <div className="font-bold text-slate-900 dark:text-white">{reportingOrder.customerName}</div>
                  <span className="font-mono text-[11px] text-slate-500">{reportingOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Invoice:</span>
                  <div className="font-mono font-bold text-orange-600 dark:text-orange-400">{reportingOrder.orderNumber}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold font-mono">৳{reportingOrder.total.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Issue Category Radio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Select Issue Type (সমস্যার ধরন সিলেক্ট করুন):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'address', label: '🏠 ঠিকানা / ফোন অসম্পূর্ণ (Incomplete Address)' },
                    { id: 'variant', label: '🎨 ভ্যারিয়েন্ট / কালার পরিবর্তন অনুরোধ' },
                    { id: 'delay', label: '🚚 কুরিয়ার ডেলিভারি বিলম্ব নোটিশ' },
                    { id: 'payment', label: '💳 পেমেন্ট ভেরিফিকেশন প্রয়োজন' },
                    { id: 'custom', label: '📝 কাস্টম মেসেজ / ডিসপুট' },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                        issueCategory === item.id
                          ? 'border-orange-500 bg-orange-500/10 font-bold text-orange-600 dark:text-orange-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueCategory"
                        checked={issueCategory === item.id}
                        onChange={() => {
                          setIssueCategory(item.id as any);
                          setIssueNote(getPredefinedIssueMessage(reportingOrder, item.id));
                        }}
                        className="w-3.5 h-3.5 text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Editable Message Template */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Message Preview / Template (মেসেজ প্রিভিউ):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const text = issueNote || getPredefinedIssueMessage(reportingOrder, issueCategory);
                      navigator.clipboard.writeText(text);
                      setCopiedFeedback(true);
                      setTimeout(() => setCopiedFeedback(false), 2500);
                    }}
                    className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedFeedback ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={issueNote || getPredefinedIssueMessage(reportingOrder, issueCategory)}
                  onChange={(e) => setIssueNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportingOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {/* WhatsApp Direct Send */}
                  <button
                    type="button"
                    onClick={() => handleSaveIssueReport('WhatsApp')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send WhatsApp & Flag</span>
                  </button>

                  {/* SMS / System Flag */}
                  <button
                    type="button"
                    onClick={() => handleSaveIssueReport('SMS')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                    <span>Save Issue Flag & SMS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
