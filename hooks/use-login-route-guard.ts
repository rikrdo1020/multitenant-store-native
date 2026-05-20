import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';

export function useLoginRouteGuard() {
  const router = useRouter();
  const rootNavState = useRootNavigationState();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!rootNavState?.key || !isAuthenticated) return;

    if (user?.role === 'customer') {
      router.replace('/marketplace');
      return;
    }

    router.replace('/(admin)/dashboard');
  }, [rootNavState?.key, isAuthenticated, router, user?.role]);

  return !isAuthenticated;
}
