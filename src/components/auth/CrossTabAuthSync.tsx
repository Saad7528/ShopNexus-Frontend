'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, User } from '@/store/useAuthStore';

export const AUTH_CHANNEL_NAME = 'shopnexus_auth_sync_channel';

export interface AuthSyncEvent {
  type: 'LOGIN' | 'LOGOUT' | 'PROFILE_UPDATE';
  user?: User | null;
  token?: string | null;
  timestamp: number;
}

/**
 * Broadcast an authentication event to all other open tabs in the same browser
 */
export const broadcastAuthSync = (type: 'LOGIN' | 'LOGOUT' | 'PROFILE_UPDATE', user?: User | null, token?: string | null) => {
  if (typeof window === 'undefined') return;

  const payload: AuthSyncEvent = {
    type,
    user,
    token,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel (Modern Standard)
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (_e) {}

  // 2. Storage event fallback
  try {
    localStorage.setItem('shopnexus_auth_sync_event', JSON.stringify(payload));
  } catch (_e) {}
};

/**
 * Global component mounted in RootLayout to listen to auth state changes across all browser tabs
 */
export default function CrossTabAuthSync() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSyncEvent = (event: AuthSyncEvent) => {
      if (!event || !event.type) return;

      const { user: currentUser } = useAuthStore.getState();

      if (event.type === 'LOGOUT') {
        // Clear auth state in this tab
        useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        // If current route is protected, redirect to login
        const isProtected =
          pathname.startsWith('/admin') ||
          pathname.startsWith('/vendor') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/checkout');

        if (isProtected) {
          router.push('/login?reason=session_ended_other_tab');
        }
      } else if (event.type === 'LOGIN' && event.user && event.token) {
        // Update auth state in this tab
        if (typeof document !== 'undefined') {
          document.cookie = `token=${event.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        useAuthStore.setState({ user: event.user, token: event.token, isAuthenticated: true });

        // If role changed (e.g. from Admin to Customer) while on /admin, redirect
        const isInternalAdminRoute = pathname.startsWith('/admin');
        const isCustomer = event.user.role === 'customer' || !event.user.role;

        if (isInternalAdminRoute && isCustomer) {
          router.push('/?notice=switched_to_customer');
        }
      } else if (event.type === 'PROFILE_UPDATE' && event.user) {
        if (currentUser) {
          useAuthStore.setState({ user: { ...currentUser, ...event.user } });
        }
      }
    };

    // 1. Listen via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        broadcastChannel.onmessage = (msgEvent) => {
          handleSyncEvent(msgEvent.data);
        };
      }
    } catch (_e) {}

    // 2. Listen via localStorage event (for cross-tab storage changes)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'shopnexus_auth_sync_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleSyncEvent(parsed);
        } catch (_err) {}
      } else if (e.key === 'shopnexus-auth-storage' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (!parsed?.state?.token && useAuthStore.getState().isAuthenticated) {
            handleSyncEvent({ type: 'LOGOUT', timestamp: Date.now() });
          }
        } catch (_err) {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, [pathname, router]);

  return null;
}
