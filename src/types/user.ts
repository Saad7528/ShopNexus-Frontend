export type UserRole = 'customer' | 'vendor' | 'admin' | 'staff';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  storeName?: string;
  storeDescription?: string;
  loyaltyPoints?: number;
  nexusCoins?: number;
  loginStreak?: number;
  lastVisitDate?: string;
  isVipMember?: boolean;
  vipFirstOrderUsed?: boolean;
  isFlaggedFraud?: boolean;
  isLocked?: boolean;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt?: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
