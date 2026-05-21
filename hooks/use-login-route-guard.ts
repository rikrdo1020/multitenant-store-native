import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';

export function useLoginRouteGuard() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (userRole === 'customer') {
      router.replace('/marketplace');
      return;
    }

    if (userRole === 'superadmin') {
      router.replace('/(superadmin)/dashboard');
      return;
    }

    router.replace('/(admin)/dashboard');
  }, [isAuthenticated, isLoading, router, userRole]);

  return !isLoading && !isAuthenticated;
}
