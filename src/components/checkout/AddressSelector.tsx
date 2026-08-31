'use client';

import React, { useState } from 'react';
import { MapPin, User, Phone, Home, Building2, Check, Edit3 } from 'lucide-react';

export interface IShippingAddressForm {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IAddressValidationResult {
  isValid: boolean;
  nameError?: string;
  phoneError?: string;
  addressError?: string;
}

export function validateSmartShippingAddress(addr: IShippingAddressForm): IAddressValidationResult {
  const result: IAddressValidationResult = { isValid: true };
  const trimmedName = (addr.fullName || '').trim();
  const nameRegex = /^[a-zA-Z\u0980-\u09FF\s.'-]{3,50}$/;
  const isRepeatedName = /^([a-zA-Z\u0980-\u09FF])\1{2,}$/i.test(trimmedName.replace(/[\s.'-]/g, ''));
  if (!trimmedName || trimmedName.length < 3 || !nameRegex.test(trimmedName) || isRepeatedName) {
    result.nameError = 'অনুগ্রহ করে আপনার সঠিক পূর্ণাঙ্গ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।';
    result.isValid = false;
  }
  const cleanPhone = (addr.phoneNumber || '').replace(/[^0-9]/g, '');
  const bdPhoneRegex = /^(?:8801|01)[3-9]\d{8}$/;
  const isRepeatedPhone =
    /^(\d)\1+$/.test(cleanPhone) ||
    /^(?:8801|01)[3-9](\d)\1{7}$/.test(cleanPhone);
  if (!cleanPhone || !bdPhoneRegex.test(cleanPhone) || isRepeatedPhone) {
    result.phoneError = 'সঠিক ১১ ডিজিটের সচল বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 01712345678 বা 018...)।';
    result.isValid = false;
  }
  const trimmedAddress = (addr.streetAddress || '').trim();
  const addressWords = trimmedAddress.split(/[\s,.-]+/).filter((w) => w.length > 0);
  const isRepeatedAddress = /^([a-zA-Z\u0980-\u09FF0-9])\1{3,}$/i.test(trimmedAddress.replace(/[\s,.-]/g, ''));
  if (!trimmedAddress || trimmedAddress.length < 8 || addressWords.length < 2 || isRepeatedAddress) {
    result.addressError = 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (যেমন: বাসা/রোড নম্বর, ফ্ল্যাট, এলাকা/থানা)।';
    result.isValid = false;
  }
  return result;
}
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressSelectorProps {
  currentAddress: IShippingAddressForm;
  onAddressChange: (address: IShippingAddressForm) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  currentAddress,
  onAddressChange,
}) => {
  const isInitialEmpty = !currentAddress.fullName || !currentAddress.streetAddress;
  const [isEditing, setIsEditing] = useState(isInitialEmpty);
  const [formData, setFormData] = useState<IShippingAddressForm>({
    fullName: currentAddress.fullName || '',
    phoneNumber: currentAddress.phoneNumber || '',
    streetAddress: currentAddress.streetAddress || '',
    city: currentAddress.city || 'Dhaka',
    state: currentAddress.state || 'Dhaka Division',
    zipCode: currentAddress.zipCode || '1213',
    country: currentAddress.country || 'Bangladesh',
  });

  const handleFieldChange = (field: keyof IShippingAddressForm, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onAddressChange(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressChange(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {!isEditing && currentAddress.fullName ? (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 mt-1">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">{currentAddress.fullName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Recipient Address
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{currentAddress.streetAddress}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentAddress.city}, {currentAddress.state} - {currentAddress.zipCode}, {currentAddress.country}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-mono font-semibold">Phone: {currentAddress.phoneNumber}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-orange-500/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> Recipient Information (Guest / 1-Click Entry)
            </h4>
            {!isInitialEmpty && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Done
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                আপনার নাম (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. S.M. Amirul Islam"
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর (Phone Number for SMS Alert) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              সম্পূর্ণ ঠিকানা (Street Address / House / Road) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House 42, Road 11, Banani Block-D"
              value={formData.streetAddress}
              onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">শহর (City)</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">বিভাগ (Division)</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">পোস্ট কোড</label>
              <input
                type="text"
                required
                value={formData.zipCode}
                onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};