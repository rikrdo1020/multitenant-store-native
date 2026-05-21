import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';

export function useOwnerRouteGuard() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isReady = !isLoading;

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (userRole === 'superadmin') {
      router.replace('/(superadmin)/dashboard');
    }
  }, [isAuthenticated, isReady, router, userRole]);

  return isReady && isAuthenticated && userRole !== 'superadmin';
}
