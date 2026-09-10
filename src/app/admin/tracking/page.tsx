'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
  User,
  ExternalLink,
} from 'lucide-react';

interface IParcel {
  trackingId: string;
  orderId: string;
  customerName: string;
  phone: string;
  destination: string;
  courierPartner: 'Pathao Courier' | 'RedX Logistics' | 'Steadfast' | 'DHL Express';
  stageIndex: number; // 0: Placed, 1: Confirmed, 2: Packaging, 3: In Transit, 4: Delivered
  itemsCount: number;
  totalAmount: number;
  lastUpdated: string;
  estimatedDelivery: string;
}

const STAGES = [
  { label: 'Order Placed', desc: 'Customer placed order online' },
  { label: 'Confirmed', desc: 'Payment verified & stock allocated' },
  { label: 'Packaging', desc: 'Inspected & handed to courier' },
  { label: 'In Transit', desc: 'Out for final doorstep delivery' },
  { label: 'Delivered', desc: 'Successfully handed over to customer' },
];

const INITIAL_PARCELS: IParcel[] = [
  {
    trackingId: 'TRK-NX-88219',
    orderId: 'NX-ORD-9021',
    customerName: 'Tanvir Hossain',
    phone: '+880 1712-345678',
    destination: 'House 42, Road 11, Banani, Dhaka-1213',
    courierPartner: 'Pathao Courier',
    stageIndex: 3, // In Transit
    itemsCount: 2,
    totalAmount: 54180,
    lastUpdated: '10 mins ago',
    estimatedDelivery: 'Today by 6:00 PM',
  },
  {
    trackingId: 'TRK-NX-77402',
    orderId: 'NX-ORD-9018',
    customerName: 'Sarah Rahman',
    phone: '+880 1819-876543',
    destination: 'Flat 5B, Concord Tower, Gulshan-2, Dhaka',
    courierPartner: 'Steadfast',
    stageIndex: 4, // Delivered
    itemsCount: 1,
    totalAmount: 41937,
    lastUpdated: '2 hours ago',
    estimatedDelivery: 'Delivered',
  },
  {
    trackingId: 'TRK-NX-66311',
    orderId: 'NX-ORD-9025',
    customerName: 'Nusrat Jahan',
    phone: '+880 1911-223344',
    destination: 'Sector 4, Uttara, Dhaka-1230',
    courierPartner: 'RedX Logistics',
    stageIndex: 2, // Packaging
    itemsCount: 3,
    totalAmount: 98685,
    lastUpdated: '25 mins ago',
    estimatedDelivery: 'Tomorrow, Aug 25',
  },
  {
    trackingId: 'TRK-NX-55104',
    orderId: 'NX-ORD-9029',
    customerName: 'Mahmudul Hasan',
    phone: '+880 1622-998877',
    destination: 'Nasirabad Housing, Chittagong',
    courierPartner: 'DHL Express',
    stageIndex: 1, // Confirmed
    itemsCount: 1,
    totalAmount: 39387,
    lastUpdated: '45 mins ago',
    estimatedDelivery: 'Aug 26, 2026',
  },
];

import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';

const STAGES_CONFIG = [
  { labelEn: 'Order Placed', labelBn: 'অর্ডার গ্রহণ', descEn: 'Customer placed order online', descBn: 'গ্রাহক অনলাইনে অর্ডার সম্পন্ন করেছেন' },
  { labelEn: 'Confirmed', labelBn: 'নিশ্চিতকৃত', descEn: 'Payment verified & stock allocated', descBn: 'পেমেন্ট যাচাই ও স্টক নিশ্চিত' },
  { labelEn: 'Packaging', labelBn: 'প্যাকেজিং সম্পন্ন', descEn: 'Inspected & handed to courier', descBn: 'মান যাচাই শেষে কুরিয়ারে হস্তান্তর' },
  { labelEn: 'In Transit', labelBn: 'ডেলিভারিতে চলমান', descEn: 'Out for final doorstep delivery', descBn: 'গ্রাহকের ঠিকানায় পৌঁছানোর পথে' },
  { labelEn: 'Delivered', labelBn: 'ডেলিভার্ড', descEn: 'Successfully handed over to customer', descBn: 'সফলভাবে গ্রাহকের হাতে পৌঁছেছে' },
];

