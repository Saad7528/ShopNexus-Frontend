// Revenue Inflow Ledger
export interface IRevenueSettlementRecord { id: string; gateway: 'bKash' | 'Nagad' | 'SSLCommerz' | 'COD'; grossAmount: number; fee: number; netSettled: number; timestamp: string; status: 'SETTLED' | 'PROCESSING' | 'HOLD'; }
