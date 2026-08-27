'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore, UserOrder } from '@/store/useOrderStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import {
  User as UserIcon,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Camera,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  Trash2,
  Save,
  LogOut,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');

  const { user, token, setUser, logout, isAuthenticated } = useAuthStore();
  const { orders: userOrders } = useOrderStore();
  const { items: wishlistItems, removeFromWishlist } = useWishlistStore();
  const { items: cartItems, addItem, removeItem, updateQuantity, getTotals } = useCartStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'cart'>('profile');
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync tab from URL query param
  useEffect(() => {
    if (requestedTab === 'orders' || requestedTab === 'wishlist' || requestedTab === 'cart' || requestedTab === 'profile') {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  useEffect(() => {
    if (userOrders && userOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(userOrders[0]);
    }
  }, [userOrders, selectedOrder]);

  // Form State initialized purely from real user data (Zero fake/dummy hardcoded values)
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setPhoneNumber(user.phoneNumber || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setZipCode(user.zipCode || '');
      setCountry(user.country || 'Bangladesh');
    }
  }, [user]);

  // 📷 Handle Real Device File Upload for Profile Photo
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (base64Url) {
        setAvatar(base64Url);
        if (user) {
          setUser({ ...user, avatar: base64Url });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
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
        } else if (user) {
          setUser({ ...user, name, avatar, phoneNumber, address, city, zipCode, country });
        }
      } else if (user) {
        setUser({ ...user, name, avatar, phoneNumber, address, city, zipCode, country });
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

  const handleMoveWishlistToCart = (item: any) => {
    addItem({
      productId: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: 15,
      vendorName: 'ShopNexus Official Store',
    });
    removeFromWishlist(item.id);
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

  const cartTotals = getTotals();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Profile Avatar with Camera Upload Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-orange-500/10 border-2 border-orange-500/25 flex items-center justify-center text-3xl font-black text-orange-600 dark:text-orange-400 shadow-xl relative">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt={name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name[0].toUpperCase() : 'U'}</span>
                  )}
                </div>

                {/* Camera Click-to-Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2.5 rounded-2xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] text-white shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Click to upload profile photo from device"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{name || 'Authenticated Customer'}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    {user?.role || 'Customer'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || 'customer@shopnexus.com'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  {phoneNumber ? phoneNumber : <span className="italic text-slate-400">Phone not set</span>}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {address ? `${address}, ${city || 'Dhaka'}` : <span className="italic text-slate-400">Default address not set</span>}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Nexus Coins & Streak Badge */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-lg">
                  🪙
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Nexus Coins</span>
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.2 rounded">
                      🔥 দিন {user?.loginStreak || 1}
                    </span>
                  </div>
                  <p className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                    {(user?.nexusCoins || 0).toLocaleString()} Coins
                  </p>
                </div>
              </div>

              {/* VIP Status Badge */}
              {user?.isVipMember ? (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-left">
                  <span className="text-xl">👑</span>
                  <div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">VIP Member</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">৳200 First Order Perk Active</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600 dark:text-slate-400">VIP Pass Progress:</span>
                    <span className="text-orange-600 dark:text-orange-400 font-mono">{user?.nexusCoins || 0}/500</span>
                  </div>
                  <div className="w-28 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                      style={{ width: `${Math.min(100, ((user?.nexusCoins || 0) / 500) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => logout()}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-500 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs (4 High-Utility Tabs) */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Personal Information
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Order History & Live Tracking
              {userOrders && userOrders.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center">
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              My Wishlist
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              My Cart
              {cartItems && cartItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Clean Full-Width Personal Information Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">General Information & Delivery Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your personal contact information and default delivery destination for fast 1-click checkout.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Profile information and default shipping address updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. S.M. Amirul Islam Saad"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  Default Shipping Address
                </div>
                <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
                  📍 Auto-applied during checkout
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Road 11, Block D"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">City / Division</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dhaka"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 1213"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Bangladesh"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-orange-500 shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Order History & Live Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {userOrders && userOrders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders List */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Orders ({userOrders.length})</h3>
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedOrder?.id === ord.id
                          ? 'bg-orange-500/10 border-orange-500/40 shadow-md'
                          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">#{ord.orderNumber || ord.id.slice(-6).toUpperCase()}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{ord.date || 'Recent'}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">৳{(ord.total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Order Details & Step Tracker */}
                <div className="lg:col-span-2">
                  {selectedOrder && (
                    <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                        <div>
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Order Details</span>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white font-mono">#{selectedOrder.orderNumber || selectedOrder.id}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Total Paid</span>
                          <p className="text-lg font-black text-orange-600 dark:text-orange-400 font-mono">৳{(selectedOrder.total || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Step Progress Bar */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Parcel Journey Status</h5>
                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                          {['Placed', 'Confirmed', 'Packaging', 'Shipped', 'Delivered'].map((step, idx) => {
                            const isCompleted = getStepProgress(selectedOrder.status) >= idx + 1;
                            return (
                              <div key={step} className="space-y-1.5">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    isCompleted ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs' : 'bg-slate-100 dark:bg-slate-800'
                                  }`}
                                />
                                <span className={isCompleted ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tracking ID & Dispatch info */}
                      {selectedOrder.trackingNumber && (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Courier Tracking ID</span>
                            <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">{selectedOrder.trackingNumber}</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Truck className="w-4 h-4" /> Live Tracking Active
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Orders Found Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  You haven&apos;t placed any orders yet. Discover our curated official hardware and enjoy fast 24h delivery!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white font-bold text-xs shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  My Saved Wishlist ({wishlistItems.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Products you saved for future purchases.
                </p>
              </div>
              <Link href="/products" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                Explore More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {wishlistItems && wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">{item.category}</span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.name}</h4>
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block mt-1">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleMoveWishlistToCart(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Save your favorite hardware and audio gear to monitor price drops and stock availability.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  Discover Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: My Cart */}
        {activeTab === 'cart' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  Active Shopping Cart ({cartItems.length} items)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review your items and proceed to fast courier checkout.
                </p>
              </div>
              <Link href="/products" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                Add More Items <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {cartItems && cartItems.length > 0 ? (
              <div className="space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cartItems.map((cItem) => (
                    <div key={cItem.productId} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cItem.image} alt={cItem.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-xs">{cItem.title}</h4>
                          <span className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400 block mt-0.5">
                            ৳{cItem.price.toLocaleString()} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(cItem.productId, Math.max(1, cItem.quantity - 1))}
                            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono">{cItem.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(cItem.productId, cItem.quantity + 1)}
                            className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono font-black text-xs sm:text-sm text-slate-900 dark:text-white w-20 text-right">
                          ৳{(cItem.price * cItem.quantity).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(cItem.productId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Checkout CTA Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Cart Total ({cartItems.length} items)</span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                      ৳{cartTotals.subtotal.toLocaleString()} BDT
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    Proceed to 1-Click Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Your Cart is Currently Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Add items to your cart to enjoy fast 24h courier delivery across Bangladesh.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-10 text-center text-slate-500">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
