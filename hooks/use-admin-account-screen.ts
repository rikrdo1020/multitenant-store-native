import { useTenantStore } from '@/stores/use-tenant-store';

export function useAdminAccountScreen() {
  const tenantSlug = useTenantStore((state) => state.tenant?.slug);

  return { tenantSlug };
}

export type AdminAccountScreenViewModel = ReturnType<typeof useAdminAccountScreen>;
