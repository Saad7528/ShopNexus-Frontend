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

export default function AdminTrackingPage() {
  const [parcels, setParcels] = useState<IParcel[]>(INITIAL_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<IParcel>(INITIAL_PARCELS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdatedToast, setStatusUpdatedToast] = useState<string | null>(null);

  const updateStage = (trackingId: string, newStage: number) => {
    setParcels((prev) =>
      prev.map((p) => (p.trackingId === trackingId ? { ...p, stageIndex: newStage, lastUpdated: 'Just now' } : p))
    );
    if (selectedParcel.trackingId === trackingId) {
      setSelectedParcel((prev) => ({ ...prev, stageIndex: newStage, lastUpdated: 'Just now' }));
    }
    setStatusUpdatedToast(`Status updated to "${STAGES[newStage].label}"`);
    setTimeout(() => setStatusUpdatedToast(null), 3000);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Truck className="w-3.5 h-3.5" />
              Live Logistics & Dispatch Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Live Courier & Parcel Tracking</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track 3rd-party courier dispatches, update delivery milestones, and inspect customer logistics in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <Package className="w-4 h-4" />
              Orders List
            </Link>
          </div>
        </div>

        {/* Status Update Banner Toast */}
        {statusUpdatedToast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            {statusUpdatedToast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Parcel List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tracking ID, order, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2.5">
              {filteredParcels.map((parcel) => {
                const isSelected = parcel.trackingId === selectedParcel.trackingId;
                const isDelivered = parcel.stageIndex === 4;

                return (
                  <div
                    key={parcel.trackingId}
                    onClick={() => setSelectedParcel(parcel)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-indigo-300">{parcel.trackingId}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isDelivered
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        {STAGES[parcel.stageIndex].label}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-white mb-1">{parcel.customerName}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {parcel.courierPartner}
                      </span>
                      <span className="font-mono text-white font-semibold">৳{parcel.totalAmount.toLocaleString()} BDT</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Parcel 5-Stage Live Timeline & Dispatch Control (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white font-mono">{selectedParcel.trackingId}</h2>
                    <span className="text-xs text-slate-400 font-mono">({selectedParcel.orderId})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Carrier: <span className="text-indigo-400 font-semibold">{selectedParcel.courierPartner}</span> •{' '}
                    Updated {selectedParcel.lastUpdated}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{selectedParcel.estimatedDelivery}</span>
                </div>
              </div>

              {/* 5-Stage Visual Progress Bar */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Live Dispatch Milestone Timeline
                </h3>

                <div className="relative flex items-center justify-between mb-8">
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${(selectedParcel.stageIndex / (STAGES.length - 1)) * 100}%` }}
                    />
                  </div>

                  {STAGES.map((stg, i) => {
                    const isPassed = i <= selectedParcel.stageIndex;
                    const isCurrent = i === selectedParcel.stageIndex;

                    return (
                      <button
                        key={stg.label}
                        type="button"
                        onClick={() => updateStage(selectedParcel.trackingId, i)}
                        className={`relative z-10 flex flex-col items-center group cursor-pointer`}
                        title={`Click to set status to ${stg.label}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                            isPassed
                              ? 'bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-slate-900'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          } ${isCurrent ? 'ring-2 ring-indigo-400 scale-110' : ''}`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-2 text-center transition-colors max-w-[70px] ${
                            isPassed ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          {stg.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Status Stage Shifter Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Milestone Switcher (1-Click Update):
                </span>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((stg, i) => (
                    <button
                      key={stg.label}
                      type="button"
                      onClick={() => updateStage(selectedParcel.trackingId, i)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedParcel.stageIndex === i
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Logistics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Recipient Details
                  </span>
                  <div className="text-xs font-bold text-white">{selectedParcel.customerName}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <PhoneCall className="w-3 h-3 text-slate-500" />
                    {selectedParcel.phone}
                  </div>
                  <div className="text-xs text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{selectedParcel.destination}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    Courier Integration
                  </span>
                  <div className="text-xs font-bold text-white">{selectedParcel.courierPartner}</div>
                  <div className="text-xs text-slate-400">
                    Package Content: <span className="text-white font-semibold">{selectedParcel.itemsCount} Verified Items</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Payment Gateway: <span className="text-emerald-400 font-semibold">Verified Online Pre-Paid</span>
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
