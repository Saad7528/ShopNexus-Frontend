// SalesChart Analytics Schema
export type ChartTimeRange = '7d' | '30d' | '6m' | '1y';
export interface IChartDataPoint { label: string; revenue: number; ordersCount: number; }
