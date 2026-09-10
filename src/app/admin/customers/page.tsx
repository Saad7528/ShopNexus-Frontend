'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { showConfirmDialog, showAlertDialog } from '@/store/useDialogStore';
import {
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Info,
  X,
  Lock,
  Mail,
  UserCheck,
  UserX,
  Key,
  Eye,
  Edit,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';

interface IStaffRole {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Telesales Executive' | 'Delivery Officer' | 'Inventory Manager' | 'Customer Support' | 'Accountant';
  permissions: {
    canViewOrders: boolean;
    canEditOrders: boolean;
    canManageCatalog: boolean;
    canManageLogistics: boolean;
    canManageFinance: boolean;
    canAccessRBAC: boolean;
  };
  status: 'Active' | 'Suspended';
  createdAt: string;
}

interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number; // ৳ BDT
  returnRate: number;
  isFlaggedFraud: boolean;
  joinedDate: string;
}

const ROLE_DEFINITIONS = {
  'Super Admin': {
    title: { en: 'Super Admin (Master Authority)', bn: 'সুপার অ্যাডমিন (মাস্টার অথরিটি)' },
    desc: { en: 'Unrestricted master access to all databases, financial logs, RBAC roles, product pricing, and settings.', bn: 'সকল ডাটাবেস, ফাইন্যান্সিয়াল লগ, আরবিএসি রোল, প্রোডাক্ট প্রাইসিং এবং সেটিংসের সম্পূর্ণ মাস্টার অ্যাক্সেস।' },
    allowed: {
      en: ['Full Read & Write', 'RBAC Control', 'Financial Payouts', 'Catalog & Orders', 'System Deletions'],
      bn: ['সম্পূর্ণ রিড ও রাইট', 'আরবিএসি কন্ট্রোল', 'ফাইন্যান্সিয়াল পেআউট', 'ক্যাটালগ ও অর্ডার', 'সিস্টেম ডিলিটেশন']
    },
    restricted: { en: ['None'], bn: ['কোনোটি নয়'] },
  },
  'Telesales Executive': {
    title: { en: 'Telesales / Order Confirmation Executive', bn: 'টেলিসেলস / অর্ডার কনফার্মেশন এক্সিকিউটিভ' },
    desc: { en: 'Communicates with customers, confirms pending cash-on-delivery orders, and verifies delivery addresses.', bn: 'গ্রাহকদের সাথে যোগাযোগ, ক্যাশ-অন-ডেলিভারি অর্ডার নিশ্চিতকরণ এবং ডেলিভারি ঠিকানা যাচাই।' },
    allowed: {
      en: ['View Pending Orders', 'Confirm/Cancel Orders', 'Update Delivery Address', 'Customer Notes'],
      bn: ['পেন্ডিং অর্ডার দেখা', 'অর্ডার কনফার্ম/ক্যান্সেল', 'ডেলিভারি ঠিকানা আপডেট', 'কাস্টমার নোটস']
    },
    restricted: {
      en: ['No Product Pricing Access', 'No Stock Adjustments', 'No Financial Balances'],
      bn: ['প্রোডাক্টের দাম পরিবর্তন নিষিদ্ধ', 'স্টক সমন্বয় নিষিদ্ধ', 'আর্থিক ব্যালেন্স দেখা নিষিদ্ধ']
    },
  },
  'Delivery Officer': {
    title: { en: 'Delivery & Tracking Officer', bn: 'ডেলিভারি ও ট্র্যাকিং অফিসার' },
    desc: { en: 'Oversees packaging, assigns 3rd-party couriers (Pathao/RedX/Steadfast), and generates shipping labels.', bn: 'প্যাকেজিং তদারকি, কুরিয়ার (পাঠাও/রেডএক্স/স্টেডফাস্ট) অ্যাসাইন এবং শিপিং লেবেল প্রস্তুতকরণ।' },
    allowed: {
      en: ['View Order Details', 'Generate Barcode Invoices', 'Update 5-Stage Courier Status', 'Logistics Dispatch'],
      bn: ['অর্ডারের বিস্তারিত দেখা', 'বারকোড ইনভয়েস তৈরি', '৫-ধাপ কুরিয়ার স্ট্যাটাস আপডেট', 'লজিস্টিকস ডিসপ্যাচ']
    },
    restricted: {
      en: ['No Customer Billing Edits', 'No Catalog Uploads', 'No Financial Reports'],
      bn: ['কাস্টমার বিলিং পরিবর্তন নিষিদ্ধ', 'ক্যাটালগ আপলোড নিষিদ্ধ', 'ফাইন্যান্সিয়াল রিপোর্ট নিষিদ্ধ']
    },
  },
  'Inventory Manager': {
    title: { en: 'Catalog / Inventory Manager', bn: 'ক্যাটালগ / ইনভেন্টরি ম্যানেজার' },
    desc: { en: 'Uploads new products, manages variants, adjusts stock units, and sets low-stock thresholds.', bn: 'নতুন পণ্য আপলোড, ভ্যারিয়েন্ট ব্যবস্থাপনা, স্টক সংখ্যা সমন্বয় এবং লো-স্টক থ্রেশহোল্ড সেট করা।' },
    allowed: {
      en: ['Upload Products', 'Adjust Stock & SKU', 'Edit Descriptions & Media', 'Set Flash Quotas'],
      bn: ['পণ্য আপলোড', 'স্টক ও এসকেইউ সমন্বয়', 'বিবরণ ও ছবি এডিট', 'ফ্ল্যাশ কোটা নির্ধারণ']
    },
    restricted: {
      en: ['No Customer Order Data', 'No Payment Gateway Info', 'No Staff Accounts'],
      bn: ['কাস্টমার অর্ডার তথ্য দেখা নিষিদ্ধ', 'পেমেন্ট গেটওয়ে নিষিদ্ধ', 'স্টাফ একাউন্ট নিয়ন্ত্রণ নিষিদ্ধ']
    },
  },
  'Customer Support': {
    title: { en: 'Customer Support Agent', bn: 'কাস্টমার সাপোর্ট এজেন্ট' },
    desc: { en: 'Manages incoming customer inquiries, AI chat escalations, reviews moderation, and return RMA requests.', bn: 'গ্রাহকের অনুসন্ধান পরিচালনা, এআই চ্যাট হ্যান্ডওভার, রিভিউ নিয়ন্ত্রণ এবং রিটার্ন আরএমএ অনুরোধ প্রসেস।' },
    allowed: {
      en: ['View Customer Queries', 'Process Return Requests', 'Moderate Product Reviews'],
      bn: ['গ্রাহকের মেসেজ দেখা', 'রিটার্ন অনুরোধ প্রসেস', 'প্রোডাক্ট রিভিউ মডারেশন']
    },
    restricted: {
      en: ['No Order Price Modifications', 'No Database Direct Changes', 'No Staff Access'],
      bn: ['অর্ডার মূল্য পরিবর্তন নিষিদ্ধ', 'ডাটাবেস পরিবর্তন নিষিদ্ধ', 'স্টাফ একাউন্ট অ্যাক্সেস নিষিদ্ধ']
    },
  },
  Accountant: {
    title: { en: 'Accountant / Financial Manager', bn: 'অ্যাকাউন্ট্যান্ট / ফাইন্যান্সিয়াল ম্যানেজার' },
    desc: { en: 'Audits daily sales, reconciles bKash/Nagad/Stripe payouts, and analyzes revenue growth reports.', bn: 'দৈনিক বিক্রয় অডিট, বিকাশ/নগদ/কার্ড পেআউট রিকনসাইল এবং রাজস্ব রিপোর্ট বিশ্লেষণ।' },
    allowed: {
      en: ['View Financial Statements', 'Reconcile Gateways', 'Sales Analytics Reports', 'Refund Audits'],
      bn: ['ফাইন্যান্সিয়াল বিবরণী দেখা', 'গেটওয়ে রিকনসিলেশন', 'সেলস অ্যানালিটিক্স রিপোর্ট', 'রিফান্ড অডিট']
    },
    restricted: {
      en: ['No Catalog Modifications', 'No Live Dispatch Management'],
      bn: ['ক্যাটালগ পরিবর্তন নিষিদ্ধ', 'লাইভ ডিসপ্যাচ নিষিদ্ধ']
    },
  },
};

