import {
  Bell,
  Building2,
  Grid3X3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
} from 'lucide-react-native';
import type { DrawerMenuItem } from '@/components/admin/drawer-menu-types';

export const adminDrawerMenuItems = [
  { label: 'Dashboard', href: '/(admin)/dashboard', icon: LayoutDashboard },
  { label: 'Productos', href: '/(admin)/products', icon: Package },
  { label: 'Pedidos', href: '/(admin)/orders', icon: ShoppingCart },
  { label: 'Categorias', href: '/(admin)/categories', icon: Grid3X3 },
  { label: 'Marcas', href: '/(admin)/brands', icon: Building2 },
  { label: 'Tags', href: '/(admin)/tags', icon: Tags },
  { label: 'Envios', href: '/(admin)/shipping-methods', icon: Truck },
  { label: 'Combos', href: '/(admin)/combos', icon: Grid3X3 },
  { label: 'Clientes', href: '/(admin)/customers', icon: Users },
  { label: 'Miembros', href: '/(admin)/members', icon: Users },
  { label: 'Notificaciones', href: '/(admin)/notifications', icon: Bell },
  { label: 'Configuracion', href: '/(admin)/settings', icon: Settings },
] as const satisfies readonly DrawerMenuItem[];
