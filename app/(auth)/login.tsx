import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useAuthStore } from '@/stores/use-auth-store';

export default function LoginRoute() {
  const router = useRouter();
  const rootNavState = useRootNavigationState();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!rootNavState?.key) return;
    if (!isAuthenticated) return;
    if (user?.role === 'customer') {
      router.replace('/marketplace');
    } else {
      router.replace('/(admin)/dashboard');
    }
  }, [rootNavState?.key, isAuthenticated]);

  if (isAuthenticated) return null;

  return <LoginScreen />;
}