const INITIAL_STAFF: IStaffRole[] = [
  {
    id: 'st-1',
    name: 'S.M. Amirul Islam Saad',
    email: 'saad@shopnexus.io',
    role: 'Super Admin',
    permissions: {
      canViewOrders: true,
      canEditOrders: true,
      canManageCatalog: true,
      canManageLogistics: true,
      canManageFinance: true,
      canAccessRBAC: true,
    },
    status: 'Active',
    createdAt: '2026-01-01',
  },
  {
    id: 'st-2',
    name: 'Kabir Hossain',
    email: 'kabir.orders@shopnexus.io',
    role: 'Telesales Executive',
    permissions: {
      canViewOrders: true,
      canEditOrders: true,
      canManageCatalog: false,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    },
    status: 'Active',
    createdAt: '2026-03-15',
  },
  {
    id: 'st-3',
    name: 'Mehedi Hasan',
    email: 'mehedi.logistics@shopnexus.io',
    role: 'Delivery Officer',
    permissions: {
      canViewOrders: true,
      canEditOrders: false,
      canManageCatalog: false,
      canManageLogistics: true,
      canManageFinance: false,
      canAccessRBAC: false,
    },
    status: 'Active',
    createdAt: '2026-04-10',
  },
  {
    id: 'st-4',
    name: 'Naimur Rahman',
    email: 'naimur.catalog@shopnexus.io',
    role: 'Inventory Manager',
    permissions: {
      canViewOrders: false,
      canEditOrders: false,
      canManageCatalog: true,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    },
    status: 'Active',
    createdAt: '2026-05-02',
  },
];

