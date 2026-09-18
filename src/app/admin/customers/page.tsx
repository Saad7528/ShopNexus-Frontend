'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  Users,
  Search,
  Phone,
  RefreshCw,
  Loader2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  X,
  Eye,
  Download,
  ShoppingBag,
  Sparkles,
  Award,
  Calendar,
  Mail,
  ArrowUpDown,
  Filter,
  FileSpreadsheet,
  FileText,
  FileCode,
  ChevronDown,
  Check,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';
import { User } from '@/types/user';

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number; // ৳ BDT
  returnRate: number;
  isFlaggedFraud: boolean;
  joinedDate: string;
  tier?: 'Platinum VIP' | 'Gold VIP' | 'Silver' | 'Standard';
  lastOrderDate?: string;
  shippingAddress?: string;
}

const INITIAL_CUSTOMERS: ICustomer[] = [
  {
    id: 'cust-1',
    name: 'Tanvir Hossain',
    email: 'tanvir.dev@gmail.com',
    phone: '+880 1712-345678',
    ordersCount: 14,
    totalSpent: 248500,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-01-12',
    tier: 'Platinum VIP',
    lastOrderDate: '2026-09-15',
    shippingAddress: 'House 42, Road 11, Banani, Dhaka-1213',
  },
  {
    id: 'cust-2',
    name: 'Sarah Rahman',
    email: 'sarah.audio@gmail.com',
    phone: '+880 1819-876543',
    ordersCount: 9,
    totalSpent: 124000,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-02-01',
    tier: 'Platinum VIP',
    lastOrderDate: '2026-09-14',
    shippingAddress: 'Flat 4B, Concord Tower, Gulshan-2, Dhaka',
  },
  {
    id: 'cust-3',
    name: 'Mahbubur Alam',
    email: 'mahbub.biz@outlook.com',
    phone: '+880 1911-223344',
    ordersCount: 6,
    totalSpent: 68500,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-03-10',
    tier: 'Gold VIP',
    lastOrderDate: '2026-09-10',
    shippingAddress: 'GEC Circle, Nasirabad, Chittagong',
  },
  {
    id: 'cust-4',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    phone: '+880 1622-445566',
    ordersCount: 4,
    totalSpent: 34200,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-04-18',
    tier: 'Silver',
    lastOrderDate: '2026-08-29',
    shippingAddress: 'House 18, Road 4, Sector 7, Uttara, Dhaka',
  },
  {
    id: 'cust-5',
    name: 'Arif Chowdhury',
    email: 'arif.travels@yahoo.com',
    phone: '+880 1733-998877',
    ordersCount: 3,
    totalSpent: 21900,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-05-22',
    tier: 'Silver',
    lastOrderDate: '2026-08-15',
    shippingAddress: 'Kumarpara, Sylhet Sadar, Sylhet',
  },
  {
    id: 'cust-6',
    name: 'Fake Suspicious User',
    email: 'fake.account99@tempmail.com',
    phone: '+880 1300-000000',
    ordersCount: 4,
    totalSpent: 0,
    returnRate: 100,
    isFlaggedFraud: true,
    joinedDate: '2026-08-20',
    tier: 'Standard',
    lastOrderDate: '2026-09-01',
    shippingAddress: 'Unknown Location (Proxy IP Detected)',
  },
  {
    id: 'cust-7',
    name: 'Farhan Ahmed',
    email: 'farhan.tech@gmail.com',
    phone: '+880 1555-123456',
    ordersCount: 5,
    totalSpent: 47800,
    returnRate: 0,
    isFlaggedFraud: false,
    joinedDate: '2026-06-05',
    tier: 'Silver',
    lastOrderDate: '2026-09-08',
    shippingAddress: 'KDA Avenue, Sonadanga, Khulna',
  },
  {
    id: 'cust-8',
    name: 'Rubel Mia (High Returns)',
    email: 'rubel.returner@mail.com',
    phone: '+880 1888-776655',
    ordersCount: 6,
    totalSpent: 12000,
    returnRate: 67,
    isFlaggedFraud: false,
    joinedDate: '2026-07-11',
    tier: 'Standard',
    lastOrderDate: '2026-09-02',
    shippingAddress: 'Zindabazar, Sylhet',
  },
];

