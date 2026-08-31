// VIP Loyalty Tiers Config
export type VipTierLevel = 'Bronze' | 'Silver' | 'Gold VIP Elite';
export interface IVipTierConfig { tier: VipTierLevel; minPoints: number; rewardMultiplier: string; freeDelivery: boolean; priorityDispatch: boolean; color: string; }
