import { Store, User } from 'lucide-react-native';
import { adminDrawerMenuItems } from '@/components/admin/admin-drawer-menu-items';
import { superadminDrawerMenuItems } from '@/components/superadmin/superadmin-drawer-menu-items';
import type { DrawerMenuItem, DrawerMenuSection } from '@/components/admin/drawer-menu-types';

interface AppDrawerMenuSectionOptions {
  isSuperadmin: boolean;
  tenantName?: string | null;
  tenantSlug?: string | null;
}

export function getAppDrawerMenuSections({
  isSuperadmin,
  tenantName,
  tenantSlug,
}: AppDrawerMenuSectionOptions): DrawerMenuSection[] {
  const hasTenant = Boolean(tenantSlug);
  const tenantItems = getTenantDrawerItems(tenantSlug);

  if (!isSuperadmin) {
    return [
      {
        title: tenantName ? `Tienda: ${tenantName}` : undefined,
        items: tenantItems,
        disabled: !hasTenant,
        disabledMessage: 'Selecciona o crea una tienda para gestionarla.',
      },
    ];
  }

  return [
    { title: 'Global', items: superadminDrawerMenuItems },
    {
      title: tenantName ? `Tienda: ${tenantName}` : 'Tienda activa',
      items: tenantItems,
      disabled: !hasTenant,
      disabledMessage: 'Selecciona un tenant desde Tenants para gestionar su operacion.',
    },
  ];
}

function getTenantDrawerItems(tenantSlug?: string | null): readonly DrawerMenuItem[] {
  if (!tenantSlug) return adminDrawerMenuItems;

  return [
    { label: 'Ver tienda', href: `/(storefront)/${tenantSlug}`, icon: Store },
    { label: 'Cuenta', href: '/(admin)/account', icon: User },
    ...adminDrawerMenuItems,
  ];
}
