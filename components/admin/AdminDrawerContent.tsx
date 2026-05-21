import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AdminDrawerFooter } from '@/components/admin/AdminDrawerFooter';
import { AdminDrawerHeader } from '@/components/admin/AdminDrawerHeader';
import { AdminDrawerMenu } from '@/components/admin/AdminDrawerMenu';
import { AdminDrawerTenantCard } from '@/components/admin/AdminDrawerTenantCard';
import { getAppDrawerMenuSections } from '@/components/admin/get-app-drawer-menu-sections';
import { useAdminDrawerContent } from '@/hooks/use-admin-drawer-content';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

export function AdminDrawerContent(props: DrawerContentComponentProps) {
  const drawer = useAdminDrawerContent(() => props.navigation.closeDrawer());
  const isSuperadmin = drawer.user?.role === 'superadmin';
  const sections = getAppDrawerMenuSections({
    isSuperadmin,
    tenantName: drawer.tenant?.name,
    tenantSlug: drawer.tenant?.slug,
  });

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      <AdminDrawerHeader
        title={isSuperadmin ? 'Superadmin' : 'Admin'}
        onClose={() => props.navigation.closeDrawer()}
      />
      <AdminDrawerTenantCard drawer={drawer} />
      <AdminDrawerMenu
        pathname={drawer.pathname}
        onNavigate={drawer.navigateTo}
        sections={sections}
      />
      <AdminDrawerFooter drawer={drawer} />
    </DrawerContentScrollView>
  );
}
