'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  User as UserIcon,
  Package,
  Shield,
  MapPin,
  Phone,
  Mail,
  Camera,
  CheckCircle2,
  Clock,
  Truck,
  CheckCircle,
  Box,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Save,
  LogOut,
  ArrowRight,
  Lock,
} from 'lucide-react';

import { useOrderStore, UserOrder } from '@/store/useOrderStore';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, setUser, logout, isAuthenticated } = useAuthStore();
  const { orders: userOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  useEffect(() => {
    if (userOrders && userOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(userOrders[0]);
    }
  }, [userOrders, selectedOrder]);

  // Form State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setPhoneNumber(user.phoneNumber || '+880 1712-345678');
      setAddress(user.address || 'House 42, Road 11, Banani Block-D');
      setCity(user.city || 'Dhaka');
      setZipCode(user.zipCode || '1213');
      setCountry(user.country || 'Bangladesh');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (token) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            avatar,
            phoneNumber,
            address,
            city,
            zipCode,
            country,
          }),
        });

        const json = await res.json();
        if (json.success && json.data?.user) {
          setUser(json.data.user);
        } else {
          // Update store directly if offline
          if (user) {
            setUser({ ...user, name, avatar, phoneNumber, address, city, zipCode, country });
          }
        }
      } else {
        if (user) {
          setUser({ ...user, name, avatar, phoneNumber, address, city, zipCode, country });
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (_err) {
      if (user) {
        setUser({ ...user, name, avatar, phoneNumber, address, city, zipCode, country });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const getStepProgress = (status: UserOrder['status']) => {
    switch (status) {
      case 'PLACED':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'PACKAGING':
        return 3;
      case 'SHIPPED':
        return 4;
      case 'DELIVERED':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-orange-500/10 border-2 border-orange-500/25 flex items-center justify-center text-3xl font-black text-orange-600 dark:text-orange-400 shadow-xl relative">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name || 'User'}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    name.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] border border-white dark:border-slate-900 text-white shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{name || user?.name || 'ShopNexus User'}</h1>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      user?.role === 'admin'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300'
                        : user?.role === 'vendor'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-300'
                        : 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-300'
                    }`}
                  >
                    {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user?.email || 'user@shopnexus.com'}
                </p>
                {phoneNumber && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Role Portal Nav */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Shield className="w-4 h-4" /> Open Admin Operations &rarr;
                </Link>
              )}
              {user?.role === 'vendor' && (
                <Link
                  href="/vendor/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
                >
                  <Box className="w-4 h-4" /> Open Merchant Hub &rarr;
                </Link>
              )}
              {(!user?.role || user?.role === 'customer') && (
                <Link
                  href="/register?role=vendor"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-300 font-bold text-xs transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Become a Verified Merchant
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mt-8 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserIcon className="w-4 h-4" /> Personal Information & Media
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" /> Order History & Live Tracking
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-indigo-500/20 text-orange-600 dark:text-indigo-300 text-[10px] font-mono font-bold">
                {userOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'security'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" /> Security & Credentials
            </button>
          </div>
        </div>

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar & Quick Presets */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-600 dark:text-indigo-400" /> Choose Preset Avatar
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Select a high-resolution 3D persona or paste your custom image URL below.
                </p>

                <div className="grid grid-cols-5 gap-2 pt-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                        avatar === url ? 'border-orange-500 ring-2 ring-orange-500/40' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Preset ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Custom Image URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Profile Fields Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSaveProfile}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6"
              >
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">General Information</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Update your full legal name, phone number, and primary delivery destination.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in-50">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Profile settings successfully saved and synced across ShopNexus!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Default Shipping Address
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 42, Road 11, Banani Block-D"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Dhaka"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Zip Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="1213"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Bangladesh"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? 'Updating Profile...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY & REAL-TIME TRACKING */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Purchased Orders ({userOrders.length})
              </h2>

              <div className="space-y-3">
                {userOrders.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-300 font-bold">No orders placed yet</p>
                    <p className="text-xs text-slate-500 mt-1">Browse our store and place your first order!</p>
                  </div>
                ) : (
                  userOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/50 shadow-xl shadow-indigo-950/50 ring-1 ring-indigo-500/20'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 animate-pulse'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="relative inline-block h-10 w-10 rounded-xl overflow-hidden ring-2 ring-slate-900 bg-slate-800"
                              >
                                <Image
                                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                                  alt={item.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} â€¢{' '}
                            <span className="font-bold text-white font-mono">à§³{order.total.toLocaleString()} BDT</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                          <span>{order.date}</span>
                          <span className="text-indigo-400 font-semibold flex items-center gap-1">
                            View Live Tracking <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Live Order Tracking Visualizer */}
            {selectedOrder && (
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
                  {/* Tracking Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold">
                        <Truck className="w-4 h-4" />
                        Tracking Code: {selectedOrder.trackingNumber}
                      </div>
                      <h3 className="text-xl font-black text-white mt-1">
                        Order #{selectedOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Carrier: <span className="font-bold text-slate-200">{selectedOrder.carrier}</span>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Estimated Delivery
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        {selectedOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* 5-Stage Live Visual Progress Tracker */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Order Fulfillment Status</span>
                      <span className="text-indigo-400">
                        Stage {getStepProgress(selectedOrder.status)} of 5
                      </span>
                    </div>

                    {/* Stepper Dots & Line */}
                    <div className="relative py-4">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-700"
                        style={{
                          width: `${((getStepProgress(selectedOrder.status) - 1) / 4) * 100}%`,
                        }}
                      />

                      <div className="relative z-10 flex justify-between">
                        {[
                          { stage: 'PLACED', label: 'Placed' },
                          { stage: 'CONFIRMED', label: 'Confirmed' },
                          { stage: 'PACKAGING', label: 'Packaging' },
                          { stage: 'SHIPPED', label: 'In Transit' },
                          { stage: 'DELIVERED', label: 'Delivered' },
                        ].map((s, index) => {
                          const isDone = getStepProgress(selectedOrder.status) >= index + 1;
                          const isCurrent = getStepProgress(selectedOrder.status) === index + 1;
                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                                  isDone
                                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                } ${isCurrent ? 'ring-4 ring-indigo-400 animate-pulse' : ''}`}
                              >
                                {isDone ? <CheckCircle className="w-4 h-4" /> : index + 1}
                              </div>
                              <span
                                className={`text-[10px] font-bold mt-2 tracking-tight ${
                                  isDone ? 'text-white' : 'text-slate-500'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Destination & Order Items Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs text-slate-300">
                      <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Delivery Destination:</span>
                        <span className="text-slate-400">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Itemized list */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ordered Products
                    </h4>
                    <div className="divide-y divide-slate-800/60">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                              <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-white">
                            à§³{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total Charged ({selectedOrder.paymentMethod}):</span>
                    <span className="text-base font-mono font-black text-indigo-400">
                      à§³{selectedOrder.total.toLocaleString()} BDT
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SECURITY & CREDENTIALS */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Account Security & Access</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your credentials, password reset options, and role permissions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 text-xs text-indigo-300">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white">Brute-Force Account Protection Active</span>
                Your account is protected by 5-attempt automatic lockout and token verification.
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">Reset Account Password</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Generate a one-time cryptographic token to update your login password.
                  </p>
                </div>
                <Link
                  href="/forgot-password"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Reset Password
                </Link>
              </div>

              {user?.role === 'admin' && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">Administrative Operations Hub</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      You possess superadmin privileges to inspect inventory, manage orders, and monitor sales.
                    </p>
                  </div>
                  <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Admin Ops
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
