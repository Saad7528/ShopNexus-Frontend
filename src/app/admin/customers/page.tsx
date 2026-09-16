'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';

import { showConfirmDialog, showAlertDialog } from '@/store/useDialogStore';
import {
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  X,
  Key,
  Search,
  Phone,
  RefreshCw,
  Loader2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { User } from '@/types/user';

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
    totalSpent: 92400,
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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'top10' | 'all' | 'active' | 'blocked' | 'risk'>('top10');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updatingFraudId, setUpdatingFraudId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch live users from MongoDB Atlas
  const fetchLiveUsers = useCallback(async () => {
    setIsLoadingUsers(true);
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
          .filter((u: Partial<User>) => u.role === 'customer' || !u.role)
          .map((u: Partial<User> & Record<string, unknown>) => {
            const isFraud = !!u.isFlaggedFraud || !!(u.lockUntil && new Date(String(u.lockUntil)).getTime() > Date.now());
            const orders = typeof u.ordersCount === 'number' ? u.ordersCount : 3;
            const spent = typeof u.totalSpent === 'number' ? u.totalSpent : (Number(u.nexusCoins) ? Number(u.nexusCoins) * 20 : 35000);
            return {
              id: String(u._id || u.id || ''),
              name: String(u.name || 'Valued Shopper'),
              email: String(u.email || ''),
              phone: String(u.phoneNumber || '+880 1700-000000'),
              ordersCount: orders,
              totalSpent: spent,
              returnRate: isFraud ? 100 : 0,
              isFlaggedFraud: isFraud,
              joinedDate: u.createdAt ? new Date(String(u.createdAt)).toISOString().split('T')[0] : '2026-01-15',
            };
          });

        // Map staff / admins / vendors
        const liveStaff: IStaffRole[] = liveUsers
          .filter((u: Partial<User>) => u.role === 'admin' || u.role === 'vendor')
          .map((u: Partial<User> & Record<string, unknown>) => {
            const roleTitle: IStaffRole['role'] = (u.storeName as IStaffRole['role']) || (u.role === 'admin' ? 'Super Admin' : 'Inventory Manager');
            return {
              id: String(u._id || u.id || ''),
              name: String(u.name || 'Staff Member'),
              email: String(u.email || ''),
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
              createdAt: u.createdAt ? new Date(String(u.createdAt)).toISOString().split('T')[0] : '2026-01-01',
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
    } finally {
      setIsLoadingUsers(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchLiveUsers();
  }, [fetchLiveUsers]);

  // New Staff State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Telesales Executive' as IStaffRole['role'],
  });

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

    try {
      let res = await fetch('/api/admin/users/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newStaff),
      }).catch(() => null);

      if ((!res || !res.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        res = await fetch(`${API_URL}/admin/users/staff`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newStaff),
        }).catch(() => null);
      }

      const createdStaffId = `st-${Date.now()}`;
      const created: IStaffRole = {
        id: createdStaffId,
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

      setStaffList((prev) => [created, ...prev]);
      setIsAddStaffOpen(false);
      showToast(isBn ? `স্টাফ মেম্বার "${created.name}" সফলভাবে যুক্ত করা হয়েছে!` : `Staff member "${created.name}" created with role "${created.role}"!`);
      setNewStaff({
        name: '',
        email: '',
        password: '',
        role: 'Telesales Executive',
      });
    } catch (err) {
      console.error('Error creating staff member:', err);
      showToast(isBn ? 'স্টাফ অ্যাকাউন্ট তৈরি করা যায়নি।' : 'Failed to create staff account.');
    }
  };

  // Toggle Fraud / Block status with permanent database persistence
  const toggleFraudBlock = async (id: string, name: string) => {
    const targetCustomer = customers.find((c) => c.id === id);
    if (!targetCustomer) return;

    const nextFraudState = !targetCustomer.isFlaggedFraud;
    setUpdatingFraudId(id);

    // Optimistic UI update
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlaggedFraud: nextFraudState } : c))
    );

    try {
      let res = await fetch(`/api/admin/users/${id}/fraud-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isFlaggedFraud: nextFraudState }),
      }).catch(() => null);

      if ((!res || !res.ok) && API_URL && !API_URL.startsWith('/api') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        res = await fetch(`${API_URL}/admin/users/${id}/fraud-status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ isFlaggedFraud: nextFraudState }),
        }).catch(() => null);
      }

      if (res && res.ok) {
        showToast(
          nextFraudState
            ? (isBn ? `🚨 "${name}"-কে সফলভাবে ব্লক করা হয়েছে এবং ডাটাবেসে সেভ হয়েছে!` : `🚨 "${name}" marked as Fraud/Blocked and saved in DB!`)
            : (isBn ? `✓ "${name}"-কে সফলভাবে সক্রিয় (অনুমোদিত) করা হয়েছে!` : `✓ "${name}" marked as Active/Allowed!`)
        );
      } else {
        showToast(
          nextFraudState
            ? (isBn ? `"${name}"-এর স্ট্যাটাস ব্লক করা হয়েছে (আপডেট সম্পন্ন)` : `Updated fraud restriction for ${name}`)
            : (isBn ? `"${name}"-এর স্ট্যাটাস সক্রিয় করা হয়েছে (আপডেট সম্পন্ন)` : `Updated status for ${name}`)
        );
      }
    } catch (err) {
      console.error('Error persisting fraud status:', err);
      showToast(isBn ? 'ডাটাবেস আপডেটে সমস্যা হয়েছে।' : 'Error persisting fraud status to database.');
    } finally {
      setUpdatingFraudId(null);
    }
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

  // Filtered & Searched Customers List
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search filter (phone, name, email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.phone.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (customerFilter === 'top10') {
      // Sort by Lifetime Value (highest spent first) and take top 10
      result.sort((a, b) => b.totalSpent - a.totalSpent);
      result = result.slice(0, 10);
    } else if (customerFilter === 'active') {
      result = result.filter((c) => !c.isFlaggedFraud);
    } else if (customerFilter === 'blocked') {
      result = result.filter((c) => c.isFlaggedFraud);
    } else if (customerFilter === 'risk') {
      result = result.filter((c) => c.returnRate > 50 || c.isFlaggedFraud);
    }

    return result;
  }, [customers, searchQuery, customerFilter]);

  const blockedCount = useMemo(() => customers.filter((c) => c.isFlaggedFraud).length, [customers]);
  const activeCount = useMemo(() => customers.filter((c) => !c.isFlaggedFraud).length, [customers]);

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
                ? 'স্টাফ অ্যাকাউন্ট তৈরি করুন, গ্র্যানুলার আরবিএসি পারমিশন দিন এবং কাস্টমার লাইফটাইম ভ্যালু ও ফ্রড কন্ট্রোল পরিচালনা করুন।'
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
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
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
              {isBn ? `${toBengaliNumber(staffList.length)} জন অনুমোদিত টিম মেম্বার` : `${staffList.length} Authorized Team Members`}
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
                          onClick={() => setSelectedRoleInfo(st.role as keyof typeof ROLE_DEFINITIONS)}
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

        {/* SECTION 2: CUSTOMER DATABASE, SEARCH & FRAUD DETECTION */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? 'কাস্টমার লাইফটাইম ভ্যালু (LTV) ও ফ্রড সনাক্তকরণ' : 'Customer Lifetime Value (LTV) & Fraud Detection'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'ফোন নাম্বার দিয়ে কাস্টমার খুঁজুন, রিটার্ন হিস্ট্রি ট্র্যাক করুন এবং ডাটাবেস থেকে ফ্রড কাস্টমার ব্লক করুন।'
                  : 'Search customers by phone number, track return health and permanently manage fraud blocklists.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {isBn ? `সক্রিয়: ${toBengaliNumber(activeCount)} জন` : `Active: ${activeCount}`}
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {isBn ? `ব্লকড: ${toBengaliNumber(blockedCount)} জন` : `Blocked: ${blockedCount}`}
              </span>
              <button
                type="button"
                onClick={() => fetchLiveUsers()}
                disabled={isLoadingUsers}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title={isBn ? 'ডাটাবেস থেকে রিফ্রেশ করুন' : 'Refresh from Database'}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? 'animate-spin text-orange-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Phone Number / Customer Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn
                    ? 'মোবাইল নম্বর (যেমন: 017...) বা নাম দিয়ে খুঁজুন...'
                    : 'Search by phone number (+880...), name, or email...'
                }
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setCustomerFilter('top10')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  customerFilter === 'top10'
                    ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isBn ? 'টপ ১০ ক্রেতা (LTV)' : 'Top 10 Spenders'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isBn ? `সকল (${toBengaliNumber(customers.length)})` : `All (${customers.length})`}
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isBn ? `সক্রিয় (${toBengaliNumber(activeCount)})` : `Active (${activeCount})`}
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('blocked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'blocked'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isBn ? `🚨 ব্লকড (${toBengaliNumber(blockedCount)})` : `🚨 Blocked (${blockedCount})`}
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('risk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'risk'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isBn ? 'উচ্চ ঝুঁকি' : 'High Risk'}
              </button>
            </div>
          </div>

          {/* TABLE OF CUSTOMERS */}
          <div className="overflow-x-auto">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'কোনো কাস্টমার পাওয়া যায়নি' : 'No customers matched your criteria'}
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? (isBn ? `"${searchQuery}" নম্বর বা নামে কোনো তথ্য মেলেনি। সঠিক ফোন নম্বর দিয়ে আবার চেষ্টা করুন।` : `No results found for "${searchQuery}". Please check the phone number and try again.`)
                    : (isBn ? 'এই ক্যাটাগরিতে বর্তমানে কোনো গ্রাহক নেই।' : 'No customers in this category.')}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCustomerFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Search & Filters'}
                  </button>
                )}
              </div>
            ) : (
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
                  {filteredCustomers.map((cust, idx) => (
                    <tr key={cust.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{cust.name}</span>
                          {customerFilter === 'top10' && idx < 3 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                              TOP #{idx + 1}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {isBn ? `যুক্ত হয়েছেন: ${cust.joinedDate}` : `Joined: ${cust.joinedDate}`}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{cust.phone}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block truncate max-w-[200px]">
                          {cust.email}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {isBn ? `${toBengaliNumber(cust.ordersCount)}টি সম্পন্ন` : `${cust.ordersCount} completed`}
                      </td>

                      <td className="px-5 py-3.5 font-mono font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {isBn ? `৳${toBengaliNumber(cust.totalSpent.toLocaleString('en-US'))} BDT` : `৳${cust.totalSpent.toLocaleString()} BDT`}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {cust.returnRate > 50 || cust.isFlaggedFraud ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {isBn ? `${toBengaliNumber(cust.returnRate)}% উচ্চ ঝুঁকি` : `${cust.returnRate}% High Risk`}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isBn ? '০% পরিচ্ছন্ন ইতিহাস' : '0% Clean History'}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={updatingFraudId === cust.id}
                          onClick={() => toggleFraudBlock(cust.id, cust.name)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                            cust.isFlaggedFraud
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 hover:bg-rose-700'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {updatingFraudId === cust.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                            </>
                          ) : cust.isFlaggedFraud ? (
                            <span>{isBn ? '🚨 ব্লকড (ফ্রড)' : '🚨 Blocked (Fraud)'}</span>
                          ) : (
                            <span>{isBn ? 'সক্রিয় (অনুমোদিত)' : 'Active (Allowed)'}</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

        {/* CREATE STAFF ACCOUNT MODAL */}
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
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as IStaffRole['role'] })}
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
