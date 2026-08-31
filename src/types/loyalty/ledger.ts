// Customer Loyalty Ledger
export interface ICustomerLoyaltyLedger { customerId: string; customerName: string; email: string; currentPoints: number; tier: 'Bronze' | 'Silver' | 'Gold VIP Elite'; totalSpentBDT: number; lastEarnedDate: string; }
