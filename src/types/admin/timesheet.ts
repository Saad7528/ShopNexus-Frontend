export interface IStaffTimesheet {
  staffId: string;
  name: string;
  avatar: string;
  role: string;
  clockInTime: string;
  clockOutTime?: string;
  activeHoursToday: string;
  status: 'ONLINE' | 'BREAK' | 'OFFLINE';
}
