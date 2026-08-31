'use client';

import React, { useState } from 'react';
import { MapPin, User, Phone, Home, Building2, Check, Edit3, AlertCircle } from 'lucide-react';

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

  // 1. Name Check (At least 3 chars, letters/spaces only, no single-char repetition like 'fff' or 'aaa')
  const trimmedName = (addr.fullName || '').trim();
  const nameRegex = /^[a-zA-Z\u0980-\u09FF\s.'-]{3,50}$/;
  const isRepeatedName = /^([a-zA-Z\u0980-\u09FF])\1{2,}$/i.test(trimmedName.replace(/[\s.'-]/g, ''));

  if (!trimmedName || trimmedName.length < 3 || !nameRegex.test(trimmedName) || isRepeatedName) {
    result.nameError = 'অনুগ্রহ করে আপনার সঠিক পূর্ণাঙ্গ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।';
    result.isValid = false;
  }

  // 2. Bangladeshi Phone Number Check (Must be 11 digits starting with 013-019 or +88013-019, no fake repetition)
  const cleanPhone = (addr.phoneNumber || '').replace(/[^0-9]/g, '');
  const bdPhoneRegex = /^(?:8801|01)[3-9]\d{8}$/;
  // Check repetition like 00000000000, 22222222222, 11111111111, or 01700000000
  const isRepeatedPhone =
    /^(\d)\1+$/.test(cleanPhone) ||
    /^(?:8801|01)[3-9](\d)\1{7}$/.test(cleanPhone);

  if (!cleanPhone || !bdPhoneRegex.test(cleanPhone) || isRepeatedPhone) {
    result.phoneError = 'সঠিক ১১ ডিজিটের সচল বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 01712345678 বা 018...)।';
    result.isValid = false;
  }

  // 3. Street Address Check (At least 8 chars, at least 2 distinct words, no single letter or junk)
  const trimmedAddress = (addr.streetAddress || '').trim();
  const addressWords = trimmedAddress.split(/[\s,.-]+/).filter((w) => w.length > 0);
  const isRepeatedAddress = /^([a-zA-Z\u0980-\u09FF0-9])\1{3,}$/i.test(trimmedAddress.replace(/[\s,.-]/g, ''));

  if (!trimmedAddress || trimmedAddress.length < 8 || addressWords.length < 2 || isRepeatedAddress) {
    result.addressError = 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (যেমন: বাসা/রোড নম্বর, ফ্ল্যাট, এলাকা/থানা)।';
    result.isValid = false;
  }

  return result;
}

interface AddressSelectorProps {
  currentAddress: IShippingAddressForm;
  onAddressChange: (address: IShippingAddressForm) => void;
  errorMessage?: string | null;
  forceShowErrors?: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  currentAddress,
  onAddressChange,
  errorMessage,
  forceShowErrors = false,
}) => {
  const initialValidation = validateSmartShippingAddress(currentAddress);
  const [isEditing, setIsEditing] = useState(!initialValidation.isValid);
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  
  const [formData, setFormData] = useState<IShippingAddressForm>({
    fullName: currentAddress.fullName || '',
    phoneNumber: currentAddress.phoneNumber || '',
    streetAddress: currentAddress.streetAddress || '',
    city: currentAddress.city || 'Dhaka',
    state: currentAddress.state || 'Dhaka Division',
    zipCode: currentAddress.zipCode || '1213',
    country: 'Bangladesh',
  });

  const validation = validateSmartShippingAddress(formData);

  const handleFieldChange = (field: keyof IShippingAddressForm, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onAddressChange(updated);
    setTouched((prev) => ({ ...prev, [field === 'fullName' ? 'name' : field === 'phoneNumber' ? 'phone' : 'address']: true }));
  };

  const handleSaveDone = () => {
    setTouched({ name: true, phone: true, address: true });
    if (!validation.isValid) {
      return;
    }
    onAddressChange(formData);
    setIsEditing(false);
  };

  const showNameError = (touched.name || forceShowErrors || !!errorMessage) && !!validation.nameError;
  const showPhoneError = (touched.phone || forceShowErrors || !!errorMessage) && !!validation.phoneError;
  const showAddressError = (touched.address || forceShowErrors || !!errorMessage) && !!validation.addressError;

  return (
    <div className="space-y-4">
      {!isEditing && validation.isValid ? (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 mt-1">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">{currentAddress.fullName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified Address
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{currentAddress.streetAddress}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentAddress.city}, {currentAddress.state} - {currentAddress.zipCode}, {currentAddress.country}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-mono font-semibold">
                Phone: {currentAddress.phoneNumber}
              </p>
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
              <User className="w-4 h-4" /> Recipient Information (বাধ্যতামূলক সঠিক তথ্য)
            </h4>
            {validation.isValid && (
              <button
                type="button"
                onClick={handleSaveDone}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Done
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                আপনার নাম (Full Name) <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. S.M. Amirul Islam"
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors ${
                  showNameError
                    ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-50/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
                }`}
              />
              {showNameError && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{validation.nameError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর (Phone Number) <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 01712345678"
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                  showPhoneError
                    ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-50/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
                }`}
              />
              {showPhoneError && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{validation.phoneError}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              সম্পূর্ণ ঠিকানা (Street Address / House / Road) <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House 42, Road 11, Block-D, Banani"
              value={formData.streetAddress}
              onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, address: true }))}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors ${
                showAddressError
                  ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-50/10'
                  : 'border-slate-200 dark:border-slate-800 focus:border-orange-500'
              }`}
            />
            {showAddressError && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{validation.addressError}</span>
              </p>
            )}
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

