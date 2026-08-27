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
  nexusCoins?: number;
  loginStreak?: number;
  lastVisitDate?: string;
  isVipMember?: boolean;
  vipFirstOrderUsed?: boolean;
}

interface UserVaultData {
  nexusCoins: number;
  loginStreak: number;
  lastVisitDate?: string;
  isVipMember: boolean;
  vipFirstOrderUsed: boolean;
}

// 🛡️ Helper to persist per-account coin vaults in LocalStorage so logout NEVER wipes earned coins
const getStoredUserVault = (email: string): UserVaultData | null => {
  if (typeof window === 'undefined' || !email) return null;
  try {
    const raw = localStorage.getItem('shopnexus_user_vaults');
    if (!raw) return null;
    const vaults = JSON.parse(raw);
    return vaults[email.toLowerCase()] || null;
  } catch (_e) {
    return null;
  }
};

const saveStoredUserVault = (email: string, data: Partial<UserVaultData>) => {
  if (typeof window === 'undefined' || !email) return;
  try {
    const raw = localStorage.getItem('shopnexus_user_vaults');
    const vaults = raw ? JSON.parse(raw) : {};
    const key = email.toLowerCase();
    vaults[key] = {
      ...(vaults[key] || {
        nexusCoins: 0,
        loginStreak: 1,
        isVipMember: false,
        vipFirstOrderUsed: false,
      }),
      ...data,
    };
    localStorage.setItem('shopnexus_user_vaults', JSON.stringify(vaults));
  } catch (_e) {
    // Ignore storage quota errors
  }
};

// Sync user profile with backend API
const syncWithBackend = async (data: Partial<User>, token: string | null) => {
  if (!token || typeof window === 'undefined') return;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    await fetch(`${apiUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (_e) {
    // Graceful offline fallback
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (coinsToSpend: number) => boolean;
  processDailyVisit: () => { rewarded: boolean; coinsAdded: number; streak: number };
  claimVipPass: () => { success: boolean; message: string };
  useVipDiscount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

        // 🛡️ Load persistent coins & streak for this user email
        const vault = getStoredUserVault(user.email);

        const finalCoins =
          typeof user.nexusCoins === 'number' && user.nexusCoins > 0
            ? user.nexusCoins
            : vault?.nexusCoins !== undefined
            ? vault.nexusCoins
            : 0;

        const finalStreak =
          user.loginStreak && user.loginStreak > 1
            ? user.loginStreak
            : vault?.loginStreak || 1;

        const finalIsVip =
          user.isVipMember !== undefined
            ? user.isVipMember
            : vault?.isVipMember || false;

        const finalVipUsed =
          user.vipFirstOrderUsed !== undefined
            ? user.vipFirstOrderUsed
            : vault?.vipFirstOrderUsed || false;

        const finalLastVisit = user.lastVisitDate || vault?.lastVisitDate || '';

        const initializedUser: User = {
          ...user,
          nexusCoins: finalCoins,
          loginStreak: finalStreak,
          isVipMember: finalIsVip,
          vipFirstOrderUsed: finalVipUsed,
          lastVisitDate: finalLastVisit,
        };

        // Save back to persistent vault
        saveStoredUserVault(user.email, {
          nexusCoins: finalCoins,
          loginStreak: finalStreak,
          isVipMember: finalIsVip,
          vipFirstOrderUsed: finalVipUsed,
          lastVisitDate: finalLastVisit,
        });

        set({ user: initializedUser, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        // User session clears, but their account coin vault remains permanently saved by email
        set({ user: null, token: null, isAuthenticated: false });
      },
      addCoins: (amount: number) => {
        const state = get();
        if (!state.user) return;
        const currentCoins = state.user.nexusCoins || 0;
        const newCoins = currentCoins + amount;

        saveStoredUserVault(state.user.email, { nexusCoins: newCoins });
        syncWithBackend({ nexusCoins: newCoins }, state.token);

        set({
          user: {
            ...state.user,
            nexusCoins: newCoins,
          },
        });
      },
      spendCoins: (coinsToSpend: number) => {
        const state = get();
        if (!state.user) return false;
        const currentCoins = state.user.nexusCoins || 0;
        if (currentCoins < coinsToSpend) return false;

        const newCoins = Math.max(0, currentCoins - coinsToSpend);

        saveStoredUserVault(state.user.email, { nexusCoins: newCoins });
        syncWithBackend({ nexusCoins: newCoins }, state.token);

        set({
          user: {
            ...state.user,
            nexusCoins: newCoins,
          },
        });
        return true;
      },
      processDailyVisit: () => {
        const state = get();
        if (!state.user) return { rewarded: false, coinsAdded: 0, streak: 0 };

        const today = new Date().toISOString().split('T')[0];
        const lastDate = state.user.lastVisitDate;

        if (lastDate === today) {
          return { rewarded: false, coinsAdded: 0, streak: state.user.loginStreak || 1 };
        }

        let newStreak = 1;
        if (lastDate) {
          const prevDate = new Date(lastDate);
          const currDate = new Date(today);
          const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays === 1) {
            newStreak = (state.user.loginStreak || 1) + 1;
          } else {
            newStreak = 1;
          }
        }

        // Streak Coin Logic: Day 1: +5, Day 2: +10, Day 3+: +15
        let coinsToAdd = 5;
        if (newStreak === 2) coinsToAdd = 10;
        else if (newStreak >= 3) coinsToAdd = 15;

        const updatedCoins = (state.user.nexusCoins || 0) + coinsToAdd;

        saveStoredUserVault(state.user.email, {
          nexusCoins: updatedCoins,
          loginStreak: newStreak,
          lastVisitDate: today,
        });

        syncWithBackend(
          {
            nexusCoins: updatedCoins,
            loginStreak: newStreak,
            lastVisitDate: today,
          },
          state.token
        );

        set({
          user: {
            ...state.user,
            nexusCoins: updatedCoins,
            loginStreak: newStreak,
            lastVisitDate: today,
          },
        });

        return { rewarded: true, coinsAdded: coinsToAdd, streak: newStreak };
      },
      claimVipPass: () => {
        const state = get();
        if (!state.user) {
          return { success: false, message: 'ভিআইপি পাস সক্রিয় করতে প্রথমে লগইন করুন।' };
        }
        const currentCoins = state.user.nexusCoins || 0;
        if (currentCoins < 500) {
          return {
            success: false,
            message: `আপনার অ্যাকাউন্টে ৫০০ কয়েন প্রয়োজন। বর্তমানে আপনার আছে ${currentCoins} কয়েন (আর প্রয়োজন ${500 - currentCoins} কয়েন)।`,
          };
        }

        saveStoredUserVault(state.user.email, { isVipMember: true });
        syncWithBackend({ isVipMember: true }, state.token);

        set({
          user: {
            ...state.user,
            isVipMember: true,
          },
        });
        return {
          success: true,
          message: '🎉 অভিনন্দন! আপনার ব্ল্যাক ফ্রাইডে VIP পাস সক্রিয় হয়েছে। প্রথম অর্ডারে পাবেন ২০০ টাকা ফ্ল্যাট ছাড়!',
        };
      },
      useVipDiscount: () => {
        const state = get();
        if (!state.user) return;

        saveStoredUserVault(state.user.email, { vipFirstOrderUsed: true });
        syncWithBackend({ vipFirstOrderUsed: true }, state.token);

        set({
          user: {
            ...state.user,
            vipFirstOrderUsed: true,
          },
        });
      },
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