const INITIAL_CUSTOMERS: ICustomer[] = [
  {
    id: 'cust-1',
    name: 'Tanvir Hossain',
    email: 'tanvir.dev@gmail.com',
    phone: '+880 1712-345678',
    ordersCount: 8,
    totalSpent: 148500,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-02-12',
  },
  {
    id: 'cust-2',
    name: 'Sarah Rahman',
    email: 'sarah.audio@gmail.com',
    phone: '+880 1819-876543',
    ordersCount: 5,
    totalSpent: 92400, // ৳ 92,400
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-03-01',
  },
  {
    id: 'cust-3',
    name: 'Fake Suspicious User',
    email: 'fake.account99@tempmail.com',
    phone: '+880 1300-000000',
    ordersCount: 3,
    totalSpent: 0,
    returnRate: 100,
    isFlaggedFraud: true,
    joinedDate: '2026-08-20',
  },
];

export default function AdminCustomersRBACPage() {
  const { token } = useAuthStore();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const [staffList, setStaffList] = useState<IStaffRole[]>(INITIAL_STAFF);
  const [customers, setCustomers] = useState<ICustomer[]>(INITIAL_CUSTOMERS);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<keyof typeof ROLE_DEFINITIONS | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch live users from MongoDB Atlas
  React.useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        let res = await fetch('/api/admin/users', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }).catch(() => null);

        if ((!res || !res.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          res = await fetch(`${API_URL}/admin/users`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }).catch(() => null);
        }

        if (!res || !res.ok) return;
        const data = await res.json().catch(() => null);
        if (data?.data && Array.isArray(data.data)) {
          const liveUsers = data.data;

          // Map customers
          const liveCustomers: ICustomer[] = liveUsers
            .filter((u: any) => u.role === 'customer' || !u.role)
            .map((u: any) => ({
              id: u._id,
              name: u.name || 'Valued Shopper',
              email: u.email,
              phone: u.phoneNumber || '+880 1700-000000',
              ordersCount: 3,
              totalSpent: u.nexusCoins ? u.nexusCoins * 20 : 35000,
              returnRate: 0,
              isFlaggedFraud: !!u.isLocked,
              joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-01-15',
            }));

          // Map staff / admins / vendors
          const liveStaff: IStaffRole[] = liveUsers
            .filter((u: any) => u.role === 'admin' || u.role === 'vendor')
            .map((u: any) => {
              const roleTitle: IStaffRole['role'] = u.role === 'admin' ? 'Super Admin' : 'Inventory Manager';
              return {
                id: u._id,
                name: u.name,
                email: u.email,
                role: roleTitle,
                permissions: {
                  canViewOrders: true,
                  canEditOrders: u.role === 'admin',
                  canManageCatalog: true,
                  canManageLogistics: u.role === 'admin',
                  canManageFinance: u.role === 'admin',
                  canAccessRBAC: u.role === 'admin',
                },
                status: 'Active',
                createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-01-01',
              };
            });

          if (liveCustomers.length > 0) {
            setCustomers((prev) => {
              const ids = new Set(liveCustomers.map((c) => c.id));
              return [...liveCustomers, ...prev.filter((c) => !ids.has(c.id))];
            });
          }

          if (liveStaff.length > 0) {
            setStaffList((prev) => {
              const ids = new Set(liveStaff.map((s) => s.id));
              return [...liveStaff, ...prev.filter((s) => !ids.has(s.id))];
            });
          }
        }
      } catch (err) {
        console.error('Could not fetch live users from DB:', err);
      }
    };

    fetchLiveUsers();
  }, [API_URL, token]);

  // New Staff State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Telesales Executive' as IStaffRole['role'],
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      await showAlertDialog({
        title: isBn ? 'সকল তথ্য পূরণ করুন' : 'Incomplete Fields',
        message: isBn ? 'অনুগ্রহ করে সকল স্টাফ ফিল্ড পূরণ করুন (নাম, ইমেইল, পাসওয়ার্ড)।' : 'Please fill out all staff fields (Name, Gmail, Password).',
        type: 'warning',
        confirmText: isBn ? 'ঠিক আছে' : 'OK',
      });
      return;
    }

    const created: IStaffRole = {
      id: `st-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      permissions: {
        canViewOrders: newStaff.role !== 'Inventory Manager',
        canEditOrders: newStaff.role === 'Telesales Executive' || newStaff.role === 'Super Admin',
        canManageCatalog: newStaff.role === 'Inventory Manager' || newStaff.role === 'Super Admin',
        canManageLogistics: newStaff.role === 'Delivery Officer' || newStaff.role === 'Super Admin',
        canManageFinance: newStaff.role === 'Accountant' || newStaff.role === 'Super Admin',
        canAccessRBAC: newStaff.role === 'Super Admin',
      },
      status: 'Active',
      createdAt: 'Just now',
    };

    setStaffList([...staffList, created]);
    setIsAddStaffOpen(false);
    showToast(`Staff member "${created.name}" created with role "${created.role}"!`);
    setNewStaff({
      name: '',
      email: '',
      password: '',
      role: 'Telesales Executive',
    });
  };

  const toggleFraudBlock = (id: string, name: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlaggedFraud: !c.isFlaggedFraud } : c))
    );
    showToast(`Updated fraud restriction status for ${name}`);
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    const isConfirmed = await showConfirmDialog({
      title: isBn ? 'স্টাফ এক্সেস বাতিল করবেন?' : 'Revoke Staff Access?',
      message: isBn
        ? `আপনি কি নিশ্চিত যে "${name}"-এর স্টাফ ক্রেডেনশিয়াল বাতিল করতে চান?`
        : `Are you sure you want to revoke credentials for "${name}"?`,
      type: 'danger',
      confirmText: isBn ? 'হ্যাঁ, বাতিল করুন' : 'Revoke Access',
      cancelText: isBn ? 'বাতিল' : 'Cancel',
    });

    if (isConfirmed) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Revoked staff access for "${name}"`);

      // Async DB deletion if Mongo ID
      try {
        await fetch(`${API_URL}/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } catch (err) {
        console.error('Error deleting staff from DB:', err);
      }
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isBn ? 'অ্যাক্সেস কন্ট্রোল (RBAC) ও সিকিউরিটি' : 'Access Control (RBAC) & Security'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isBn ? 'স্টাফ রোল ও কাস্টমার সিকিউরিটি' : 'Staff Roles & Customer Security'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'স্টাফ অ্যাকাউন্ট তৈরি করুন, গ্র্যানুলার আরবিএসি পারমিশন দিন এবং ফ্রড কাস্টমারদের ব্লক করুন।'
                : 'Create staff accounts with Gmail & password, assign granular RBAC module permissions, and manage customer fraud blocklists.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddStaffOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              {isBn ? 'স্টাফ একাউন্ট তৈরি করুন' : 'Create Staff Account'}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toastMsg}
          </div>
        )}

        {/* SECTION 1: STAFF ROLES & PERMISSIONS TABLE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isBn ? 'স্টাফ অ্যাকাউন্ট ও আরবিএসি পারমিশন' : 'Staff Accounts & RBAC Permissions'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? `${staffList.length} জন অনুমোদিত টিম মেম্বার` : `${staffList.length} Authorized Team Members`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">{isBn ? 'স্টাফ মেম্বার' : 'Staff Member'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'জিমেইল লগইন' : 'Gmail Login'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'নির্ধারিত রোল' : 'Assigned Role'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'পারমিশন স্কোপ' : 'Permission Scope'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-5 py-3.5 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {isBn ? `যুক্ত হয়েছেন ${st.createdAt}` : `Joined ${st.createdAt}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-orange-600 dark:text-orange-400 text-[11px] font-semibold">{st.email}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                          {ROLE_DEFINITIONS[st.role as keyof typeof ROLE_DEFINITIONS] ? (isBn ? ROLE_DEFINITIONS[st.role as keyof typeof ROLE_DEFINITIONS].title.bn : ROLE_DEFINITIONS[st.role as keyof typeof ROLE_DEFINITIONS].title.en) : st.role}
                        </span>
                        {/* Info Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedRoleInfo(st.role as any)}
                          className="p-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs transition-colors cursor-pointer"
                          title={isBn ? 'বিস্তারিত পারমিশন দেখতে ক্লিক করুন' : 'Click to view detailed permissions (i-button)'}
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {st.permissions.canManageCatalog && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                            {isBn ? 'ক্যাটালগ' : 'Catalog'}
                          </span>
                        )}
                        {st.permissions.canEditOrders && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                            {isBn ? 'অর্ডার' : 'Orders'}
                          </span>
                        )}
                        {st.permissions.canManageLogistics && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                            {isBn ? 'লজিস্টিকস' : 'Logistics'}
                          </span>
                        )}
                        {st.permissions.canAccessRBAC && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold">
                            {isBn ? 'মাস্টার অ্যাডমিন' : 'Master Admin'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {isBn ? (st.status === 'Active' ? 'সক্রিয়' : 'স্থগিত') : st.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {st.role !== 'Super Admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(st.id, st.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                          title={isBn ? 'অ্যাক্সেস প্রত্যাহার করুন' : 'Revoke Credentials'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: CUSTOMER DATABASE & FRAUD DETECTION */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isBn ? 'কাস্টমার লাইফটাইম ভ্যালু (LTV) ও ফ্রড সনাক্তকরণ' : 'Customer Lifetime Value (LTV) & Fraud Detection'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {isBn ? 'কাস্টমারদের রিটার্ন হিস্ট্রি ট্র্যাক করুন ও ফেক অর্ডার ব্লক করুন' : 'Track customer return history & block fake spam orders'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">{isBn ? 'কাস্টমার' : 'Customer'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'ফোন ও ইমেইল' : 'Phone & Email'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'অর্ডার' : 'Orders'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'লাইফটাইম ভ্যালু (৳ BDT)' : 'Lifetime Value (৳ BDT)'}</th>
                  <th className="px-5 py-3.5">{isBn ? 'রিটার্ন হেলথ' : 'Return Health'}</th>
                  <th className="px-5 py-3.5 text-right">{isBn ? 'ফ্রড কন্ট্রোল' : 'Fraud Control'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{cust.name}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <div>{cust.phone}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">{cust.email}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {isBn ? `${toBengaliNumber(cust.ordersCount)}টি সম্পন্ন` : `${cust.ordersCount} completed`}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {isBn ? `৳${toBengaliNumber(cust.totalSpent.toLocaleString('en-US'))} BDT` : `৳${cust.totalSpent.toLocaleString()} BDT`}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {cust.returnRate > 50 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20 whitespace-nowrap">
                          {isBn ? `${toBengaliNumber(cust.returnRate)}% উচ্চ রিটার্ন ঝুঁকি` : `${cust.returnRate}% High Return Risk`}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold whitespace-nowrap">
                          {isBn ? '০% পরিচ্ছন্ন ইতিহাস' : '0% Clean History'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleFraudBlock(cust.id, cust.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cust.isFlaggedFraud
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {cust.isFlaggedFraud ? (isBn ? '🚨 ব্লকড (ফ্রড)' : '🚨 Blocked (Fraud)') : (isBn ? 'সক্রিয় (অনুমোদিত)' : 'Active (Allowed)')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROLE PERMISSION BREAKDOWN MODAL (Triggered by i-button) */}
        {selectedRoleInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isBn ? ROLE_DEFINITIONS[selectedRoleInfo].title.bn : ROLE_DEFINITIONS[selectedRoleInfo].title.en}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRoleInfo(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isBn ? ROLE_DEFINITIONS[selectedRoleInfo].desc.bn : ROLE_DEFINITIONS[selectedRoleInfo].desc.en}
              </p>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1.5">
                    {isBn ? '✓ অনুমোদিত অ্যাক্সেস মডিউলসমূহ:' : '✓ Permitted Access Modules:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(isBn ? ROLE_DEFINITIONS[selectedRoleInfo].allowed.bn : ROLE_DEFINITIONS[selectedRoleInfo].allowed.en).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1.5">
                    {isBn ? '✕ সীমাবদ্ধ / ব্লকড ফিচারসমূহ:' : '✕ Restricted / Blocked Features:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(isBn ? ROLE_DEFINITIONS[selectedRoleInfo].restricted.bn : ROLE_DEFINITIONS[selectedRoleInfo].restricted.en).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRoleInfo(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close Specification'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ➕ CREATE STAFF ACCOUNT MODAL */}
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'স্টাফ লগইন তৈরি করুন' : 'Create Staff Login'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isBn ? 'স্টাফের পুরো নাম *' : 'Staff Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? 'উদাঃ মাহবুব আলম' : 'e.g. Mahbub Alam'}
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isBn ? 'স্টাফ জিমেইল / ইমেইল ঠিকানা *' : 'Staff Gmail / Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mahbub@shopnexus.io"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isBn ? 'নিরাপদ পাসওয়ার্ড *' : 'Secure Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isBn ? 'নির্ধারিত পদবি *' : 'Designated Role *'}
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Telesales Executive">{isBn ? 'টেলিসেলস / অর্ডার নিশ্চিতকরণ এক্সিকিউটিভ' : 'Telesales / Order Confirmation Executive'}</option>
                    <option value="Delivery Officer">{isBn ? 'ডেলিভারি ও ট্র্যাকিং অফিসার' : 'Delivery & Tracking Officer'}</option>
                    <option value="Inventory Manager">{isBn ? 'ক্যাটালগ / ইনভেন্টরি ম্যানেজার' : 'Catalog / Inventory Manager'}</option>
                    <option value="Customer Support">{isBn ? 'কাস্টমার সাপোর্ট এজেন্ট' : 'Customer Support Agent'}</option>
                    <option value="Accountant">{isBn ? 'অ্যাকাউন্ট্যান্ট / ফাইন্যান্সিয়াল ম্যানেজার' : 'Accountant / Financial Manager'}</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/25 cursor-pointer"
                  >
                    {isBn ? 'স্টাফ একাউন্ট তৈরি করুন' : 'Create Staff Credentials'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