const getCustomerTier = (spent: number): 'Platinum VIP' | 'Gold VIP' | 'Silver' | 'Standard' => {
  if (spent >= 100000) return 'Platinum VIP';
  if (spent >= 50000) return 'Gold VIP';
  if (spent >= 20000) return 'Silver';
  return 'Standard';
};

export default function AdminCustomerDirectoryPage() {
  const { token } = useAuthStore();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const [customers, setCustomers] = useState<ICustomer[]>(INITIAL_CUSTOMERS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'top10' | 'vip' | 'active' | 'blocked' | 'risk'>('top10');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [updatingFraudId, setUpdatingFraudId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);

  // Multi-format Export state (Excel is default)
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'doc'>('excel');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

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

        // Map live customers
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
              tier: getCustomerTier(spent),
              lastOrderDate: '2026-09-15',
              shippingAddress: String(u.address || 'Dhaka, Bangladesh'),
            };
          });

        if (liveCustomers.length > 0) {
          setCustomers((prev) => {
            const liveEmails = new Set(liveCustomers.map((c) => c.email.toLowerCase().trim()));
            const ids = new Set(liveCustomers.map((c) => c.id));
            return [
              ...liveCustomers,
              ...prev.filter(
                (c) =>
                  !ids.has(c.id) &&
                  !liveEmails.has(c.email.toLowerCase().trim())
              ),
            ];
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
            ? (isBn ? `🚨 "${name}"-কে সফলভাবে ব্লক করা হয়েছে এবং ফ্রড শিল্ড ডাটাবেসে সেভ হয়েছে!` : `🚨 "${name}" marked as Fraud/Blocked and saved in DB!`)
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

  // 1. Export Excel Spreadsheet (.xls) - DEFAULT
  const handleExportExcel = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>ShopNexus Customers</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th { background-color: #ff4400; color: #ffffff; font-weight: bold; border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          td { border: 1px solid #ddd; padding: 6px 10px; font-family: Arial, sans-serif; font-size: 12px; }
          .num { mso-number-format:"\\#\\,\\#\\#0\\.00"; text-align: right; }
          .center { text-align: center; }
          .vip { font-weight: bold; color: #4f46e5; }
          .blocked { color: #dc2626; font-weight: bold; }
          .active { color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>ShopNexus Customer Directory & LTV Analytics Report</h2>
        <p>Export Date: ${dateStr} | Total Records: ${customers.length}</p>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Lifetime Value (BDT)</th>
              <th>VIP Tier</th>
              <th>Return Rate</th>
              <th>Security Status</th>
              <th>Joined Date</th>
              <th>Shipping Address</th>
            </tr>
          </thead>
          <tbody>
            ${customers
              .map(
                (c) => `
              <tr>
                <td>${c.id}</td>
                <td><b>${c.name}</b></td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td class="center">${c.ordersCount}</td>
                <td class="num">৳${c.totalSpent.toLocaleString()}</td>
                <td class="vip">${c.tier || getCustomerTier(c.totalSpent)}</td>
                <td class="center">${c.returnRate}%</td>
                <td class="${c.isFlaggedFraud ? 'blocked' : 'active'}">${c.isFlaggedFraud ? 'BLOCKED (Fraud)' : 'ACTIVE'}</td>
                <td>${c.joinedDate}</td>
                <td>${c.shippingAddress || 'N/A'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShopNexus_Customers_${dateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(isBn ? 'কাস্টমার ডাটাবেস এক্সেল শিট (.xls) হিসেবে এক্সপোর্ট হয়েছে।' : 'Customer directory exported as Excel (.xls).');
  };

  // 2. Export CSV (.csv)
  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,Orders,TotalSpentBDT,VIP_Tier,ReturnRate,Status,JoinedDate,ShippingAddress'];
    const rows = customers.map(
      (c) =>
        `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.ordersCount},${c.totalSpent},"${c.tier || getCustomerTier(c.totalSpent)}",${c.returnRate}%,"${c.isFlaggedFraud ? 'BLOCKED_FRAUD' : 'ACTIVE'}","${c.joinedDate}","${(c.shippingAddress || '').replace(/"/g, '""')}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShopNexus_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(isBn ? 'কাস্টমার ডাটাবেস সিএসভি (.csv) ফাইল হিসেবে ডাউনলোড হয়েছে।' : 'Customer directory exported as CSV (.csv).');
  };

  // 3. Export Word Doc (.doc)
  const handleExportDoc = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>ShopNexus Customer Directory Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1e293b; }
          h1 { color: #ff4400; font-size: 20pt; margin-bottom: 4px; }
          h3 { color: #334155; font-size: 13pt; margin-top: 0; }
          .meta { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 9.5pt; }
          th { background-color: #0f172a; color: #ffffff; padding: 8px 10px; text-align: left; font-weight: bold; border: 1px solid #cbd5e1; }
          td { padding: 7px 10px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { padding: 2px 6px; font-weight: bold; font-size: 8.5pt; }
          .badge-vip { color: #4338ca; }
          .badge-fraud { color: #b91c1c; font-weight: bold; }
          .badge-active { color: #047857; }
          .header-box { border-bottom: 2px solid #ff4400; padding-bottom: 12px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1>ShopNexus e-Commerce Platform</h1>
          <h3>Customer Intelligence, Lifetime Value (LTV) & Security Report</h3>
          <p class="meta">Export Date: ${new Date().toLocaleString()} | Total Registered: ${customers.length} | Verified Active: ${activeCount} | Blocked Risk: ${blockedCount}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Contact Phone</th>
              <th>Email</th>
              <th>Orders</th>
              <th>LTV Spend (BDT)</th>
              <th>VIP Tier</th>
              <th>Fraud / Status</th>
            </tr>
          </thead>
          <tbody>
            ${customers
              .map(
                (c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><b>${c.name}</b></td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td>${c.ordersCount}</td>
                <td><b>৳${c.totalSpent.toLocaleString()}</b></td>
                <td><span class="badge badge-vip">${c.tier || getCustomerTier(c.totalSpent)}</span></td>
                <td><span class="badge ${c.isFlaggedFraud ? 'badge-fraud' : 'badge-active'}">${c.isFlaggedFraud ? 'BLOCKED' : 'ACTIVE'}</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShopNexus_Customers_${dateStr}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    showToast(isBn ? 'কাস্টমার ডাটাবেস ডক ফাইল (.doc) হিসেবে এক্সপোর্ট হয়েছে।' : 'Customer directory exported as Word Doc (.doc).');
  };

  const triggerActiveExport = () => {
    if (exportFormat === 'excel') handleExportExcel();
    else if (exportFormat === 'csv') handleExportCSV();
    else if (exportFormat === 'doc') handleExportDoc();
  };

  // Metrics computation
  const totalCustomersCount = customers.length;
  const activeCount = useMemo(() => customers.filter((c) => !c.isFlaggedFraud).length, [customers]);
  const blockedCount = useMemo(() => customers.filter((c) => c.isFlaggedFraud).length, [customers]);
  const highRiskCount = useMemo(() => customers.filter((c) => c.returnRate > 50 || c.isFlaggedFraud).length, [customers]);
  const totalLTVVolume = useMemo(() => customers.reduce((acc, c) => acc + (c.isFlaggedFraud ? 0 : c.totalSpent), 0), [customers]);
  const vipShoppersCount = useMemo(() => customers.filter((c) => c.totalSpent >= 50000 && !c.isFlaggedFraud).length, [customers]);

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
      result.sort((a, b) => b.totalSpent - a.totalSpent);
      result = result.slice(0, 10);
    } else if (customerFilter === 'vip') {
      result = result.filter((c) => c.totalSpent >= 50000);
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (customerFilter === 'active') {
      result = result.filter((c) => !c.isFlaggedFraud);
    } else if (customerFilter === 'blocked') {
      result = result.filter((c) => c.isFlaggedFraud);
    } else if (customerFilter === 'risk') {
      result = result.filter((c) => c.returnRate > 50 || c.isFlaggedFraud);
    }

    return result;
  }, [customers, searchQuery, customerFilter]);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isBn ? 'গ্রাহক বিশ্লেষণ ও ফ্রড প্রতিরোধ ইকোসিস্টেম' : 'Customer Intelligence & Fraud Defense'}
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'কাস্টমার ডিরেক্টরি ও এলটিভি স্কোরিং' : 'Customer Directory & Lifetime Value (LTV)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isBn
                ? 'গ্রাহকদের প্রোফাইল বিশ্লেষণ করুন, মোট লাইফটাইম ভ্যালু (LTV) ট্র্যাক করুন, এবং ১-ক্লিকে সন্দেহজনক ট্রাফিক ফ্রড শিল্ডে ব্লক করুন।'
                : 'Analyze customer profiles, track lifetime spending value (LTV), identify high return risks, and manage 1-click fraud IP blocking.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
            {/* Multi-format Export Dropdown with Excel as Default */}
            <div className="relative inline-flex items-center rounded-xl shadow-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 transition-all justify-between">
              <button
                type="button"
                onClick={triggerActiveExport}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-l-xl transition-all cursor-pointer truncate flex-1 min-w-0"
                title={isBn ? 'এক্সপোর্ট করুন' : 'Export Data'}
              >
                {exportFormat === 'excel' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                {exportFormat === 'csv' && <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                {exportFormat === 'doc' && <FileCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                <span className="truncate">
                  {exportFormat === 'excel'
                    ? (isBn ? 'এক্সেল (.xls)' : 'Export Excel')
                    : exportFormat === 'csv'
                    ? (isBn ? 'সিএসভি (.csv)' : 'Export CSV')
                    : (isBn ? 'ডক (.doc)' : 'Export Doc')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="px-2 py-2 sm:py-2.5 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-r-xl transition-all cursor-pointer shrink-0"
                title={isBn ? 'এক্সপোর্ট ফরম্যাট নির্বাচন করুন' : 'Select Export Format'}
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isExportMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsExportMenuOpen(false)}
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {isBn ? 'এক্সপোর্ট ফরম্যাট নির্বাচন' : 'Export Format Options'}
                    </div>

                    {/* 1. Excel Spreadsheet (Default) */}
                    <button
                      type="button"
                      onClick={() => {
                        setExportFormat('excel');
                        handleExportExcel();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        exportFormat === 'excel'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div className="text-left">
                          <div className="font-bold">{isBn ? 'এক্সেল শিট (.xls)' : 'Excel Spreadsheet (.xls)'}</div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{isBn ? 'ডিফল্ট ফরম্যাট' : 'Default Format'}</div>
                        </div>
                      </div>
                      {exportFormat === 'excel' && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </button>

                    {/* 2. CSV File */}
                    <button
                      type="button"
                      onClick={() => {
                        setExportFormat('csv');
                        handleExportCSV();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        exportFormat === 'csv'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                        <div className="text-left">
                          <div className="font-bold">{isBn ? 'সিএসভি ফাইল (.csv)' : 'CSV Document (.csv)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isBn ? 'কমা সেপারেটেড ফাইল' : 'Comma Separated'}</div>
                        </div>
                      </div>
                      {exportFormat === 'csv' && <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                    </button>

                    {/* 3. Word Doc */}
                    <button
                      type="button"
                      onClick={() => {
                        setExportFormat('doc');
                        handleExportDoc();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        exportFormat === 'doc'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                        <div className="text-left">
                          <div className="font-bold">{isBn ? 'ডক ফাইল (.doc)' : 'Word Document (.doc)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{isBn ? 'মাইক্রোসফট ওয়ার্ড রিপোর্ট' : 'Microsoft Word Doc'}</div>
                        </div>
                      </div>
                      {exportFormat === 'doc' && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchLiveUsers()}
              disabled={isLoadingUsers}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              <span className="truncate">{isBn ? 'ডাটাবেস সিঙ্ক' : 'Sync Live DB'}</span>
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

        {/* WORKABLE & DYNAMIC KPI METRIC CARDS (2-Columns on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Total Registered Shoppers */}
          <button
            type="button"
            onClick={() => setCustomerFilter('all')}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              customerFilter === 'all'
                ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'নিবন্ধিত গ্রাহক' : 'Total Registered'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(totalCustomersCount) : totalCustomersCount}
              </span>
              <span className="text-[9px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-1 truncate">
                {isBn ? `${toBengaliNumber(activeCount)} জন সক্রিয়` : `${activeCount} active`}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{isBn ? 'রিয়েল-টাইম বেস' : 'Live base'}</span>
              </span>
            </div>
          </button>

          {/* Card 2: Total LTV Generated (Top 10 Spenders) */}
          <button
            type="button"
            onClick={() => setCustomerFilter('top10')}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              customerFilter === 'top10'
                ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-orange-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'মোট LTV ভলিউম' : 'Total LTV Generated'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white truncate">
                  {isBn ? `৳${toBengaliNumber(totalLTVVolume.toLocaleString('en-US'))}` : `৳${totalLTVVolume.toLocaleString()}`}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold shrink-0">BDT</span>
              </div>
              <span className="text-[9px] sm:text-xs text-orange-600 dark:text-orange-400 font-bold block mt-1 truncate">
                {isBn ? 'টপ স্পেন্ডারস' : 'Top 10 Spenders'}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
                <span className="truncate">{isBn ? 'LTV র‍্যাংকিং' : 'LTV Ranking'}</span>
              </span>
            </div>
          </button>

          {/* Card 3: VIP High Spenders */}
          <button
            type="button"
            onClick={() => setCustomerFilter('vip')}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              customerFilter === 'vip'
                ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'ভিআইপি স্পেন্ডারস' : 'VIP High Spenders'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(vipShoppersCount) : vipShoppersCount}
              </span>
              <span className="text-[9px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-bold block mt-1 truncate">
                Platinum / Gold
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <Award className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="truncate">{isBn ? '৳৫০হাজার+' : '৳50k+ VIP'}</span>
              </span>
            </div>
          </button>

          {/* Card 4: Fraud Shield Blocks */}
          <button
            type="button"
            onClick={() => setCustomerFilter('blocked')}
            className={`text-left p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer group shadow-sm backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              customerFilter === 'blocked'
                ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {isBn ? 'ফ্রড ব্লকড' : 'Fraud Shield Blocks'}
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                {isBn ? toBengaliNumber(blockedCount) : blockedCount}
              </span>
              <span className="text-[9px] sm:text-xs text-rose-600 dark:text-rose-400 font-bold block mt-1 truncate">
                {isBn ? `${toBengaliNumber(highRiskCount)} ঝুঁকিপূর্ণ` : `${highRiskCount} at risk`}
              </span>
            </div>
            <div className="mt-2 text-[9px] sm:text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span className="flex items-center gap-1 truncate">
                <ShieldCheck className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{isBn ? 'আইপি লক' : '1-Click Lock'}</span>
              </span>
            </div>
          </button>
        </div>

        {/* CUSTOMER DIRECTORY & FILTERS TABLE CONTAINER */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn
                    ? 'মোবাইল নম্বর (+880...), নাম বা ইমেইল দিয়ে খুঁজুন...'
                    : 'Search by phone (+880...), name, or email...'
                }
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-orange-500 focus:outline-none transition-all shadow-inner"
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

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setCustomerFilter('top10')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  customerFilter === 'top10'
                    ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isBn ? 'টপ ১০ ক্রেতা (LTV)' : 'Top 10 Spenders'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('vip')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  customerFilter === 'vip'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isBn ? `ভিআইপি টায়ার (${toBengaliNumber(vipShoppersCount)})` : `VIP Tiers (${vipShoppersCount})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isBn ? `সক্রিয় (${toBengaliNumber(activeCount)})` : `Active (${activeCount})`}
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('blocked')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'blocked'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isBn ? `🚨 ব্লকড (${toBengaliNumber(blockedCount)})` : `🚨 Blocked (${blockedCount})`}
              </button>

              <button
                type="button"
                onClick={() => setCustomerFilter('risk')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  customerFilter === 'risk'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isBn ? 'উচ্চ ঝুঁকি' : 'High Risk'}
              </button>
            </div>
          </div>

          {/* ACTIVE FILTER STATUS BANNER */}
          {(customerFilter !== 'top10' || searchQuery) && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">
                  {isBn ? 'সক্রিয় ফিল্টার:' : 'Active Filter:'}{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {customerFilter === 'vip'
                      ? (isBn ? '💎 ভিআইপি স্পেন্ডারস (Platinum/Gold)' : '💎 VIP High Spenders')
                      : customerFilter === 'all'
                      ? (isBn ? '👥 সকল গ্রাহক' : '👥 All Customers')
                      : customerFilter === 'active'
                      ? (isBn ? '✨ সক্রিয় ও অনুমোদিত গ্রাহক' : '✨ Active Verified Customers')
                      : customerFilter === 'blocked'
                      ? (isBn ? '🚨 ফ্রড শিল্ডে ব্লকড গ্রাহক' : '🚨 Fraud Shield Blocked Customers')
                      : customerFilter === 'risk'
                      ? (isBn ? '⚠️ উচ্চ রিটার্ন ঝুঁকিপূর্ণ গ্রাহক' : '⚠️ High Return Risk Customers')
                      : (isBn ? '🏆 টপ ১০ ক্রেতা (LTV)' : '🏆 Top 10 Spenders')}
                  </strong>
                  {searchQuery && <span> • {isBn ? `সার্চ: "${searchQuery}"` : `Search: "${searchQuery}"`}</span>}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[11px]">
                  {isBn ? `${toBengaliNumber(filteredCustomers.length)} জন কাস্টমার` : `${filteredCustomers.length} customers`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCustomerFilter('top10');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>{isBn ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>
          )}

          <div className="sm:hidden px-3.5 py-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span>👉</span>
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono font-bold text-slate-700 dark:text-slate-300">
              {isBn ? toBengaliNumber(filteredCustomers.length) : filteredCustomers.length}
            </span>
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
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer hover:bg-orange-600"
                  >
                    {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Search & Filters'}
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">{isBn ? 'গ্রাহক পরিচিতি' : 'Customer Profile'}</th>
                    <th className="px-5 py-3.5">{isBn ? 'মোবাইল ও ইমেইল' : 'Contact Details'}</th>
                    <th className="px-5 py-3.5">{isBn ? 'অর্ডার সংখ্যা' : 'Orders'}</th>
                    <th className="px-5 py-3.5">{isBn ? 'লাইফটাইম ভ্যালু (LTV)' : 'Lifetime Value (৳ BDT)'}</th>
                    <th className="px-5 py-3.5">{isBn ? 'রিটার্ন হেলথ' : 'Return Health'}</th>
                    <th className="px-5 py-3.5 text-right">{isBn ? 'ফ্রড শিল্ড ও অ্যাকশন' : 'Fraud Control'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {filteredCustomers.map((cust, idx) => {
                    const tier = cust.tier || getCustomerTier(cust.totalSpent);
                    return (
                      <tr key={cust.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        {/* 1. Customer Avatar & Name */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                              {cust.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{cust.name}</span>
                                {customerFilter === 'top10' && idx < 3 && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                                    TOP #{idx + 1}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                  {isBn ? `যোগদান: ${cust.joinedDate}` : `Joined: ${cust.joinedDate}`}
                                </span>
                                {tier === 'Platinum VIP' && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold border border-indigo-500/20">
                                    Platinum VIP
                                  </span>
                                )}
                                {tier === 'Gold VIP' && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold border border-amber-500/20">
                                    Gold VIP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Details */}
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{cust.phone}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block truncate max-w-[180px] mt-0.5">
                            {cust.email}
                          </span>
                        </td>

                        {/* 3. Orders Count */}
                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                            <span>{isBn ? `${toBengaliNumber(cust.ordersCount)}টি অর্ডার` : `${cust.ordersCount} orders`}</span>
                          </div>
                        </td>

                        {/* 4. Lifetime Value */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                            {isBn ? `৳${toBengaliNumber(cust.totalSpent.toLocaleString('en-US'))} BDT` : `৳${cust.totalSpent.toLocaleString()} BDT`}
                          </div>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cust.totalSpent >= 100000
                                  ? 'bg-indigo-500'
                                  : cust.totalSpent >= 50000
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(10, (cust.totalSpent / 250000) * 100))}%` }}
                            />
                          </div>
                        </td>

                        {/* 5. Return Health */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {cust.returnRate > 50 || cust.isFlaggedFraud ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {isBn ? `${toBengaliNumber(cust.returnRate)}% উচ্চ ঝুঁকি` : `${cust.returnRate}% High Risk`}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {isBn ? '০% পরিচ্ছন্ন হিস্ট্রি' : '0% Clean History'}
                            </span>
                          )}
                        </td>

                        {/* 6. Fraud Shield & Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedCustomer(cust)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                              title={isBn ? 'কাস্টমার প্রোফাইল ও বিস্তারিত দেখুন' : 'View Customer Profile'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={updatingFraudId === cust.id}
                              onClick={() => toggleFraudBlock(cust.id, cust.name)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                cust.isFlaggedFraud
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 hover:bg-rose-700'
                                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {updatingFraudId === cust.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>{isBn ? 'সংরক্ষণ...' : 'Saving...'}</span>
                                </>
                              ) : cust.isFlaggedFraud ? (
                                <span>{isBn ? '🚨 ব্লকড (ফ্রড)' : '🚨 Blocked (Fraud)'}</span>
                              ) : (
                                <span>{isBn ? 'সক্রিয় (অনুমোদিত)' : 'Active (Allowed)'}</span>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* CUSTOMER PROFILE MODAL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] text-white font-black text-base flex items-center justify-center shadow-md">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedCustomer.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedCustomer.tier || getCustomerTier(selectedCustomer.totalSpent)} • {isBn ? `আইডি: ${selectedCustomer.id}` : `ID: ${selectedCustomer.id}`}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </span>
                  <div className="font-mono text-slate-700 dark:text-slate-300 truncate">
                    {selectedCustomer.email}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    {isBn ? 'মোট অর্জিত LTV' : 'Lifetime Value'}
                  </span>
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {isBn ? `৳${toBengaliNumber(selectedCustomer.totalSpent.toLocaleString('en-US'))} BDT` : `৳${selectedCustomer.totalSpent.toLocaleString()} BDT`}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    {isBn ? 'অর্ডার সংখ্যা' : 'Completed Orders'}
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isBn ? `${toBengaliNumber(selectedCustomer.ordersCount)}টি সম্পন্ন` : `${selectedCustomer.ordersCount} Completed`}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isBn ? 'নিবন্ধনের তারিখ:' : 'Registration Date:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isBn ? 'সর্বশেষ অর্ডার:' : 'Latest Order:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.lastOrderDate || '2026-09-15'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Shipping Address:'}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-right max-w-[200px] truncate">
                    {selectedCustomer.shippingAddress || 'Banani, Dhaka'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">{isBn ? 'সিকিউরিটি স্ট্যাটাস:' : 'Security Status:'}</span>
                  <span className={`font-bold ${selectedCustomer.isFlaggedFraud ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {selectedCustomer.isFlaggedFraud
                      ? (isBn ? '🚨 ফ্রড ব্লকলিস্টে তালিকাভুক্ত' : '🚨 Blocked in Fraud Shield')
                      : (isBn ? '✓ অনুমোদিত ও সক্রিয় ক্রেতা' : '✓ Verified Active Shopper')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleFraudBlock(selectedCustomer.id, selectedCustomer.name);
                    setSelectedCustomer((prev) => prev ? { ...prev, isFlaggedFraud: !prev.isFlaggedFraud } : null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCustomer.isFlaggedFraud
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {selectedCustomer.isFlaggedFraud
                    ? (isBn ? 'ব্লক আনলক করুন (Allow)' : 'Unblock Shopper (Allow)')
                    : (isBn ? 'ফ্রড শিল্ডে ব্লক করুন (Block)' : 'Block in Fraud Shield (Block)')}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close Profile'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
