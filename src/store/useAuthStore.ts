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
  country?: string;
  storeName?: string;
  storeDescription?: string;
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
    }),
    {
      name: 'shopnexus-auth-storage',
      onRehydrateStorage: () => (state) => {
        // Sync cookie on rehydration
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `token=${state.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      },
    }
  )
);
