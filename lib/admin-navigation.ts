import type { Tenant, User } from '@/types';

export function canOpenTenantAdminPanel(
  user: User | null | undefined,
  activeTenant: Tenant | null | undefined,
  tenantSlug: string | undefined,
): boolean {
  return Boolean(
    activeTenant?.slug
    && tenantSlug === activeTenant.slug
    && (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'superadmin'),
  );
}
