import { usePathname, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useAdminDrawerContent(closeDrawer: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();

  const navigateTo = (href: string) => {
    router.push(href as never);
    closeDrawer();
  };

  const handleLogout = () => {
    clearAuth();
    setTenant(null);
    closeDrawer();
    router.replace('/(auth)/login');
  };

  return {
    user,
    tenant,
    pathname,
    handleLogout,
    navigateTo,
  };
}

export type AdminDrawerViewModel = ReturnType<typeof useAdminDrawerContent>;
