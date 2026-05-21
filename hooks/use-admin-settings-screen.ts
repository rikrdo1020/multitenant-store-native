import { useRouter } from 'expo-router';
import { logout } from '@/services/auth';
import { useMyStores } from '@/hooks/api/use-my-stores';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useAdminSettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();
  const { data: myStores } = useMyStores();
  const ownedStores = myStores ?? [];
  const canEditStoreProfile = Boolean(
    tenant && ownedStores.some((store) => store.documentId === tenant.documentId),
  );
  const canEditStoreSettings = Boolean(
    tenant && (user?.role === 'admin' || user?.role === 'superadmin'),
  );

  const handleLogout = async () => {
    await logout();
    setTenant(null);
    router.replace('/(auth)/login');
  };

  const switchStore = (documentId: string) => {
    const target = ownedStores.find((store) => store.documentId === documentId);
    if (target) setTenant(target);
  };

  const goToStorefront = () => {
    if (tenant?.slug) router.push(`/(storefront)/${tenant.slug}` as never);
  };

  const goToAccount = () => {
    if (tenant?.slug) router.push('/(admin)/account' as never);
  };

  return {
    user,
    tenant,
    stores: ownedStores,
    canEditStoreProfile,
    canEditStoreSettings,
    canOpenStorefront: Boolean(tenant?.slug),
    goToAccount,
    goToCreateStore: () => router.push('/(owner)/create-store'),
    goToManageStore: () => router.push('/(owner)/manage-store'),
    goToStoreSettings: () => router.push('/(owner)/store-settings'),
    goToStorefront,
    handleLogout,
    switchStore,
  };
}

export type AdminSettingsViewModel = ReturnType<typeof useAdminSettingsScreen>;
