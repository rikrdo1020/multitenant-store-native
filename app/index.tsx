import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { tenant } = useTenantStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (!tenant && user?.role !== 'superadmin') {
      router.replace('/(owner)/create-store');
      return;
    }

    if (tenant) {
      router.replace(`/(storefront)/${tenant.slug}`);
      return;
    }

    // Superadmin fallback
    router.replace('/(admin)/dashboard');
  }, [isLoading, isAuthenticated, tenant, user, router]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" className="text-primary" />
    </View>
  );
}
