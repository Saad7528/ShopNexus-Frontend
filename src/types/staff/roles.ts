// Staff Roles and 2FA Schema
export type StaffRole = 'Super Admin' | 'Customer Care Lead' | 'Inventory Specialist' | 'Logistics Driver';
export interface IStaffMember { id: string; name: string; email: string; role: StaffRole; avatar: string; twoFactorEnabled: boolean; lastActive: string; status: 'ACTIVE' | 'SUSPENDED'; }
