'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVendorStore } from '@/store/useVendorStore';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ArrowLeft, Save, Store, Mail, Phone, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function VendorSettingsPage() {
  const { profile, updateProfileLocally } = useVendorStore();

  const [formData, setFormData] = useState({
    storeName: profile?.storeName || '',
    storeDescription: profile?.storeDescription || '',
    storeBanner: profile?.storeBanner || '',
    storeLogo: profile?.storeLogo || '',
    supportEmail: profile?.supportEmail || '',
    supportPhone: profile?.supportPhone || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfileLocally(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <RoleGuard allowedRoles={['vendor', 'admin']}>
      <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href="/vendor/dashboard"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Merchant Storefront Configuration</h1>
              <p className="text-slate-400 text-sm mt-1">
                Customize your public vendor branding, profile logo, banner media, and customer support contacts.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-in fade-in-50">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Storefront profile preferences updated and saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Storefront Branding & Identity Section */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" /> Storefront Identity
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Merchant / Store Name</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                  placeholder="e.g., Apex Acoustic Studio"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Store Tagline & Description</label>
                <textarea
                  rows={3}
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                  placeholder="Briefly describe your products and brand philosophy..."
                />
              </div>
            </div>

            {/* Media Assets */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" /> Media & Visual Branding
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Store Header Banner URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={formData.storeBanner}
                    onChange={(e) => setFormData({ ...formData, storeBanner: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Store Avatar / Logo URL</label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={formData.storeLogo}
                    onChange={(e) => setFormData({ ...formData, storeLogo: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>

           
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" /> Customer Support Contacts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                      placeholder="support@yourstore.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Support Hotline</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={formData.supportPhone}
                      onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-white text-sm"
                      placeholder="+1 (800) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Store Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
