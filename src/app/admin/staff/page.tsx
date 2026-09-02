'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/RoleGuard';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Sparkles,
  ShieldAlert,
  Sliders,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  BadgeCheck,
} from 'lucide-react';

interface IStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Customer Care Lead' | 'Inventory Manager' | 'Logistics Officer';
  twoFactorEnabled: boolean;
  status: 'Active' | 'Idle' | 'Suspended';
  lastActive: string;
  avatarColor: string;
}

interface IPermissionRule {
  id: string;
  category: string;
  title: string;
  description: string;
  superAdmin: boolean;
  customerCare: boolean;
  inventoryManager: boolean;
  logistics: boolean;
}

const INITIAL_STAFF: IStaffMember[] = [
  {
    id: 'st-1',
    name: 'S.M. Amirul Islam Saad',
    email: 'admin@shopnexus.io',
    phone: '+880 1711-000111',
    role: 'Super Admin',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: 'Right now (Online)',
    avatarColor: 'from-[#ff4400] to-[#ff7700]',
  },
  {
    id: 'st-2',
    name: 'Tahmidur Rahman',
    email: 'tahmid.support@shopnexus.io',
    phone: '+880 1822-334455',
    role: 'Customer Care Lead',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: '8 mins ago',
    avatarColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'st-3',
    name: 'Farzana Akter',
    email: 'farzana.stock@shopnexus.io',
    phone: '+880 1933-445566',
    role: 'Inventory Manager',
    twoFactorEnabled: false,
    status: 'Active',
    lastActive: '25 mins ago',
    avatarColor: 'from-purple-600 to-pink-600',
  },
  {
    id: 'st-4',
    name: 'Kamrul Hasan',
    email: 'kamrul.dispatch@shopnexus.io',
    phone: '+880 1644-556677',
    role: 'Logistics Officer',
    twoFactorEnabled: true,
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: 'from-emerald-600 to-teal-600',
  },
];

const INITIAL_PERMISSIONS: IPermissionRule[] = [
  {
    id: 'p-rev',
    category: 'Financials & Margins',
    title: 'View Revenue & Profit Margins',
    description: 'See total sales earnings, wholesale cost prices, and net P&L.',
    superAdmin: true,
    customerCare: false,
    inventoryManager: false,
    logistics: false,
  },
  {
    id: 'p-cat-edit',
    category: 'Catalog & Inventory',
    title: 'Add & Edit Products / Stock',
    description: 'Modify product specifications, pricing, stock levels, and trust badges.',
    superAdmin: true,
    customerCare: false,
    inventoryManager: true,
    logistics: false,
  },
  {
    id: 'p-cat-del',
    category: 'Catalog & Inventory',
    title: 'Delete Products Permanently',
    description: 'Remove catalog items from the store database.',
    superAdmin: true,
    customerCare: false,
    inventoryManager: false,
    logistics: false,
  },
  {
    id: 'p-ord-view',
    category: 'Orders & Fulfillment',
    title: 'Process Customer Orders',
    description: 'Update order milestones from Pending to Confirmed and Processing.',
    superAdmin: true,
    customerCare: true,
    inventoryManager: false,
    logistics: true,
  },
  {
    id: 'p-print',
    category: 'Orders & Fulfillment',
    title: 'Batch Print Invoices & Manifests',
    description: 'Generate packing slips, parcel barcodes, and courier handover sheets.',
    superAdmin: true,
    customerCare: true,
    inventoryManager: false,
    logistics: true,
  },
  {
    id: 'p-contact',
    category: 'Customer Communication',
    title: 'Access Customer Contact & Send WhatsApp',
    description: 'View customer phone numbers and send issue reports or abandoned cart offers.',
    superAdmin: true,
    customerCare: true,
    inventoryManager: false,
    logistics: false,
  },
  {
    id: 'p-coupon',
    category: 'Marketing & Promotions',
    title: 'Create Promo Coupons & Deals',
    description: 'Configure discount codes, bundle offers, and flash sales.',
    superAdmin: true,
    customerCare: false,
    inventoryManager: false,
    logistics: false,
  },
  {
    id: 'p-staff',
    category: 'System Security',
    title: 'Manage Staff Credentials & Roles',
    description: 'Invite new staff members and configure access permissions.',
    superAdmin: true,
    customerCare: false,
    inventoryManager: false,
    logistics: false,
  },
];

