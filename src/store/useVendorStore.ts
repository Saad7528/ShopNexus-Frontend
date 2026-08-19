import { create } from 'zustand';

export interface IVendorProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  storeName: string;
  storeDescription: string;
  storeBanner: string;
  storeLogo: string;
  supportEmail: string;
  supportPhone: string;
  totalProducts?: number;
  totalRevenue?: number;
  totalOrders?: number;
}

interface VendorState {
  profile: IVendorProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: IVendorProfile) => void;
  updateProfileLocally: (data: Partial<IVendorProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  profile: {
    id: 'vendor_001',
    name: 'Saad Electronics & Goods',
    email: 'vendor@shopnexus.com',
    role: 'vendor',
    storeName: 'Nexus Tech Official Store',
    storeDescription: 'Premier flagship store offering guaranteed genuine electronics, smart gear, and audio equipment.',
    storeBanner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    storeLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    supportEmail: 'support@nexustech.io',
    supportPhone: '+1 (800) 555-0199',
    totalProducts: 24,
    totalRevenue: 34850,
    totalOrders: 142,
  },
  isLoading: false,
  error: null,
  setProfile: (profile: IVendorProfile) => set({ profile, error: null }),
  updateProfileLocally: (data: Partial<IVendorProfile>) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
