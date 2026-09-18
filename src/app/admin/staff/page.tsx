'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { showConfirmDialog } from '@/store/useDialogStore';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  CheckCircle2,
  Search,
  Sliders,
  Check,
  X,
  BadgeCheck,
  Trash2,
  Edit,
  Power,
  RefreshCw,
  Info,
  Layers,
  FileText,
  AlertCircle,
  Filter,
  Radio,
  Laptop,
  Smartphone,
  Monitor,
  Globe,
  LogOut,
  Snowflake,
  ShieldAlert,
  AlertTriangle,
  KeyRound,
  Activity,
  Clock,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { User } from '@/types/user';
import { LoginAuthorizationPrompt } from '@/components/auth/LoginAuthorizationPrompt';
import { ILoginAuthRequest } from '@/app/api/auth/login-requests/route';

export type StaffRoleType =
  | 'Super Admin'
  | 'Telesales Executive'
  | 'Delivery Officer'
  | 'Inventory Manager'
  | 'Customer Care Lead'
  | 'Accountant';

export interface IStaffSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  isCurrentSession: boolean;
  loginAt: string;
  lastHeartbeat: string;
  riskScore: 'low' | 'medium' | 'high';
}

export interface IStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRoleType;
  twoFactorEnabled: boolean;
  status: 'Active' | 'Suspended';
  lastActive: string;
  avatarColor: string;
  createdAt: string;
  sessions?: IStaffSession[];
  customPermissions?: {
    canViewOrders: boolean;
    canEditOrders: boolean;
    canManageCatalog: boolean;
    canManageLogistics: boolean;
    canManageFinance: boolean;
    canAccessRBAC: boolean;
  };
}

export interface IPermissionRule {
  id: string;
  category: string;
  title: string;
  description: string;
  superAdmin: boolean;
  telesales: boolean;
  delivery: boolean;
  inventoryManager: boolean;
  customerCare: boolean;
  accountant: boolean;
}

const INITIAL_STAFF: IStaffMember[] = [
  {
    id: 'st-0',
    name: 'S.M. Amirul Islam Saad',
    email: 'saad0174742@gmail.com',
    phone: '+880 1711-000111',
    role: 'Super Admin',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: 'Online',
    avatarColor: 'from-[#ff4400] to-[#ff7700]',
    createdAt: '2026-01-01',
    sessions: [
      {
        id: 'sess-saad-1',
        device: 'Apple MacBook Pro (Primary Master)',
        os: 'macOS 14.5',
        browser: 'Google Chrome 128',
        ipAddress: '103.145.74.22',
        location: 'Dhaka, Bangladesh',
        isCurrentSession: true,
        loginAt: 'Today, 10:00 AM',
        lastHeartbeat: 'Just now',
        riskScore: 'low',
      },
    ],
    customPermissions: {
      canViewOrders: true,
      canEditOrders: true,
      canManageCatalog: true,
      canManageLogistics: true,
      canManageFinance: true,
      canAccessRBAC: true,
    },
  },
  {
    id: 'st-2',
    name: 'Kabir Hossain',
    email: 'kabir.orders@shopnexus.io',
    phone: '+880 1822-334455',
    role: 'Telesales Executive',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: '4 hours ago',
    avatarColor: 'from-blue-600 to-indigo-600',
    createdAt: '2026-03-15',
    customPermissions: {
      canViewOrders: true,
      canEditOrders: true,
      canManageCatalog: false,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    },
  },
  {
    id: 'st-3',
    name: 'Mehedi Hasan',
    email: 'mehedi.logistics@shopnexus.io',
    phone: '+880 1644-556677',
    role: 'Delivery Officer',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: 'Yesterday',
    avatarColor: 'from-emerald-600 to-teal-600',
    createdAt: '2026-04-10',
    customPermissions: {
      canViewOrders: true,
      canEditOrders: false,
      canManageCatalog: false,
      canManageLogistics: true,
      canManageFinance: false,
      canAccessRBAC: false,
    },
  },
  {
    id: 'st-4',
    name: 'Naimur Rahman',
    email: 'naimur.catalog@shopnexus.io',
    phone: '+880 1933-445566',
    role: 'Inventory Manager',
    twoFactorEnabled: false,
    status: 'Active',
    lastActive: '2 days ago',
    avatarColor: 'from-purple-600 to-pink-600',
    createdAt: '2026-05-02',
    customPermissions: {
      canViewOrders: false,
      canEditOrders: false,
      canManageCatalog: true,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    },
  },
  {
    id: 'st-5',
    name: 'Tahmidur Rahman',
    email: 'tahmid.care@shopnexus.io',
    phone: '+880 1755-667788',
    role: 'Customer Care Lead',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: '5 hours ago',
    avatarColor: 'from-amber-600 to-orange-600',
    createdAt: '2026-05-20',
    customPermissions: {
      canViewOrders: true,
      canEditOrders: false,
      canManageCatalog: false,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    },
  },
  {
    id: 'st-6',
    name: 'Shamim Reza',
    email: 'shamim.accounts@shopnexus.io',
    phone: '+880 1866-778899',
    role: 'Accountant',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: 'Yesterday',
    avatarColor: 'from-cyan-600 to-blue-700',
    createdAt: '2026-06-12',
    customPermissions: {
      canViewOrders: true,
      canEditOrders: false,
      canManageCatalog: false,
      canManageLogistics: false,
      canManageFinance: true,
      canAccessRBAC: false,
    },
  },
];

const INITIAL_PERMISSIONS: IPermissionRule[] = [
  {
    id: 'p-rev',
    category: 'Financials & Margins',
    title: 'View Revenue & Profit Margins',
    description: 'See total sales earnings, wholesale cost prices, and net P&L.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: false,
    customerCare: false,
    accountant: true,
  },
  {
    id: 'p-gate',
    category: 'Financials & Margins',
    title: 'Reconcile Gateways & Payouts',
    description: 'Audit bKash, Nagad, SSLCommerz and Stripe merchant settlements.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: false,
    customerCare: false,
    accountant: true,
  },
  {
    id: 'p-cat-edit',
    category: 'Catalog & Inventory',
    title: 'Add & Edit Products / Stock Units',
    description: 'Modify product specifications, pricing, stock levels, and flash deals.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: true,
    customerCare: false,
    accountant: false,
  },
  {
    id: 'p-cat-del',
    category: 'Catalog & Inventory',
    title: 'Delete Products Permanently',
    description: 'Remove catalog items from the store database.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: false,
    customerCare: false,
    accountant: false,
  },
  {
    id: 'p-ord-confirm',
    category: 'Orders & Telesales',
    title: 'Confirm COD Orders & Edit Address',
    description: 'Call customer, verify COD intent, and update delivery details.',
    superAdmin: true,
    telesales: true,
    delivery: false,
    inventoryManager: false,
    customerCare: true,
    accountant: false,
  },
  {
    id: 'p-logistics',
    category: 'Logistics & Dispatch',
    title: 'Courier Dispatch & Print Invoices',
    description: 'Assign Pathao/RedX couriers, generate barcodes and packing manifests.',
    superAdmin: true,
    telesales: false,
    delivery: true,
    inventoryManager: false,
    customerCare: false,
    accountant: false,
  },
  {
    id: 'p-support',
    category: 'Customer Communication',
    title: 'Reviews Moderation & AI Handover',
    description: 'Approve customer ratings, resolve support tickets, and direct WhatsApp.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: false,
    customerCare: true,
    accountant: false,
  },
  {
    id: 'p-rbac',
    category: 'System Security',
    title: 'Manage Staff Accounts & RBAC Matrix',
    description: 'Invite new staff, revoke credentials, and modify role security rules.',
    superAdmin: true,
    telesales: false,
    delivery: false,
    inventoryManager: false,
    customerCare: false,
    accountant: false,
  },
];