export default function AdminTrackingPage() {
  const { token } = useAuthStore();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';
  const [parcels, setParcels] = useState<IParcel[]>(INITIAL_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<IParcel>(INITIAL_PARCELS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdatedToast, setStatusUpdatedToast] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch live tracking orders from MongoDB Atlas
  React.useEffect(() => {
    const fetchLiveParcels = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/tracking/parcels`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: IParcel[] = data.data.map((p: any) => ({
            trackingId: p.trackingNumber,
            orderId: p.orderId,
            customerName: p.recipient?.name || 'Customer',
            phone: p.recipient?.phone || '+880 1700-000000',
            destination: p.recipient?.address || 'Dhaka',
            courierPartner: p.courier?.includes('Pathao') ? 'Pathao Courier' : 'Steadfast',
            stageIndex: Math.min(4, Math.max(0, (p.currentStage || 3) - 1)),
            itemsCount: p.items?.length || 1,
            totalAmount: p.amount || 15000,
            lastUpdated: p.lastUpdated || 'Just now',
            estimatedDelivery: p.statusText === 'Delivered' ? 'Delivered' : 'Within 24-48h',
          }));

          setParcels((prev) => {
            const existingIds = new Set(mapped.map((m) => m.trackingId));
            return [...mapped, ...prev.filter((p) => !existingIds.has(p.trackingId))];
          });
          if (mapped.length > 0) {
            setSelectedParcel(mapped[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching live tracking parcels:', err);
      }
    };

    fetchLiveParcels();
  }, [API_URL, token]);

  const updateStage = async (trackingId: string, newStage: number) => {
    setParcels((prev) =>
      prev.map((p) => (p.trackingId === trackingId ? { ...p, stageIndex: newStage, lastUpdated: isBn ? 'এইমাত্র' : 'Just now' } : p))
    );
    if (selectedParcel.trackingId === trackingId) {
      setSelectedParcel((prev) => ({ ...prev, stageIndex: newStage, lastUpdated: isBn ? 'এইমাত্র' : 'Just now' }));
    }
    const stageName = isBn ? STAGES_CONFIG[newStage].labelBn : STAGES_CONFIG[newStage].labelEn;
    setStatusUpdatedToast(isBn ? `স্ট্যাটাস পরিবর্তন হয়ে "${stageName}" করা হয়েছে` : `Status updated to "${stageName}"`);
    setTimeout(() => setStatusUpdatedToast(null), 3000);

    // Map stage to order status
    const stageStatusMap = ['pending', 'processing', 'processing', 'shipped', 'delivered'];
    const targetStatus = stageStatusMap[newStage] || 'shipped';

    try {
      const parcelObj = parcels.find((p) => p.trackingId === trackingId);
      if (parcelObj?.orderId) {
        await fetch(`${API_URL}/admin/orders/${parcelObj.orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ orderStatus: targetStatus }),
        });
      }
    } catch (_e) {}
  };

  const filteredParcels = parcels.filter(
    (p) =>
      p.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.courierPartner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Truck className="w-3.5 h-3.5" />
              {isBn ? 'লাইভ লজিস্টিকস ও কুরিয়ার হাব' : 'Live Logistics & Dispatch Hub'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isBn ? 'লাইভ কুরিয়ার ও পার্সেল ট্র্যাকিং' : 'Live Courier & Parcel Tracking'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'থার্ড পার্টি কুরিয়ার ডেলিভারি ট্র্যাক করুন, মাইলস্টোন আপডেট করুন এবং গ্রাহক লজিস্টিকস পর্যবেক্ষণ করুন।'
                : 'Track 3rd-party courier dispatches, update delivery milestones, and inspect customer logistics in real-time.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Package className="w-4 h-4" />
              {isBn ? 'অর্ডার তালিকা' : 'Orders List'}
            </Link>
          </div>
        </div>

        {/* Status Update Banner Toast */}
        {statusUpdatedToast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {statusUpdatedToast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Parcel List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={isBn ? 'ট্র্যাকিং আইডি, অর্ডার বা গ্রাহক দিয়ে খুঁজুন...' : 'Search tracking ID, order, or customer...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
              />
            </div>

            <div className="space-y-2.5">
              {filteredParcels.map((parcel) => {
                const isSelected = parcel.trackingId === selectedParcel.trackingId;
                const isDelivered = parcel.stageIndex === 4;
                const stageLabel = isBn ? STAGES_CONFIG[parcel.stageIndex].labelBn : STAGES_CONFIG[parcel.stageIndex].labelEn;

                return (
                  <div
                    key={parcel.trackingId}
                    onClick={() => setSelectedParcel(parcel)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-md shadow-orange-500/10'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400">{parcel.trackingId}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isDelivered
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {stageLabel}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">{parcel.customerName}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {parcel.courierPartner}
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white font-semibold">
                        {isBn ? `৳${toBengaliNumber(parcel.totalAmount.toLocaleString('en-US'))} BDT` : `৳${parcel.totalAmount.toLocaleString()} BDT`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Parcel 5-Stage Live Timeline & Dispatch Control (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-mono">{selectedParcel.trackingId}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({selectedParcel.orderId})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {isBn ? 'কুরিয়ার ক্যারিয়ার:' : 'Carrier:'}{' '}
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{selectedParcel.courierPartner}</span> •{' '}
                    {isBn ? `আপডেট: ${selectedParcel.lastUpdated}` : `Updated ${selectedParcel.lastUpdated}`}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    {isBn ? 'সম্ভাব্য ডেলিভারি' : 'Estimated Delivery'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{selectedParcel.estimatedDelivery}</span>
                </div>
              </div>

              {/* 5-Stage Visual Progress Bar */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  {isBn ? 'লাইভ ডেলিভারি মাইলস্টোন টাইমলাইন' : 'Live Dispatch Milestone Timeline'}
                </h3>

                <div className="relative flex items-center justify-between mb-8">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${(selectedParcel.stageIndex / (STAGES_CONFIG.length - 1)) * 100}%` }}
                    />
                  </div>

                  {STAGES_CONFIG.map((stg, i) => {
                    const isPassed = i <= selectedParcel.stageIndex;
                    const isCurrent = i === selectedParcel.stageIndex;
                    const label = isBn ? stg.labelBn : stg.labelEn;

                    return (
                      <button
                        key={stg.labelEn}
                        type="button"
                        onClick={() => updateStage(selectedParcel.trackingId, i)}
                        className={`relative z-10 flex flex-col items-center group cursor-pointer`}
                        title={isBn ? `স্ট্যাটাস "${label}"-এ সেট করতে ক্লিক করুন` : `Click to set status to ${label}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                            isPassed
                              ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-orange-500/40 ring-4 ring-white dark:ring-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                          } ${isCurrent ? 'ring-2 ring-orange-500 scale-110' : ''}`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : (isBn ? toBengaliNumber(i + 1) : i + 1)}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-2 text-center transition-colors max-w-[70px] ${
                            isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Status Stage Shifter Buttons */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {isBn ? 'দ্রুত মাইলস্টোন পরিবর্তন (১-ক্লিক আপডেট):' : 'Quick Milestone Switcher (1-Click Update):'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {STAGES_CONFIG.map((stg, i) => {
                    const label = isBn ? stg.labelBn : stg.labelEn;
                    return (
                      <button
                        key={stg.labelEn}
                        type="button"
                        onClick={() => updateStage(selectedParcel.trackingId, i)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedParcel.stageIndex === i
                            ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                            : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient & Logistics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    {isBn ? 'প্রাপকের বিবরণ' : 'Recipient Details'}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{selectedParcel.customerName}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <PhoneCall className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    {selectedParcel.phone}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{selectedParcel.destination}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {isBn ? 'কুরিয়ার ইন্টিগ্রেশন' : 'Courier Integration'}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{selectedParcel.courierPartner}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {isBn ? 'প্যাকেজের আইটেম:' : 'Package Content:'}{' '}
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {isBn ? `${toBengaliNumber(selectedParcel.itemsCount)}টি ভেরিফায়েড পণ্য` : `${selectedParcel.itemsCount} Verified Items`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {isBn ? 'পেমেন্ট গেটওয়ে:' : 'Payment Gateway:'}{' '}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isBn ? 'ভেরিফায়েড অনলাইন প্রি-পেইড' : 'Verified Online Pre-Paid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
