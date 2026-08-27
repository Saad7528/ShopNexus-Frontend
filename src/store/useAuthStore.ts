import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  nexusCoins?: number;
  country?: string;
  storeName?: string;
  storeDescription?: string;
  isVipMember?: boolean;
  vipFirstOrderUsed?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  spendCoins: (amount: number) => void;
  useVipDiscount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (typeof document !== 'undefined') {
          if (token) {
            document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
          } else {
            document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        }
        set({ token });
      },
      login: (user, token) => {
        if (typeof document !== 'undefined' && token) {
          document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      spendCoins: (amount: number) =>
        set((state) => {
          if (!state.user) return state;
          const currentCoins = state.user.nexusCoins || 0;
          return {
            user: {
              ...state.user,
              nexusCoins: Math.max(0, currentCoins - amount),
            },
          };
        }),

      useVipDiscount: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              vipFirstOrderUsed: true,
            },
          };
        }),
    }),
    {
      name: 'shopnexus-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `token=${state.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      },
    }
  )
);