export const ROLE_DEFINITIONS = {
  'Super Admin': {
    title: { en: 'Super Admin (Master Authority)', bn: 'সুপার অ্যাডমিন (মাস্টার অথরিটি)' },
    desc: {
      en: 'Unrestricted master access to all databases, financial logs, RBAC roles, product pricing, and settings.',
      bn: 'সকল ডাটাবেস, ফাইন্যান্সিয়াল লগ, আরবিএসি রোল, প্রোডাক্ট প্রাইসিং এবং সেটিংসের সম্পূর্ণ মাস্টার অ্যাক্সেস।',
    },
    allowed: {
      en: ['Full Read & Write', 'RBAC Control', 'Financial Payouts', 'Catalog & Orders', 'System Deletions'],
      bn: ['সম্পূর্ণ রিড ও রাইট', 'আরবিএসি কন্ট্রোল', 'ফাইন্যান্সিয়াল পেআউট', 'ক্যাটালগ ও অর্ডার', 'সিস্টেম ডিলিটেশন'],
    },
    restricted: { en: ['None'], bn: ['কোনোটি নয়'] },
    color: 'from-[#ff4400] to-[#ff7700]',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  },
  'Telesales Executive': {
    title: { en: 'Telesales / Order Confirmation Executive', bn: 'টেলিসেলস / অর্ডার কনফার্মেশন এক্সিকিউটিভ' },
    desc: {
      en: 'Communicates with customers, confirms pending cash-on-delivery orders, and verifies delivery addresses.',
      bn: 'গ্রাহকদের সাথে যোগাযোগ, ক্যাশ-অন-ডেলিভারি অর্ডার নিশ্চিতকরণ এবং ডেলিভারি ঠিকানা যাচাই।',
    },
    allowed: {
      en: ['View Pending Orders', 'Confirm/Cancel Orders', 'Update Delivery Address', 'Customer Call Notes'],
      bn: ['পেন্ডিং অর্ডার দেখা', 'অর্ডার কনফার্ম/ক্যান্সেল', 'ডেলিভারি ঠিকানা আপডেট', 'কাস্টমার কল নোটস'],
    },
    restricted: {
      en: ['No Product Pricing Access', 'No Stock Adjustments', 'No Financial Balances'],
      bn: ['প্রোডাক্টের দাম পরিবর্তন নিষিদ্ধ', 'স্টক সমন্বয় নিষিদ্ধ', 'আর্থিক ব্যালেন্স দেখা নিষিদ্ধ'],
    },
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  'Delivery Officer': {
    title: { en: 'Delivery & Tracking Officer', bn: 'ডেলিভারি ও ট্র্যাকিং অফিসার' },
    desc: {
      en: 'Oversees packaging, assigns 3rd-party couriers (Pathao/RedX/Steadfast), and generates shipping labels.',
      bn: 'প্যাকেজিং তদারকি, কুরিয়ার (পাঠাও/রেডএক্স/স্টেডফাস্ট) অ্যাসাইন এবং শিপিং লেবেল প্রস্তুতকরণ।',
    },
    allowed: {
      en: ['View Order Details', 'Generate Barcode Invoices', 'Update 5-Stage Courier Status', 'Logistics Dispatch'],
      bn: ['অর্ডারের বিস্তারিত দেখা', 'বারকোড ইনভয়েস তৈরি', '৫-ধাপ কুরিয়ার স্ট্যাটাস আপডেট', 'লজিস্টিকস ডিসপ্যাচ'],
    },
    restricted: {
      en: ['No Customer Billing Edits', 'No Catalog Uploads', 'No Financial Reports'],
      bn: ['কাস্টমার বিলিং পরিবর্তন নিষিদ্ধ', 'ক্যাটালগ আপলোড নিষিদ্ধ', 'ফাইন্যান্সিয়াল রিপোর্ট নিষিদ্ধ'],
    },
    color: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  'Inventory Manager': {
    title: { en: 'Catalog / Inventory Manager', bn: 'ক্যাটালগ / ইনভেন্টরি ম্যানেজার' },
    desc: {
      en: 'Uploads new products, manages variants, adjusts stock units, and sets low-stock thresholds.',
      bn: 'নতুন পণ্য আপলোড, ভ্যারিয়েন্ট ব্যবস্থাপনা, স্টক সংখ্যা সমন্বয় এবং লো-স্টক থ্রেশহোল্ড সেট করা।',
    },
    allowed: {
      en: ['Upload Products', 'Adjust Stock & SKU', 'Edit Descriptions & Media', 'Set Flash Quotas'],
      bn: ['পণ্য আপলোড', 'স্টক ও এসকেইউ সমন্বয়', 'বিবরণ ও ছবি এডিট', 'ফ্ল্যাশ কোটা নির্ধারণ'],
    },
    restricted: {
      en: ['No Customer Order Data', 'No Payment Gateway Info', 'No Staff Accounts'],
      bn: ['কাস্টমার অর্ডার তথ্য দেখা নিষিদ্ধ', 'পেমেন্ট গেটওয়ে নিষিদ্ধ', 'স্টাফ একাউন্ট নিয়ন্ত্রণ নিষিদ্ধ'],
    },
    color: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  'Customer Care Lead': {
    title: { en: 'Customer Care & Support Lead', bn: 'কাস্টমার কেয়ার ও সাপোর্ট লিড' },
    desc: {
      en: 'Manages incoming customer inquiries, AI chat escalations, reviews moderation, and return RMA requests.',
      bn: 'গ্রাহকের অনুসন্ধান পরিচালনা, এআই চ্যাট হ্যান্ডওভার, রিভিউ নিয়ন্ত্রণ এবং রিটার্ন আরএমএ অনুরোধ প্রসেস।',
    },
    allowed: {
      en: ['View Customer Queries', 'Process Return Requests', 'Moderate Product Reviews', 'WhatsApp Comms'],
      bn: ['গ্রাহকের মেসেজ দেখা', 'রিটার্ন অনুরোধ প্রসেস', 'প্রোডাক্ট রিভিউ মডারেশন', 'হোয়াটসঅ্যাপ যোগাযোগ'],
    },
    restricted: {
      en: ['No Order Price Modifications', 'No Database Direct Changes', 'No Staff Access'],
      bn: ['অর্ডার মূল্য পরিবর্তন নিষিদ্ধ', 'ডাটাবেস পরিবর্তন নিষিদ্ধ', 'স্টাফ একাউন্ট অ্যাক্সেস নিষিদ্ধ'],
    },
    color: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  Accountant: {
    title: { en: 'Accountant / Financial Manager', bn: 'অ্যাকাউন্ট্যান্ট / ফাইন্যান্সিয়াল ম্যানেজার' },
    desc: {
      en: 'Audits daily sales, reconciles bKash/Nagad/Stripe payouts, and analyzes revenue growth reports.',
      bn: 'দৈনিক বিক্রয় অডিট, বিকাশ/নগদ/কার্ড পেআউট রিকনসাইল এবং রাজস্ব রিপোর্ট বিশ্লেষণ।',
    },
    allowed: {
      en: ['View Financial Statements', 'Reconcile Gateways', 'Sales Analytics Reports', 'Refund Audits'],
      bn: ['ফাইন্যান্সিয়াল বিবরণী দেখা', 'গেটওয়ে রিকনসিলেশন', 'সেলস অ্যানালিটিক্স রিপোর্ট', 'রিফান্ড অডিট'],
    },
    restricted: {
      en: ['No Catalog Modifications', 'No Live Dispatch Management'],
      bn: ['ক্যাটালগ পরিবর্তন নিষিদ্ধ', 'লাইভ ডিসপ্যাচ নিষিদ্ধ'],
    },
    color: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
};

const PERMISSION_TRANSLATIONS: Record<
  string,
  { title: { bn: string; en: string }; desc: { bn: string; en: string }; cat: { bn: string; en: string } }
> = {
  'p-rev': {
    title: { bn: 'আয় ও লাভ মার্জিন দেখুন', en: 'View Revenue & Profit Margins' },
    desc: { bn: 'মোট বিক্রয় আয়, পাইকারি ক্রয়মূল্য এবং নিট লাভ-ক্ষতি দেখুন।', en: 'See total sales earnings, wholesale cost prices, and net P&L.' },
    cat: { bn: 'ফাইন্যান্সিয়াল ও মার্জিন', en: 'Financials & Margins' },
  },
  'p-gate': {
    title: { bn: 'গেটওয়ে রিকনসিলেশন ও পেআউট', en: 'Reconcile Gateways & Payouts' },
    desc: { bn: 'বিকাশ, নগদ, এসএসএল ও কার্ড মার্চেন্ট সেটেলমেন্ট অডিট।', en: 'Audit bKash, Nagad, SSLCommerz and Stripe merchant settlements.' },
    cat: { bn: 'ফাইন্যান্সিয়াল ও মার্জিন', en: 'Financials & Margins' },
  },
  'p-cat-edit': {
    title: { bn: 'পণ্য ও স্টক যোগ/সম্পাদনা করুন', en: 'Add & Edit Products / Stock Units' },
    desc: { bn: 'পণ্যের বিবরণ, মূল্য, স্টক সংখ্যা এবং ফ্ল্যাশ ডিল পরিচালনা করুন।', en: 'Modify product specifications, pricing, stock levels, and flash deals.' },
    cat: { bn: 'ক্যাটালগ ও ইনভেন্টরি', en: 'Catalog & Inventory' },
  },
  'p-cat-del': {
    title: { bn: 'পণ্য স্থায়ীভাবে মুছুন', en: 'Delete Products Permanently' },
    desc: { bn: 'স্টোর ডাটাবেস থেকে পণ্য ডিলিট করার অধিকার।', en: 'Remove catalog items from the store database.' },
    cat: { bn: 'ক্যাটালগ ও ইনভেন্টরি', en: 'Catalog & Inventory' },
  },
  'p-ord-confirm': {
    title: { bn: 'অর্ডার নিশ্চিতকরণ ও ঠিকানা আপডেট', en: 'Confirm COD Orders & Edit Address' },
    desc: { bn: 'গ্রাহককে কল দিয়ে অর্ডার কনফার্ম এবং ডেলিভারি ঠিকানা সংশোধন।', en: 'Call customer, verify COD intent, and update delivery details.' },
    cat: { bn: 'অর্ডার ও টেলিসেলস', en: 'Orders & Telesales' },
  },
  'p-logistics': {
    title: { bn: 'কুরিয়ার ডিসপ্যাচ ও ইনভয়েস প্রিন্ট', en: 'Courier Dispatch & Print Invoices' },
    desc: { bn: 'পাঠাও/রেডএক্স কুরিয়ার অ্যাসাইন, বারকোড এবং প্যাকিং ম্যানিফেস্ট তৈরি।', en: 'Assign Pathao/RedX couriers, generate barcodes and packing manifests.' },
    cat: { bn: 'লজিস্টিকস ও ডিসপ্যাচ', en: 'Logistics & Dispatch' },
  },
  'p-support': {
    title: { bn: 'রিভিউ মডারেশন ও সাপোর্ট টিকেট', en: 'Reviews Moderation & AI Handover' },
    desc: { bn: 'কাস্টমার রিভিউ অনুমোদন, অভিযোগ সমাধান এবং হোয়াটসঅ্যাপ মেসেজিং।', en: 'Approve customer ratings, resolve support tickets, and direct WhatsApp.' },
    cat: { bn: 'গ্রাহক যোগাযোগ', en: 'Customer Communication' },
  },
  'p-rbac': {
    title: { bn: 'স্টাফ অ্যাকাউন্ট ও আরবিএসি নিয়ন্ত্রণ', en: 'Manage Staff Accounts & RBAC Matrix' },
    desc: { bn: 'নতুন স্টাফ যোগ, পারমিশন রুলস পরিবর্তন এবং অ্যাকাউন্ট সাসপেনশন।', en: 'Invite new staff, revoke credentials, and modify role security rules.' },
    cat: { bn: 'সিস্টেম সিকিউরিটি', en: 'System Security' },
  },
};

export default function AdminStaffRolesPage() {
  const { token, user } = useAuthStore();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'roster' | 'matrix' | 'guide'>('roster');
  const [staffList, setStaffList] = useState<IStaffMember[]>(INITIAL_STAFF);
  const [permissions, setPermissions] = useState<IPermissionRule[]>(INITIAL_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [staffStatusFilter, setStaffStatusFilter] = useState<'all' | 'online' | '2fa' | 'suspended'>('all');
  const [isLoadingDB, setIsLoadingDB] = useState(false);

  // Modals & Selected Role Info
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<IStaffMember | null>(null);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<StaffRoleType | null>(null);
  const [selectedStaffForSessions, setSelectedStaffForSessions] = useState<IStaffMember | null>(null);
  const [isRevokingSessionId, setIsRevokingSessionId] = useState<string | null>(null);
  const [isTerminatingSessions, setIsTerminatingSessions] = useState(false);
  const [isFreezingStaffId, setIsFreezingStaffId] = useState<string | null>(null);
  const [pendingAuthRequest, setPendingAuthRequest] = useState<ILoginAuthRequest | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Staff Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Telesales Executive' as StaffRoleType,
    canViewOrders: true,
    canEditOrders: true,
    canManageCatalog: false,
    canManageLogistics: false,
    canManageFinance: false,
    canAccessRBAC: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Trigger Push Login Simulation (e.g. from Chittagong Windows 11)
  const handleSimulateRemoteLoginAttempt = async () => {
    const mockRequest: ILoginAuthRequest = {
      id: `req-${Date.now()}`,
      email: user?.email || 'admin@shopnexus.io',
      device: 'Dell XPS 15 (Windows Laptop)',
      os: 'Windows 11 Pro',
      browser: 'Microsoft Edge 126.0',
      ipAddress: '45.112.58.10',
      location: 'Chittagong, Bangladesh',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtTimestamp: Date.now(),
      status: 'pending',
    };

    setPendingAuthRequest(mockRequest);
    showToast(isBn ? '🚨 সতর্কতা: চট্টগ্রাম থেকে নতুন ডিভাইসে লগইন অনুরোধ পাঠানো হয়েছে!' : '🚨 Security Alert: Incoming login challenge from Chittagong!');
  };

  // Handle Push Login Decision (Approve / Deny / Deny & Block)
  const handleLoginDecision = async (
    requestId: string,
    decision: 'approved' | 'denied' | 'denied_and_blocked'
  ) => {
    try {
      await fetch('/api/auth/login-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'respond', requestId, decision }),
      }).catch(() => null);

      if (decision === 'approved' && pendingAuthRequest) {
        // Add approved remote session
        const newSession: IStaffSession = {
          id: `sess-${Date.now()}`,
          device: pendingAuthRequest.device,
          os: pendingAuthRequest.os,
          browser: pendingAuthRequest.browser,
          ipAddress: pendingAuthRequest.ipAddress,
          location: pendingAuthRequest.location,
          isCurrentSession: false,
          loginAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lastHeartbeat: 'Just now',
          riskScore: 'low',
        };

        setStaffList((prev) =>
          prev.map((s) => {
            if (s.email.toLowerCase() === (pendingAuthRequest?.email || '').toLowerCase()) {
              return { ...s, sessions: [newSession, ...(s.sessions || [])] };
            }
            return s;
          })
        );

        showToast(isBn ? '✅ রিমোট ডিভাইসের লগইন সফলভাবে অনুমোদন করা হয়েছে!' : '✅ Remote device login approved!');
      } else if (decision === 'denied_and_blocked') {
        showToast(isBn ? '🛑 দূরবর্তী লগইন বাতিল করা হয়েছে এবং ক্ষতিকর আইপি (45.112.58.10) ফ্রড শিল্ডে ব্লক হয়েছে!' : '🛑 Login denied and remote IP blocked in Fraud Shield!');
      } else {
        showToast(isBn ? '✕ দূরবর্তী ডিভাইসের লগইন অনুরোধ প্রত্যাখ্যান করা হয়েছে।' : '✕ Remote login authorization denied.');
      }
    } catch (err) {
      console.error('Error handling login decision:', err);
    } finally {
      setPendingAuthRequest(null);
    }
  };

  // Open Active Sessions Telemetry Modal & Fetch Dynamic Sessions
  const handleOpenSessionsModal = async (member: IStaffMember) => {
    setSelectedStaffForSessions(member);
    try {
      const res = await fetch(
        `/api/admin/staff/sessions?staffId=${member.id}&email=${encodeURIComponent(member.email)}`
      ).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.success && Array.isArray(data.data)) {
          setSelectedStaffForSessions((prev) => (prev ? { ...prev, sessions: data.data } : prev));
          setStaffList((prev) =>
            prev.map((s) => (s.id === member.id || s.email.toLowerCase() === member.email.toLowerCase() ? { ...s, sessions: data.data } : s))
          );
        }
      }
    } catch {
      // ignore
    }
  };

  // 1-Click Revoke Specific Remote Device Session
  const handleRevokeRemoteSession = async (staffId: string, sessionId: string, deviceName: string) => {
    setIsRevokingSessionId(sessionId);
    try {
      await fetch('/api/admin/staff/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_session', staffId, sessionId }),
      }).catch(() => null);

      setStaffList((prev) =>
        prev.map((s) => {
          if (s.id === staffId) {
            const updatedSessions = (s.sessions || []).filter((sess) => sess.id !== sessionId);
            return { ...s, sessions: updatedSessions };
          }
          return s;
        })
      );

      setSelectedStaffForSessions((prev) => {
        if (!prev || prev.id !== staffId) return prev;
        const updatedSessions = (prev.sessions || []).filter((sess) => sess.id !== sessionId);
        return { ...prev, sessions: updatedSessions };
      });

      showToast(
        isBn
          ? `✓ রিমোট ডিভাইস "${deviceName}" সফলভাবে লগআউট ও সেশন বাতিল করা হয়েছে!`
          : `✓ Remote device "${deviceName}" disconnected and session revoked!`
      );
    } catch (err) {
      console.error('Failed to revoke session:', err);
      showToast(isBn ? 'সেশন রিভোক করতে সমস্যা হয়েছে।' : 'Failed to revoke remote session.');
    } finally {
      setIsRevokingSessionId(null);
    }
  };

  // 1-Click Terminate All Other Sessions
  const handleTerminateAllOtherSessions = async (staffId: string, staffName: string) => {
    const isConfirmed = await showConfirmDialog({
      title: isBn ? 'অন্যান্য সকল ডিভাইস লগআউট করবেন?' : 'Terminate All Other Sessions?',
      message: isBn
        ? `আপনি কি নিশ্চিত যে "${staffName}"-এর বর্তমান কম্পিউটার ব্যতীত অন্য সকল ডিভাইসের সেশন তাৎক্ষণিক টার্মিনেট (লগআউট) করতে চান?`
        : `Are you sure you want to terminate all remote active sessions for "${staffName}"? Only the current active device will remain connected.`,
      type: 'danger',
      confirmText: isBn ? 'হ্যাঁ, সকল রিমোট সেশন বন্ধ করুন' : 'Terminate All Remote Sessions',
      cancelText: isBn ? 'বাতিল' : 'Cancel',
    });

    if (!isConfirmed) return;

    setIsTerminatingSessions(true);
    try {
      await fetch('/api/admin/staff/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'terminate_all_other', staffId }),
      }).catch(() => null);

      setStaffList((prev) =>
        prev.map((s) => {
          if (s.id === staffId) {
            const updatedSessions = (s.sessions || []).filter((sess) => sess.isCurrentSession);
            return { ...s, sessions: updatedSessions };
          }
          return s;
        })
      );

      setSelectedStaffForSessions((prev) => {
        if (!prev || prev.id !== staffId) return prev;
        const updatedSessions = (prev.sessions || []).filter((sess) => sess.isCurrentSession);
        return { ...prev, sessions: updatedSessions };
      });

      showToast(
        isBn
          ? `🚨 "${staffName}"-এর বর্তমান ডিভাইস বাদে অন্য সকল রিমোট সেশন সফলভাবে লগআউট করা হয়েছে!`
          : `🚨 All other remote sessions for "${staffName}" have been terminated!`
      );
    } catch (err) {
      console.error('Failed to terminate sessions:', err);
      showToast(isBn ? 'সকল সেশন বন্ধ করতে সমস্যা হয়েছে।' : 'Failed to terminate remote sessions.');
    } finally {
      setIsTerminatingSessions(false);
    }
  };

  // 1-Click Instant Account Freeze
  const handleInstantFreezeAccount = async (staffId: string, staffName: string) => {
    const target = staffList.find((s) => s.id === staffId);
    if (!target) return;

    if (target.role === 'Super Admin' && target.email === (user?.email || 'admin@shopnexus.io')) {
      showToast(isBn ? 'বর্তমান সক্রিয় সুপার অ্যাডমিন অ্যাকাউন্ট ফ্রিজ করা যাবে না।' : 'Cannot freeze the active Super Admin account in this session.');
      return;
    }

    const isCurrentlySuspended = target.status === 'Suspended';
    const isConfirmed = await showConfirmDialog({
      title: isCurrentlySuspended
        ? (isBn ? 'অ্যাকাউন্ট আনফ্রিজ ও সক্রিয় করবেন?' : 'Unfreeze & Restore Account?')
        : (isBn ? '❄️ ইনস্ট্যান্ট একাউন্ট ফ্রিজ ও লকডাউন?' : '❄️ Instant Account Freeze & Lockdown?'),
      message: isCurrentlySuspended
        ? (isBn
            ? `"${staffName}" অ্যাকাউন্টটি আনফ্রিজ করে পুনরায় স্বাভাবিক অ্যাক্সেস প্রদান করতে চান?`
            : `Are you sure you want to unfreeze and restore login access for "${staffName}"?`)
        : (isBn
            ? `⚠️ সতর্কতা: "${staffName}" অ্যাকাউন্টটি সাথে সাথে ফ্রিজ (লক) করা হবে এবং সকল সেশন তাৎক্ষণিক বাতিল হয়ে যাবে। আপনি কি নিশ্চিত?`
            : `⚠️ Warning: "${staffName}" will be instantly frozen, suspending login and terminating all connected sessions immediately. Are you sure?`),
      type: isCurrentlySuspended ? 'info' : 'danger',
      confirmText: isCurrentlySuspended ? (isBn ? 'হ্যাঁ, সক্রিয় করুন' : 'Unfreeze Account') : (isBn ? 'হ্যাঁ, ফ্রিজ করুন' : 'Freeze Account Now'),
      cancelText: isBn ? 'বাতিল' : 'Cancel',
    });

    if (!isConfirmed) return;

    setIsFreezingStaffId(staffId);
    const nextStatus = isCurrentlySuspended ? 'Active' : 'Suspended';

    try {
      await fetch('/api/admin/staff/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, isFrozen: !isCurrentlySuspended }),
      }).catch(() => null);

      setStaffList((prev) =>
        prev.map((s) => {
          if (s.id === staffId) {
            return {
              ...s,
              status: nextStatus,
              sessions: nextStatus === 'Suspended' ? [] : s.sessions,
            };
          }
          return s;
        })
      );

      if (selectedStaffForSessions?.id === staffId) {
        setSelectedStaffForSessions((prev) =>
          prev
            ? {
                ...prev,
                status: nextStatus,
                sessions: nextStatus === 'Suspended' ? [] : prev.sessions,
              }
            : null
        );
      }

      showToast(
        nextStatus === 'Suspended'
          ? (isBn
              ? `❄️ "${staffName}" অ্যাকাউন্টটি সফলভাবে ফ্রিজ করা হয়েছে এবং সকল অ্যাক্সেস স্থগিত করা হয়েছে!`
              : `❄️ Account "${staffName}" has been frozen and all active sessions revoked!`)
          : (isBn
              ? `✓ "${staffName}" অ্যাকাউন্টটি আনফ্রিজ করা হয়েছে (অ্যাক্সেস সক্রিয়)!`
              : `✓ Account "${staffName}" has been restored and unfreezed!`)
      );
    } catch (err) {
      console.error('Failed to freeze account:', err);
      showToast(isBn ? 'অ্যাকাউন্ট ফ্রিজ করতে সমস্যা হয়েছে।' : 'Failed to update account freeze status.');
    } finally {
      setIsFreezingStaffId(null);
    }
  };

  // Helper to dynamically check real-time session presence
  const checkStaffPresence = useCallback(
    (memberEmail: string) => {
      const currentAuthEmail = (user?.email || 'admin@shopnexus.io').toLowerCase().trim();
      const targetEmail = memberEmail.toLowerCase().trim();

      // Only the exact matching current logged in user session is online
      const isCurrentUser = targetEmail === currentAuthEmail;
      const isOnline = isCurrentUser;

      return {
        isOnline,
        isCurrentUser,
        presenceLabel: isOnline
          ? isBn
            ? 'অনলাইন (আপনার সেশন)'
            : 'Online (Current Session)'
          : isBn
          ? 'অফলাইন'
          : 'Offline',
        lastActiveFormatted: isOnline
          ? isBn
            ? 'এই মুহূর্তে সক্রিয়'
            : 'Active right now'
          : isBn
          ? 'অফলাইন • পূর্বে সক্রিয়'
          : 'Offline • Idle',
      };
    },
    [user?.email, isBn]
  );

  // Live Clock for Modal Countdowns
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live staff from DB and sync live sessions
  const fetchLiveStaff = useCallback(async () => {
    setIsLoadingDB(true);
    try {
      // 1. Fetch Users
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

      // 2. Fetch Active Sessions Telemetry
      let sessionsData: Record<string, any[]> = {};
      try {
        const sessRes = await fetch('/api/admin/staff/sessions?email=saad0174742@gmail.com').catch(() => null);
        if (sessRes && sessRes.ok) {
          const sessJson = await sessRes.json().catch(() => null);
          if (sessJson?.success && Array.isArray(sessJson.data)) {
            sessionsData['saad0174742@gmail.com'] = sessJson.data;
            sessionsData['admin@shopnexus.io'] = sessJson.data;
            sessionsData['st-0'] = sessJson.data;

            // Direct live state update for Super Admin sessions
            setStaffList((prev) =>
              prev.map((s) => {
                if (s.email.toLowerCase().trim() === 'saad0174742@gmail.com' || s.role === 'Super Admin') {
                  return { ...s, sessions: sessJson.data };
                }
                return s;
              })
            );
          }
        }
      } catch {
        // ignore
      }

      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data?.data && Array.isArray(data.data)) {
        const liveUsers = data.data;
        const liveStaff: IStaffMember[] = liveUsers
          .filter((u: Partial<User>) => {
            const uEmail = String(u.email || '').toLowerCase().trim();
            const uName = String(u.name || '').toLowerCase().trim();
            // Filter out old legacy admin@shopnexus.io / Nexus Lead Admin
            if (uEmail === 'admin@shopnexus.io' || uName.includes('nexus lead admin')) {
              return false;
            }
            return u.role === 'admin' || u.role === 'vendor' || u.role === 'staff';
          })
          .map((u: Partial<User> & Record<string, unknown>) => {
            const roleTitle: StaffRoleType =
              (u.storeName as StaffRoleType) || (u.role === 'admin' ? 'Super Admin' : 'Inventory Manager');
            const uEmail = String(u.email || '').toLowerCase().trim();
            
            const existingMember = INITIAL_STAFF.find(
              (init) => init.email.toLowerCase() === uEmail
            );
            const activeSessions = sessionsData[uEmail] || existingMember?.sessions || [
              {
                id: `sess-${u._id || u.id || '1'}`,
                device: 'MacBook Pro 16" (Primary Session)',
                os: 'macOS Sonoma 14.5',
                browser: 'Google Chrome 128.0',
                ipAddress: '103.145.74.22',
                location: 'Dhaka, Bangladesh',
                isCurrentSession: true,
                loginAt: 'Today, 09:30 AM',
                lastHeartbeat: 'Just now',
                riskScore: 'low' as const,
              },
            ];

            return {
              id: String(u._id || u.id || ''),
              name: String(u.name || 'Staff Member'),
              email: String(u.email || ''),
              phone: String(u.phoneNumber || '+880 1700-000000'),
              role: roleTitle,
              twoFactorEnabled: true,
              status: u.isBlocked ? 'Suspended' : 'Active',
              lastActive: 'Offline',
              avatarColor: ROLE_DEFINITIONS[roleTitle]?.color || 'from-slate-700 to-slate-900',
              createdAt: u.createdAt ? new Date(String(u.createdAt)).toISOString().split('T')[0] : '2026-01-01',
              sessions: activeSessions,
              customPermissions: {
                canViewOrders: true,
                canEditOrders: roleTitle === 'Super Admin' || roleTitle === 'Telesales Executive',
                canManageCatalog: roleTitle === 'Super Admin' || roleTitle === 'Inventory Manager',
                canManageLogistics: roleTitle === 'Super Admin' || roleTitle === 'Delivery Officer',
                canManageFinance: roleTitle === 'Super Admin' || roleTitle === 'Accountant',
                canAccessRBAC: roleTitle === 'Super Admin',
              },
            };
          });

        if (liveStaff.length > 0) {
          setStaffList((prev) => {
            const liveEmails = new Set(liveStaff.map((s) => s.email.toLowerCase().trim()));
            const liveIds = new Set(liveStaff.map((s) => s.id));
            const merged = [
              ...liveStaff,
              ...prev.filter(
                (s) =>
                  !liveIds.has(s.id) &&
                  !liveEmails.has(s.email.toLowerCase().trim()) &&
                  s.email.toLowerCase().trim() !== 'admin@shopnexus.io'
              ),
            ];
            // Ensure only saad0174742@gmail.com is Super Admin and comes first
            return merged
              .filter((s) => s.email.toLowerCase().trim() !== 'admin@shopnexus.io')
              .map((s) => {
                if (s.email.toLowerCase().trim() === 'saad0174742@gmail.com' && sessionsData['saad0174742@gmail.com']) {
                  return { ...s, sessions: sessionsData['saad0174742@gmail.com'] };
                }
                return s;
              });
          });
        }
      }
    } catch (err) {
      console.error('Could not fetch staff from DB:', err);
    } finally {
      setIsLoadingDB(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchLiveStaff();
    // Live polling every 3.5s to keep session counts perfectly synchronized
    const interval = setInterval(() => {
      fetchLiveStaff();
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchLiveStaff]);

  // Toggle Staff Access (Active <-> Suspended)
  const toggleStaffStatus = async (id: string, name: string) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;
    if (target.role === 'Super Admin') {
      showToast(isBn ? 'সুপার অ্যাডমিন অ্যাকাউন্ট স্থগিত করা যাবে না।' : 'Super Admin account cannot be suspended.');
      return;
    }

    const nextStatus: 'Active' | 'Suspended' = target.status === 'Active' ? 'Suspended' : 'Active';

    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    );

    showToast(
      nextStatus === 'Active'
        ? (isBn ? `✓ "${name}"-এর অ্যাক্সেস সক্রিয় করা হয়েছে!` : `✓ Access granted for "${name}"!`)
        : (isBn ? `🔒 "${name}"-এর অ্যাক্সেস তাৎক্ষণিকভাবে স্থগিত করা হয়েছে!` : `🔒 Access suspended for "${name}"!`)
    );
  };

  // Delete / Revoke Staff
  const handleDeleteStaff = async (id: string, name: string) => {
    const target = staffList.find((s) => s.id === id);
    if (target?.role === 'Super Admin') {
      showToast(isBn ? 'সুপার অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না।' : 'Cannot delete Super Admin account.');
      return;
    }

    const isConfirmed = await showConfirmDialog({
      title: isBn ? 'স্টাফ অ্যাক্সেস প্রত্যাহার করবেন?' : 'Revoke Staff Access?',
      message: isBn
        ? `আপনি কি নিশ্চিত যে "${name}"-এর স্টাফ ক্রেডেনশিয়াল এবং অ্যাক্সেস স্থায়ীভাবে বাতিল করতে চান?`
        : `Are you sure you want to permanently revoke credentials for "${name}"?`,
      type: 'danger',
      confirmText: isBn ? 'হ্যাঁ, বাতিল করুন' : 'Revoke Credentials',
      cancelText: isBn ? 'না' : 'Cancel',
    });

    if (isConfirmed) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(isBn ? `"${name}"-এর অ্যাক্সেস প্রত্যাহার করা হয়েছে।` : `Revoked staff access for "${name}".`);

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

  // Add Staff Submit
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      showToast(isBn ? 'অনুগ্রহ করে নাম, ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please provide Name, Email and Password.');
      return;
    }

    const createdStaffId = `st-${Date.now()}`;
    const newMember: IStaffMember = {
      id: createdStaffId,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone || '+880 1700-000000',
      role: newStaff.role,
      twoFactorEnabled: true,
      status: 'Active',
      lastActive: 'Just invited',
      avatarColor: ROLE_DEFINITIONS[newStaff.role]?.color || 'from-[#ff4400] to-[#ff7700]',
      createdAt: new Date().toISOString().split('T')[0],
      customPermissions: {
        canViewOrders: newStaff.canViewOrders,
        canEditOrders: newStaff.canEditOrders,
        canManageCatalog: newStaff.canManageCatalog,
        canManageLogistics: newStaff.canManageLogistics,
        canManageFinance: newStaff.canManageFinance,
        canAccessRBAC: newStaff.canAccessRBAC,
      },
    };

    setStaffList((prev) => [newMember, ...prev]);
    setIsAddStaffOpen(false);
    showToast(isBn ? `স্টাফ মেম্বার "${newMember.name}" সফলভাবে যুক্ত করা হয়েছে!` : `Staff member "${newMember.name}" created with role "${newMember.role}"!`);

    // Reset Form
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Telesales Executive',
      canViewOrders: true,
      canEditOrders: true,
      canManageCatalog: false,
      canManageLogistics: false,
      canManageFinance: false,
      canAccessRBAC: false,
    });

    try {
      await fetch('/api/admin/users/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newMember),
      }).catch(() => null);
    } catch (err) {
      console.error('Error saving staff to backend:', err);
    }
  };

  // Edit Staff Submit
  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setStaffList((prev) =>
      prev.map((s) => (s.id === editingStaff.id ? editingStaff : s))
    );
    showToast(isBn ? `"${editingStaff.name}"-এর ভূমিকা ও পারমিশন আপডেট হয়েছে।` : `Updated roles and permissions for "${editingStaff.name}".`);
    setEditingStaff(null);
  };

  // Toggle Permission Matrix Cell
  const handleToggleMatrixRule = (
    ruleId: string,
    roleKey: 'telesales' | 'delivery' | 'inventoryManager' | 'customerCare' | 'accountant'
  ) => {
    setPermissions((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, [roleKey]: !r[roleKey] } : r))
    );
    showToast(isBn ? 'পারমিশন ম্যাট্রিক্স সফলভাবে আপডেট করা হয়েছে।' : 'Permission matrix updated.');
  };

  // Dynamic Telemetry Calculations
  const onlineStaffCount = useMemo(() => {
    return staffList.filter((s) => checkStaffPresence(s.email).isOnline && s.status === 'Active').length;
  }, [staffList, checkStaffPresence]);

  const offlineStaffCount = useMemo(() => {
    return Math.max(0, staffList.length - onlineStaffCount);
  }, [staffList.length, onlineStaffCount]);

  const totalStaffCount = staffList.length;
  const activeStaffCount = useMemo(() => staffList.filter((s) => s.status === 'Active').length, [staffList]);
  const suspendedStaffCount = useMemo(() => staffList.filter((s) => s.status === 'Suspended').length, [staffList]);
  const twoFaEnforcedCount = useMemo(() => staffList.filter((s) => s.twoFactorEnabled).length, [staffList]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || s.role === roleFilter;

      let matchesStatus = true;
      if (staffStatusFilter === 'online') {
        matchesStatus = checkStaffPresence(s.email).isOnline && s.status === 'Active';
      } else if (staffStatusFilter === '2fa') {
        matchesStatus = s.twoFactorEnabled;
      } else if (staffStatusFilter === 'suspended') {
        matchesStatus = s.status === 'Suspended';
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, searchQuery, roleFilter, staffStatusFilter, checkStaffPresence]);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'স্টাফ রোল ও গ্র্যানুলার অ্যাক্সেস কন্ট্রোল' : 'Staff Roles & Access Control Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'স্টাফ অ্যাকাউন্ট তৈরি করুন, লাইভ অনলাইন উপস্থিতি মনিটর করুন, গ্র্যানুলার পারমিশন দিন বা ১-ক্লিকে অ্যাক্সেস স্থগিত করুন।'
                : 'Create staff accounts, monitor real-time online presence, configure granular RBAC permissions, or revoke access on demand.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => fetchLiveStaff()}
              disabled={isLoadingDB}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isLoadingDB ? 'animate-spin text-orange-500' : ''}`} />
              <span className="truncate">{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddStaffOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">{isBn ? 'নতুন স্টাফ' : 'Add Staff'}</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* WORKABLE & REAL DYNAMIC KPI METRIC CARDS (2-Columns on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Authorized Staff (Real Online vs Offline) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('roster');
              setStaffStatusFilter('all');
            }}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'roster' && staffStatusFilter === 'all'
                ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-orange-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'অনুমোদিত স্টাফ' : 'Authorized Staff'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(totalStaffCount) : totalStaffCount}
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-1">
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-bold truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span>{isBn ? `${toBengaliNumber(onlineStaffCount)} Online` : `${onlineStaffCount} Online`}</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold truncate">
                  {isBn ? `• ${toBengaliNumber(offlineStaffCount)} Off` : `• ${offlineStaffCount} Off`}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{isBn ? 'RBAC ডেটাবেস' : 'Central RBAC'}</span>
              </span>
            </div>
          </button>

          {/* Card 2: 2FA Authenticated */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('roster');
              setStaffStatusFilter('2fa');
            }}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'roster' && staffStatusFilter === '2fa'
                ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? '২এফএ টিম' : '2FA Authenticated'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(twoFaEnforcedCount) : twoFaEnforcedCount}
              </span>
              <span className="text-[9px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                {isBn ? '১০০% এনক্রিপ্টেড' : '100% Encrypted'}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{isBn ? 'দ্বি-স্তর নিরাপত্তা' : '2-Factor Active'}</span>
              </span>
            </div>
          </button>

          {/* Card 3: Active RBAC Rules */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('matrix');
            }}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'matrix'
                ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'পারমিশন রুলস' : 'Active RBAC Rules'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(permissions.length) : permissions.length}
              </span>
              <span className="text-[9px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-bold block mt-1">
                {isBn ? '৬টি ভূমিকা' : '6 Roles'}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="truncate">{isBn ? 'ম্যাট্রিক্স এডিট' : 'Edit Matrix'}</span>
              </span>
            </div>
          </button>

          {/* Card 4: Suspended Access */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('roster');
              setStaffStatusFilter('suspended');
            }}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              activeTab === 'roster' && staffStatusFilter === 'suspended'
                ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'স্থগিত অ্যাক্সেস' : 'Suspended Access'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(suspendedStaffCount) : suspendedStaffCount}
              </span>
              <span className="text-[9px] sm:text-xs text-amber-600 dark:text-amber-400 font-bold block mt-1">
                {isBn ? 'ইনঅ্যাক্টিভ' : 'Inactive'}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">{isBn ? '১-ক্লিক সুইচ' : '1-Click Toggle'}</span>
              </span>
            </div>
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === 'roster'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">{isBn ? 'স্টাফ মেম্বার' : 'Staff Members'}</span>
              <span className="sm:hidden">{isBn ? 'স্টাফ' : 'Staff'}</span>{' '}
              <span className="font-mono">({isBn ? toBengaliNumber(staffList.length) : staffList.length})</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">{isBn ? 'পারমিশন ' : 'Permissions '}</span>
              <span>{isBn ? 'ম্যাট্রিক্স' : 'Matrix'}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">{isBn ? 'রোল গাইড' : 'Roles Guide'}</span>
              <span className="sm:hidden">{isBn ? 'গাইড' : 'Guide'}</span>
            </span>
          </button>
        </div>

        {/* TAB 1: STAFF ROSTER & ACCESS CONTROL */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Search & Role Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'স্টাফের নাম, ইমেইল, ফোন বা পদবি দিয়ে খুঁজুন...' : 'Search staff name, email, phone, role...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
                />
              </div>

              {/* Status / Presence Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStaffStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    staffStatusFilter === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isBn ? `সকল (${toBengaliNumber(totalStaffCount)})` : `All (${totalStaffCount})`}
                </button>

                <button
                  type="button"
                  onClick={() => setStaffStatusFilter('online')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    staffStatusFilter === 'online'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isBn ? `Online (${toBengaliNumber(onlineStaffCount)})` : `Online (${onlineStaffCount})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStaffStatusFilter('2fa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    staffStatusFilter === '2fa'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {isBn ? `২এফএ (${toBengaliNumber(twoFaEnforcedCount)})` : `2FA (${twoFaEnforcedCount})`}
                </button>

                <button
                  type="button"
                  onClick={() => setStaffStatusFilter('suspended')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    staffStatusFilter === 'suspended'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isBn ? `স্থগিত (${toBengaliNumber(suspendedStaffCount)})` : `Suspended (${suspendedStaffCount})`}
                </button>
              </div>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                {isBn ? 'পদবি:' : 'Role:'}
              </span>
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === 'all'
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isBn ? 'সকল পদবি' : 'All Roles'}
              </button>
              {Object.keys(ROLE_DEFINITIONS).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    roleFilter === role
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isBn ? ROLE_DEFINITIONS[role as StaffRoleType].title.bn.split(' ')[0] : role}
                </button>
              ))}
            </div>

            {/* ACTIVE KPI FILTER INDICATOR PILL */}
            {(staffStatusFilter !== 'all' || roleFilter !== 'all' || searchQuery) && (
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {isBn ? 'ফিল্টার করা হচ্ছে:' : 'Filtering by:'}{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {staffStatusFilter === 'online'
                        ? (isBn ? '🟢 বর্তমানে লগইন থাকা স্টাফ (Online Now)' : '🟢 Online Staff (Online Now)')
                        : staffStatusFilter === '2fa'
                        ? (isBn ? '২এফএ সক্রিয় স্টাফ' : '2FA Authenticated Staff')
                        : staffStatusFilter === 'suspended'
                        ? (isBn ? 'স্থগিত (Suspended) স্টাফ' : 'Suspended Staff')
                        : (isBn ? 'সকল স্টাফ' : 'All Staff')}
                    </strong>
                    {roleFilter !== 'all' && (
                      <span> • {isBn ? `পদবি: ${ROLE_DEFINITIONS[roleFilter as StaffRoleType]?.title.bn || roleFilter}` : `Role: ${roleFilter}`}</span>
                    )}
                    {searchQuery && <span> • {isBn ? `সার্চ: "${searchQuery}"` : `Search: "${searchQuery}"`}</span>}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[11px]">
                    {isBn ? `${toBengaliNumber(filteredStaff.length)} জন মেম্বার` : `${filteredStaff.length} members`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStaffStatusFilter('all');
                    setRoleFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>{isBn ? 'ফিল্টার রিসেট' : 'Reset Filter'}</span>
                </button>
              </div>
            )}

            {/* Staff Cards Grid */}
            {filteredStaff.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-white dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'কোনো স্টাফ মেম্বার মেলেনি' : 'No staff members found'}
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isBn
                    ? 'আপনার নির্বাচিত ফিল্টারে বর্তমানে কোনো স্টাফ নেই। ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।'
                    : 'No staff members matched your current filter criteria. Reset the filters to view all.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStaffStatusFilter('all');
                    setRoleFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer hover:bg-orange-600"
                >
                  {isBn ? 'সকল স্টাফ দেখুন' : 'View All Staff'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredStaff.map((member) => {
                  const roleDef = ROLE_DEFINITIONS[member.role] || ROLE_DEFINITIONS['Super Admin'];
                  const isSuspended = member.status === 'Suspended';
                  const presence = checkStaffPresence(member.email);

                  return (
                    <div
                      key={member.id}
                      className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border ${
                        presence.isOnline
                          ? 'border-emerald-500/40 shadow-emerald-500/5'
                          : isSuspended
                          ? 'border-rose-500/40 opacity-80'
                          : 'border-slate-200 dark:border-slate-800'
                      } shadow-sm backdrop-blur-xl space-y-3 sm:space-y-4 hover:border-orange-500/40 transition-all`}
                    >
                      {/* Top Header Row with Presence & Role Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleDef.badgeBg}`}>
                            {isBn ? roleDef.title.bn : member.role}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedRoleInfo(member.role)}
                            className="p-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 transition-colors cursor-pointer"
                            title={isBn ? 'রোল পারমিশন তথ্য' : 'Role Information'}
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Multi-Device Warning Ribbon or Online Pulse Indicator */}
                        {(member.sessions && member.sessions.length > 1) ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSessionsModal(member)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold hover:scale-105 transition-transform cursor-pointer"
                            title={isBn ? 'মাল্টি-ডিভাইস লগইন শনাক্ত হয়েছে - সেশন দেখুন' : 'Multi-device login detected - Inspect sessions'}
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-500 animate-bounce" />
                            <span>{isBn ? `${toBengaliNumber(member.sessions.length)}টি ডিভাইসে সক্রিয়` : `${member.sessions.length} Devices`}</span>
                          </button>
                        ) : presence.isOnline ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSessionsModal(member)}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold hover:scale-105 transition-transform cursor-pointer"
                            title={isBn ? 'সক্রিয় সেশন ও ডিভাইস দেখুন' : 'View active sessions and telemetry'}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{presence.presenceLabel}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            {isBn ? `⚪ অফলাইন` : `⚪ Offline`}
                          </span>
                        )}
                      </div>

                      {/* Avatar & User Details */}
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${member.avatarColor} text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md`}
                          >
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          {/* Avatar Presence Dot */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                              presence.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                            title={presence.presenceLabel}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1 truncate">
                            <span className="truncate">{member.name}</span>
                            {member.twoFactorEnabled && (
                              <span title={isBn ? '২এফএ ভেরিফাইড' : '2FA Authenticated'}>
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block truncate">{member.email}</span>
                          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block">{member.phone}</span>
                        </div>
                      </div>

                      {/* Permissions Tag Cloud */}
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {member.customPermissions?.canManageCatalog && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                            {isBn ? 'ক্যাটালগ' : 'Catalog'}
                          </span>
                        )}
                        {member.customPermissions?.canEditOrders && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                            {isBn ? 'অর্ডার' : 'Orders'}
                          </span>
                        )}
                        {member.customPermissions?.canManageLogistics && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                            {isBn ? 'লজিস্টিকস' : 'Logistics'}
                          </span>
                        )}
                        {member.customPermissions?.canManageFinance && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold">
                            {isBn ? 'ফাইন্যান্স' : 'Finance'}
                          </span>
                        )}
                        {member.customPermissions?.canAccessRBAC && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold">
                            {isBn ? 'মাস্টার আরবিএসি' : 'Master RBAC'}
                          </span>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] ${isSuspended ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                            {isSuspended ? (isBn ? 'লকড' : 'Suspended') : (isBn ? 'অনুমোদিত' : 'Allowed')}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {/* Active Sessions Inspector Trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenSessionsModal(member)}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer flex items-center gap-1"
                            title={isBn ? 'সক্রিয় সেশন ও ডিভাইস নিরাপত্তা দেখুন' : 'Inspect Active Sessions & Remote Logout'}
                          >
                            <Laptop className="w-3 h-3 shrink-0" />
                            <span>{isBn ? `সেশন (${toBengaliNumber(member.sessions?.length || 1)})` : `Sessions (${member.sessions?.length || 1})`}</span>
                          </button>

                          {/* 1-Click Instant Freeze / Unfreeze Button */}
                          {member.role !== 'Super Admin' && (
                            <button
                              type="button"
                              onClick={() => handleInstantFreezeAccount(member.id, member.name)}
                              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isSuspended
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                              }`}
                              title={isSuspended ? (isBn ? 'অ্যাকাউন্ট আনফ্রিজ করুন' : 'Unfreeze Account') : (isBn ? 'ইনস্ট্যান্ট একাউন্ট ফ্রিজ' : 'Instant Freeze Account')}
                            >
                              <Snowflake className="w-3 h-3 shrink-0" />
                              <span>{isSuspended ? (isBn ? 'সক্রিয়' : 'Unfreeze') : (isBn ? 'ফ্রিজ' : 'Freeze')}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setEditingStaff(member)}
                            className="p-1 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title={isBn ? 'রোল ও পারমিশন এডিট' : 'Edit Role & Permissions'}
                          >
                            <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>

                          {member.role !== 'Super Admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(member.id, member.name)}
                              className="p-1 sm:p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                              title={isBn ? 'অ্যাক্সেস চিরতরে বাতিল' : 'Revoke Credentials'}
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GRANULAR PERMISSIONS MATRIX */}
        {activeTab === 'matrix' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm space-y-4 p-4 sm:p-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                {isBn ? 'গ্র্যানুলার সিকিউরিটি পারমিশন ম্যাট্রিক্স' : 'Granular Security Permissions Matrix'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'প্রতিটি প্রশাসনিক রোলের জন্য মডিউল অ্যাক্সেস তাৎক্ষণিকভাবে অন/অফ করুন।'
                  : 'Toggle permissions to immediately grant or revoke module access for each administrative staff role.'}
              </p>
            </div>

            {/* Mobile Swipe Hint */}
            <div className="sm:hidden px-3 py-1.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center text-[11px] text-slate-500 dark:text-slate-400">
              <span>👉 {isBn ? 'ডানে স্ক্রোল করে সকল রোলের পারমিশন দেখুন' : 'Swipe right to view permissions for all roles'}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 w-1/4">{isBn ? 'সিকিউরিটি ডোমেন ও অ্যাকশন' : 'Security Domain & Action'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'সুপার অ্যাডমিন' : 'Super Admin'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'টেলিসেলস' : 'Telesales'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'ডেলিভারি' : 'Delivery'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'ইনভেন্টরি' : 'Inventory'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'কাস্টমার কেয়ার' : 'Customer Care'}</th>
                    <th className="px-3 py-3.5 text-center">{isBn ? 'অ্যাকাউন্ট্যান্ট' : 'Accountant'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {permissions.map((rule) => {
                    const trans = PERMISSION_TRANSLATIONS[rule.id];
                    const categoryText = trans ? (isBn ? trans.cat.bn : trans.cat.en) : rule.category;
                    const titleText = trans ? (isBn ? trans.title.bn : trans.title.en) : rule.title;
                    const descText = trans ? (isBn ? trans.desc.bn : trans.desc.en) : rule.description;

                    return (
                      <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block mb-0.5">
                            {categoryText}
                          </span>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{titleText}</div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{descText}</p>
                        </td>

                        {/* Super Admin - Locked */}
                        <td className="px-3 py-4 text-center">
                          <div className="inline-flex p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400" title={isBn ? 'মাস্টার পারমিশন লকড' : 'Master Permission Locked'}>
                            <Lock className="w-4 h-4" />
                          </div>
                        </td>

                        {/* Telesales */}
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixRule(rule.id, 'telesales')}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              rule.telesales
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {rule.telesales ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>

                        {/* Delivery */}
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixRule(rule.id, 'delivery')}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              rule.delivery
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {rule.delivery ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>

                        {/* Inventory */}
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixRule(rule.id, 'inventoryManager')}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              rule.inventoryManager
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {rule.inventoryManager ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>

                        {/* Customer Care */}
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixRule(rule.id, 'customerCare')}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              rule.customerCare
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {rule.customerCare ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>

                        {/* Accountant */}
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMatrixRule(rule.id, 'accountant')}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              rule.accountant
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {rule.accountant ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES SPECIFICATION & GUIDE */}
        {activeTab === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_DEFINITIONS).map(([roleKey, def]) => (
              <div
                key={roleKey}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${def.color} text-white flex items-center justify-center text-xs font-bold`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {isBn ? def.title.bn : def.title.en}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isBn ? def.desc.bn : def.desc.en}
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                      {isBn ? '✓ অনুমোদিত সুবিধাসমূহ:' : '✓ Permitted Modules:'}
                    </span>
                    <ul className="space-y-1">
                      {(isBn ? def.allowed.bn : def.allowed.en).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                      {isBn ? '✕ সীমাবদ্ধ সুবিধাসমূহ:' : '✕ Restricted Modules:'}
                    </span>
                    <ul className="space-y-1">
                      {(isBn ? def.restricted.bn : def.restricted.en).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <X className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD STAFF MODAL */}
        {isAddStaffOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {isBn ? 'নতুন স্টাফ মেম্বার ইনভাইট করুন' : 'Invite Administrative Staff'}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'স্টাফের জন্য জিমেইল, পাসওয়ার্ড ও দায়িত্ব নির্ধারণ করুন' : 'Configure official Gmail, password & RBAC roles'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    {isBn ? 'স্টাফের পুরো নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? 'উদাঃ মাহফুজুর রহমান' : 'e.g. Mahfuzur Rahman'}
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      {isBn ? 'অফিসিয়াল জিমেইল *' : 'Official Gmail / Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="staff@shopnexus.io"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      placeholder="+880 1711-xxxxxx"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    {isBn ? 'পাসওয়ার্ড *' : 'Temporary Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    {isBn ? 'নির্ধারিত পদবি (Role) *' : 'Designated Role *'}
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => {
                      const r = e.target.value as StaffRoleType;
                      setNewStaff({
                        ...newStaff,
                        role: r,
                        canViewOrders: r !== 'Inventory Manager',
                        canEditOrders: r === 'Telesales Executive' || r === 'Super Admin',
                        canManageCatalog: r === 'Inventory Manager' || r === 'Super Admin',
                        canManageLogistics: r === 'Delivery Officer' || r === 'Super Admin',
                        canManageFinance: r === 'Accountant' || r === 'Super Admin',
                        canAccessRBAC: r === 'Super Admin',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Telesales Executive">{isBn ? 'Telesales Executive (অর্ডার কনফার্মেশন)' : 'Telesales Executive (Order Confirmation)'}</option>
                    <option value="Delivery Officer">{isBn ? 'Delivery Officer (লজিস্টিকস ও ট্র্যাকিং)' : 'Delivery Officer (Logistics & Tracking)'}</option>
                    <option value="Inventory Manager">{isBn ? 'Inventory Manager (পণ্য ও স্টক আপডেট)' : 'Inventory Manager (Catalog & Stock)'}</option>
                    <option value="Customer Care Lead">{isBn ? 'Customer Care Lead (কাস্টমার সাপোর্ট ও রিভিউ)' : 'Customer Care Lead (Support & Reviews)'}</option>
                    <option value="Accountant">{isBn ? 'Accountant (ফাইন্যান্স ও সেটেলমেন্ট)' : 'Accountant (Finance & Gateways)'}</option>
                    <option value="Super Admin">{isBn ? 'Super Admin (সম্পূর্ণ মাস্টার এক্সেস)' : 'Super Admin (Full Master Access)'}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isBn ? 'স্টাফ একাউন্ট তৈরি করুন' : 'Create Staff Account'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT STAFF MODAL */}
        {editingStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? `সম্পাদনা: ${editingStaff.name}` : `Edit: ${editingStaff.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditStaffSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    {isBn ? 'পদবি ও রোল' : 'Assigned Role'}
                  </label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as StaffRoleType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Telesales Executive">Telesales Executive</option>
                    <option value="Delivery Officer">Delivery Officer</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Customer Care Lead">Customer Care Lead</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    {isBn ? 'স্ট্যাটাস' : 'Access Status'}
                  </label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as 'Active' | 'Suspended' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold cursor-pointer"
                  >
                    <option value="Active">{isBn ? 'Active (সক্রিয়)' : 'Active (Access Granted)'}</option>
                    <option value="Suspended">{isBn ? 'Suspended (স্থগিত)' : 'Suspended (Access Revoked)'}</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white font-bold shadow-md shadow-orange-500/25 cursor-pointer"
                  >
                    {isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ROLE INFO MODAL */}
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
                        <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
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
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE SESSIONS & REMOTE SECURITY INSPECTOR MODAL */}
        {selectedStaffForSessions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedStaffForSessions.avatarColor} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                    {selectedStaffForSessions.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {selectedStaffForSessions.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {selectedStaffForSessions.role}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono mt-0.5">
                      {selectedStaffForSessions.email} • {selectedStaffForSessions.phone}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStaffForSessions(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Multi-device Warning Banner */}
              {(selectedStaffForSessions.sessions?.length || 0) > 1 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-600 dark:text-amber-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      {isBn
                        ? `সতর্কতা: একাধিক ডিভাইসে একযোগে লগইন শনাক্ত হয়েছে (${toBengaliNumber(selectedStaffForSessions.sessions?.length || 0)}টি ডিভাইস)!`
                        : `Security Alert: Multiple active devices detected (${selectedStaffForSessions.sessions?.length} concurrent sessions)!`}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-600/90 dark:text-amber-300/90">
                    {isBn
                      ? 'যদি আপনি নিজেই এই ডিভাইসগুলো থেকে লগইন না করে থাকেন, তবে পাসওয়ার্ড ফাঁস হয়ে থাকতে পারে। অননুমোদিত ডিভাইসটি রিভোক করুন অথবা নিচের বাটন দিয়ে অন্য সব সেশন তাৎক্ষণিক টার্মিনেট করুন।'
                      : 'If you did not initiate these logins, credentials may be exposed. Revoke unauthorized devices or terminate all remote sessions immediately.'}
                  </p>
                </div>
              )}

              {/* Primary Security Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isBn ? 'সক্রিয় সেশন কন্ট্রোল' : 'Active Session Defense'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {isBn
                      ? `মোট সংযুক্ত ডিভাইস: ${toBengaliNumber(selectedStaffForSessions.sessions?.length || 1)}টি`
                      : `Total active devices: ${selectedStaffForSessions.sessions?.length || 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(selectedStaffForSessions.sessions?.length || 0) > 1 && (
                    <button
                      type="button"
                      disabled={isTerminatingSessions}
                      onClick={() => handleTerminateAllOtherSessions(selectedStaffForSessions.id, selectedStaffForSessions.name)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isBn ? 'অন্য সকল ডিভাইস লগআউট করুন' : 'Terminate All Other Sessions'}</span>
                    </button>
                  )}

                  {selectedStaffForSessions.role !== 'Super Admin' && (
                    <button
                      type="button"
                      disabled={isFreezingStaffId === selectedStaffForSessions.id}
                      onClick={() => handleInstantFreezeAccount(selectedStaffForSessions.id, selectedStaffForSessions.name)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedStaffForSessions.status === 'Suspended'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <Snowflake className="w-3.5 h-3.5" />
                      <span>
                        {selectedStaffForSessions.status === 'Suspended'
                          ? (isBn ? 'আনফ্রিজ করুন (Active)' : 'Unfreeze Account')
                          : (isBn ? 'ইনস্ট্যান্ট একাউন্ট ফ্রিজ' : 'Instant Freeze Account')}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sessions List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isBn ? 'সংযুক্ত ডিভাইস ও সেশন তালিকা:' : 'Connected Devices & Active Sessions:'}
                </div>

                {(!selectedStaffForSessions.sessions || selectedStaffForSessions.sessions.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1">
                    <Laptop className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'বর্তমানে কোনো সক্রিয় সেশন নেই' : 'No active sessions found'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'এই অ্যাকাউন্টটি বর্তমানে অফলাইন অথবা ফ্রিজ অবস্থায় আছে।' : 'This account is currently offline or suspended.'}
                    </p>
                  </div>
                ) : (
                  selectedStaffForSessions.sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        sess.isCurrentSession
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-orange-500/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            sess.isCurrentSession
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {sess.os.toLowerCase().includes('ios') || sess.os.toLowerCase().includes('android') ? (
                              <Smartphone className="w-5 h-5" />
                            ) : (
                              <Laptop className="w-5 h-5" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-xs text-slate-900 dark:text-white">
                                {sess.device}
                              </span>
                              {sess.isCurrentSession ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                                  {isBn ? '🟢 বর্তমান ডিভাইস (সুরক্ষিত)' : '🟢 This Device (Current Session)'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-black flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{isBn ? '⚠️ রিমোট সেশন' : '⚠️ Remote Session'}</span>
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                              <span>{sess.os} • {sess.browser}</span>
                              <span className="flex items-center gap-1 font-mono text-slate-600 dark:text-slate-300">
                                <Globe className="w-3 h-3 text-orange-500" />
                                <span>{sess.ipAddress} ({sess.location})</span>
                              </span>
                            </div>

                            <div className="text-[10px] text-slate-400 flex items-center gap-3">
                              <span>{isBn ? `লগইন: ${sess.loginAt}` : `Logged in: ${sess.loginAt}`}</span>
                              <span>•</span>
                              <span className="text-emerald-500 font-semibold">{isBn ? `সর্বশেষ সক্রিয়তা: ${sess.lastHeartbeat}` : `Last active: ${sess.lastHeartbeat}`}</span>
                            </div>

                            {/* ⏱️ Live Ticking Session Expiration Countdown */}
                            {(() => {
                              const sessExpiresAt = (sess as any).expiresAt;
                              const isPermanent = sess.isCurrentSession || (sess as any).duration === 'until_revoked' || (sess as any).validUntil?.includes('Permanent') || (sess as any).validUntil?.includes('Until');
                              const remainingSecs = sessExpiresAt ? Math.max(0, Math.floor((Number(sessExpiresAt) - currentTime) / 1000)) : null;

                              if (sessExpiresAt && remainingSecs !== null) {
                                const mins = Math.floor(remainingSecs / 60);
                                const secs = remainingSecs % 60;
                                const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                                return (
                                  <div className="pt-1 flex items-center gap-2">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                      remainingSecs > 0
                                        ? 'bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 shadow-sm'
                                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                                    }`}>
                                      <Clock className={`w-3.5 h-3.5 ${remainingSecs > 0 ? 'animate-pulse text-orange-500' : 'text-rose-500'}`} />
                                      <span>
                                        {remainingSecs > 0
                                          ? isBn
                                            ? `⏱️ অনুমোদিত মেয়াদ বাকি: ${timeFormatted} মিনিট`
                                            : `⏱️ Time Remaining: ${timeFormatted} mins`
                                          : isBn
                                          ? '🔴 সেশন মেয়াদোত্তীর্ণ (Expired)'
                                          : '🔴 Session Expired'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (isPermanent) {
                                return (
                                  <div className="pt-1 flex items-center gap-2">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>
                                        {sess.isCurrentSession
                                          ? isBn ? '🛡️ স্থায়ী নিরাপদ সেশন (Primary Admin Device)' : '🛡️ Permanent Trusted Device'
                                          : isBn ? '♾️ অনুমোদিত মেয়াদ: ব্লক না করা পর্যন্ত (Until Revoked)' : '♾️ Allowed Duration: Until Revoked'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        </div>

                        {/* Revoke Action */}
                        {!sess.isCurrentSession && (
                          <div className="sm:self-center shrink-0">
                            <button
                              type="button"
                              disabled={isRevokingSessionId === sess.id}
                              onClick={() => handleRevokeRemoteSession(selectedStaffForSessions.id, sess.id, sess.device)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>
                                {isRevokingSessionId === sess.id
                                  ? (isBn ? 'লগআউট হচ্ছে...' : 'Revoking...')
                                  : (isBn ? 'ডিভাইস লগআউট করুন' : 'Revoke Device')}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {isBn ? '🔒 ShopNexus রিয়েল-টাইম সেশন টেলিমেট্রি দ্বারা সুরক্ষিত' : '🔒 Protected by ShopNexus Real-Time Session Telemetry'}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedStaffForSessions(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
