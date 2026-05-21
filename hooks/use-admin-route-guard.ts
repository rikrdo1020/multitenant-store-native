import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';

export function useAdminRouteGuard() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isReady = !isLoading;
  const canEnterAdmin = userRole === 'admin' || userRole === 'manager' || userRole === 'superadmin';

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!canEnterAdmin) {
      router.replace('/(auth)/login');
    }
  }, [canEnterAdmin, isAuthenticated, isReady, router]);

  return isReady && isAuthenticated && canEnterAdmin;
}
