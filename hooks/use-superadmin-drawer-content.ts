import { usePathname, useRouter } from 'expo-router';
import { getAppDrawerMenuSections } from '@/components/admin/get-app-drawer-menu-sections';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useSuperadminDrawerContent(closeDrawer: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();
  const sections = getAppDrawerMenuSections({
    isSuperadmin: true,
    tenantName: tenant?.name,
    tenantSlug: tenant?.slug,
  });

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
    sections,
    handleLogout,
    navigateTo,
  };
}

export type SuperadminDrawerViewModel = ReturnType<typeof useSuperadminDrawerContent>;
