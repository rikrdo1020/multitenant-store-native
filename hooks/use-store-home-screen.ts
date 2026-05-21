import { useRouter } from 'expo-router';
import { useTenant } from '@/hooks/api/use-tenant';
import { canOpenTenantAdminPanel } from '@/lib/admin-navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useStoreHomeScreen(tenantSlug?: string) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeTenant = useTenantStore((state) => state.tenant);
  const { data: tenant, isLoading } = useTenant(tenantSlug ?? '');

  const goToProducts = () => {
    if (tenantSlug) router.push(`/(storefront)/${tenantSlug}/products` as never);
  };

  return {
    tenant,
    isLoading,
    canOpenAdminPanel: canOpenTenantAdminPanel(user, activeTenant, tenantSlug),
    goToAdminPanel: () => router.push('/(admin)/dashboard' as never),
    goToProducts,
  };
}

export type StoreHomeScreenViewModel = ReturnType<typeof useStoreHomeScreen>;
