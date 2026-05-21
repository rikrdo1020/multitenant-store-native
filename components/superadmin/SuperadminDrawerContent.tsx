import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AdminDrawerFooter } from '@/components/admin/AdminDrawerFooter';
import { AdminDrawerHeader } from '@/components/admin/AdminDrawerHeader';
import { AdminDrawerMenu } from '@/components/admin/AdminDrawerMenu';
import { AdminDrawerTenantCard } from '@/components/admin/AdminDrawerTenantCard';
import { useSuperadminDrawerContent } from '@/hooks/use-superadmin-drawer-content';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

export function SuperadminDrawerContent(props: DrawerContentComponentProps) {
  const drawer = useSuperadminDrawerContent(() => props.navigation.closeDrawer());

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      <AdminDrawerHeader
        title="Superadmin"
        onClose={() => props.navigation.closeDrawer()}
      />
      <AdminDrawerTenantCard drawer={drawer} />
      <AdminDrawerMenu
        pathname={drawer.pathname}
        onNavigate={drawer.navigateTo}
        sections={drawer.sections}
      />
      <AdminDrawerFooter drawer={drawer} />
    </DrawerContentScrollView>
  );
}
