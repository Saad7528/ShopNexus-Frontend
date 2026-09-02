// Return Rate Risk Registry
export interface IReturnRiskRecord { returnId: string; orderNumber: string; customerPhone: string; riskScore: 'LOW' | 'MEDIUM' | 'HIGH'; reason: string; resolutionStatus: 'UNDER_INSPECTION' | 'REFUNDED' | 'EXCHANGED' | 'REJECTED'; }
