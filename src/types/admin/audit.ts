export interface IAuditLogEntry {
  id: string;
  timestamp: string;
  staffName: string;
  action: string;
  module: 'ORDERS' | 'INVENTORY' | 'STAFF' | 'SETTINGS' | 'FINANCE';
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}
