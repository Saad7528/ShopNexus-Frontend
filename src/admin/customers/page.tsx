'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
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
    title: 'Super Admin (Master Authority)',
    desc: 'Unrestricted master access to all databases, financial logs, RBAC roles, product pricing, and settings.',
    allowed: ['Full Read & Write', 'RBAC Control', 'Financial Payouts', 'Catalog & Orders', 'System Deletions'],
    restricted: ['None'],
  },
  'Telesales Executive': {
    title: 'Telesales / Order Confirmation Executive',
    desc: 'Communicates with customers, confirms pending cash-on-delivery orders, and verifies delivery addresses.',
    allowed: ['View Pending Orders', 'Confirm/Cancel Orders', 'Update Delivery Address', 'Customer Notes'],
    restricted: ['No Product Pricing Access', 'No Stock Adjustments', 'No Financial Balances'],
  },
  'Delivery Officer': {
    title: 'Delivery & Tracking Officer',
    desc: 'Oversees packaging, assigns 3rd-party couriers (Pathao/RedX/Steadfast), and generates shipping labels.',
    allowed: ['View Order Details', 'Generate Barcode Invoices', 'Update 5-Stage Courier Status', 'Logistics Dispatch'],
    restricted: ['No Customer Billing Edits', 'No Catalog Uploads', 'No Financial Reports'],
  },
  'Inventory Manager': {
    title: 'Catalog / Inventory Manager',
    desc: 'Uploads new products, manages variants, adjusts stock units, and sets low-stock thresholds.',
    allowed: ['Upload Products', 'Adjust Stock & SKU', 'Edit Descriptions & Media', 'Set Flash Quotas'],
    restricted: ['No Customer Order Data', 'No Payment Gateway Info', 'No Staff Accounts'],
  },
  'Customer Support': {
    title: 'Customer Support Agent',
    desc: 'Manages incoming customer inquiries, AI chat escalations, reviews moderation, and return RMA requests.',
    allowed: ['View Customer Queries', 'Process Return Requests', 'Moderate Product Reviews'],
    restricted: ['No Order Price Modifications', 'No Database Direct Changes', 'No Staff Access'],
  },
  Accountant: {
    title: 'Accountant / Financial Manager',
    desc: 'Audits daily sales, reconciles bKash/Nagad/Stripe payouts, and analyzes revenue growth reports.',
    allowed: ['View Financial Statements', 'Reconcile Gateways', 'Sales Analytics Reports', 'Refund Audits'],
    restricted: ['No Catalog Modifications', 'No Live Dispatch Management'],
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
    totalSpent: 148500, // ৳ 1.48 Lakh
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
  const [staffList, setStaffList] = useState<IStaffRole[]>(INITIAL_STAFF);
  const [customers, setCustomers] = useState<ICustomer[]>(INITIAL_CUSTOMERS);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<keyof typeof ROLE_DEFINITIONS | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      alert('Please fill out all staff fields (Name, Gmail, Password).');
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

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke credentials for "${name}"?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Revoked staff access for "${name}"`);
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
              Access Control (RBAC) & Security
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Staff Roles & Customer Security</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create staff accounts with Gmail & password, assign granular RBAC module permissions, and manage customer fraud blocklists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddStaffOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Staff Account
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

        {/* 👥 SECTION 1: STAFF ROLES & PERMISSIONS TABLE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Staff Accounts & RBAC Permissions</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{staffList.length} Authorized Team Members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Staff Member</th>
                  <th className="px-5 py-3.5">Gmail Login</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Permission Scope</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Joined {st.createdAt}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-orange-600 dark:text-orange-400 text-[11px] font-semibold">{st.email}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] border border-slate-200 dark:border-slate-700">
                          {st.role}
                        </span>
                        {/* ℹ️ Info Button to view exact breakdown of this role */}
                        <button
                          type="button"
                          onClick={() => setSelectedRoleInfo(st.role as any)}
                          className="p-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs transition-colors cursor-pointer"
                          title="Click to view detailed permissions (i-button)"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {st.permissions.canManageCatalog && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                            Catalog
                          </span>
                        )}
                        {st.permissions.canEditOrders && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                            Orders
                          </span>
                        )}
                        {st.permissions.canManageLogistics && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                            Logistics
                          </span>
                        )}
                        {st.permissions.canAccessRBAC && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold">
                            Master Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        {st.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {st.role !== 'Super Admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(st.id, st.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                          title="Revoke Credentials"
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

        {/* 🛡️ SECTION 2: CUSTOMER DATABASE & FRAUD DETECTION */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Customer Lifetime Value (LTV) & Fraud Detection</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Track customer return history & block fake spam orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Phone & Email</th>
                  <th className="px-5 py-3.5">Orders</th>
                  <th className="px-5 py-3.5">Lifetime Value (৳ BDT)</th>
                  <th className="px-5 py-3.5">Return Health</th>
                  <th className="px-5 py-3.5 text-right">Fraud Control</th>
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
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{cust.ordersCount} completed</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{cust.totalSpent.toLocaleString()} BDT
                    </td>
                    <td className="px-5 py-3.5">
                      {cust.returnRate > 50 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                          {cust.returnRate}% High Return Risk
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          0% Clean History
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
                        {cust.isFlaggedFraud ? '🚨 Blocked (Fraud)' : 'Active (Allowed)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ℹ️ ROLE PERMISSION BREAKDOWN MODAL (Triggered by i-button) */}
        {selectedRoleInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {ROLE_DEFINITIONS[selectedRoleInfo].title}
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
                {ROLE_DEFINITIONS[selectedRoleInfo].desc}
              </p>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1.5">
                    ✓ Permitted Access Modules:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {ROLE_DEFINITIONS[selectedRoleInfo].allowed.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1.5">
                    ✕ Restricted / Blocked Features:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {ROLE_DEFINITIONS[selectedRoleInfo].restricted.map((item, idx) => (
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
                  Close Specification
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
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Create Staff Login</h2>
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
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahbub Alam"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Staff Gmail / Email Address *
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
                    Secure Password *
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
                    Designated Role *
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Telesales Executive">Telesales / Order Confirmation Executive</option>
                    <option value="Delivery Officer">Delivery & Tracking Officer</option>
                    <option value="Inventory Manager">Catalog / Inventory Manager</option>
                    <option value="Customer Support">Customer Support Agent</option>
                    <option value="Accountant">Accountant / Financial Manager</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-md shadow-orange-500/25 cursor-pointer"
                  >
                    Create Staff Credentials
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
