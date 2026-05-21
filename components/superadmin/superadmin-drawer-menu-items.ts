import { Building2, LayoutDashboard, Users } from 'lucide-react-native';
import type { DrawerMenuItem } from '@/components/admin/drawer-menu-types';

export const superadminDrawerMenuItems = [
  { label: 'Dashboard', href: '/(superadmin)/dashboard', icon: LayoutDashboard },
  { label: 'Tenants', href: '/(superadmin)/tenants', icon: Building2 },
  { label: 'Usuarios', href: '/(superadmin)/users', icon: Users },
] as const satisfies readonly DrawerMenuItem[];