export default function AdminStaffRolesPage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'matrix'>('roster');
  const [staff, setStaff] = useState<IStaffMember[]>(INITIAL_STAFF);
  const [permissions, setPermissions] = useState<IPermissionRule[]>(INITIAL_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Staff Modal
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<IStaffMember['role']>('Customer Care Lead');
  
  // Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePermission = (
    permissionId: string,
    roleKey: 'superAdmin' | 'customerCare' | 'inventoryManager' | 'logistics'
  ) => {
    if (roleKey === 'superAdmin') {
      showToast('Super Admin permissions cannot be restricted for security safeguards.');
      return;
    }

    setPermissions((prev) =>
      prev.map((p) => (p.id === permissionId ? { ...p, [roleKey]: !p[roleKey] } : p))
    );
    showToast('Permission matrix updated successfully.');
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newMember: IStaffMember = {
      id: `st-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone || '+880 1700-000000',
      role: newStaffRole,
      twoFactorEnabled: true,
      status: 'Active',
      lastActive: 'Just invited',
      avatarColor: 'from-amber-600 to-orange-600',
    };

    setStaff((prev) => [newMember, ...prev]);
    setIsAddStaffModalOpen(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    showToast(`Staff member ${newMember.name} has been invited with ${newMember.role} role.`);
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Security & Role-Based Access Control (RBAC)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Staff Roles & Granular Permissions System
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              প্রশাসনিক কর্মকর্তাদের রোল নির্ধারণ করুন এবং কোন রোলে কোন কোন পারমিশন সক্রিয় থাকবে তা নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddStaffModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Staff Member</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Members ({staff.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Permissions Matrix</span>
          </button>
        </div>

        {/* TAB 1: STAFF ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-xs w-full relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search staff name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-orange-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStaff.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-4 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${member.avatarColor} text-white font-black text-base flex items-center justify-center shadow-md`}
                      >
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {member.name}
                          {member.twoFactorEnabled && (
                            <span title="2FA Authenticated">
                              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">{member.email}</span>
                        <span className="text-[11px] font-mono text-slate-400">{member.phone}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        member.role === 'Super Admin'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                          : member.role === 'Customer Care Lead'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : member.role === 'Inventory Manager'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Last Active: <strong className="text-slate-700 dark:text-slate-300">{member.lastActive}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        2FA Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PERMISSIONS MATRIX */}
        {activeTab === 'matrix' && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                Granular Security Permissions Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle permissions to immediately grant or revoke module access for each administrative staff role.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 w-1/3">Security Domain & Action</th>
                    <th className="px-4 py-3.5 text-center">Super Admin</th>
                    <th className="px-4 py-3.5 text-center">Customer Care Lead</th>
                    <th className="px-4 py-3.5 text-center">Inventory Manager</th>
                    <th className="px-4 py-3.5 text-center">Logistics Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {permissions.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block mb-0.5">
                          {rule.category}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{rule.title}</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{rule.description}</p>
                      </td>

                      {/* Super Admin */}
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                          <Lock className="w-4 h-4" />
                        </div>
                      </td>

                      {/* Customer Care */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(rule.id, 'customerCare')}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                            rule.customerCare
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {rule.customerCare ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Inventory Manager */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(rule.id, 'inventoryManager')}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                            rule.inventoryManager
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {rule.inventoryManager ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Logistics */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(rule.id, 'logistics')}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer mx-auto ${
                            rule.logistics
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {rule.logistics ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ➕ ADD NEW STAFF MODAL */}
        {isAddStaffModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Invite Administrative Staff
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      নতুন স্টাফ মেম্বার যোগ করুন এবং তার দায়িত্ব নির্ধারণ করুন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    Full Name (স্টাফের পুরো নাম):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuzur Rahman"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Official Email:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="staff@shopnexus.io"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      placeholder="+880 1711-xxxxxx"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">
                    Assign Role (পদবি ও পারমিশন):
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Customer Care Lead">Customer Care Lead (অর্ডার প্রসেস ও কাস্টমার যোগাযোগ)</option>
                    <option value="Inventory Manager">Inventory Manager (স্টক ও ক্যাটালগ এডিট)</option>
                    <option value="Logistics Officer">Logistics Officer (পার্সেল ডিসপ্যাচ ও প্রিন্ট)</option>
                    <option value="Super Admin">Super Admin (সম্পূর্ণ প্রশাসনিক অধিকার)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Send Invite & Grant Access</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Toast Message */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-orange-500/40 shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
