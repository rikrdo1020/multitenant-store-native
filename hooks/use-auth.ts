import { useAuthStore } from '@/stores/use-auth-store';
import { useRouter } from 'expo-router';

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    callback();
  };

  return { user, isAuthenticated, requireAuth };
}
