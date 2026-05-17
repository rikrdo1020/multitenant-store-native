import { View, TouchableOpacity, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Settings,
  Building2,
  Grid3X3,
  Type,
  X,
  LogOut,
  Store,
} from 'lucide-react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const menuItems = [
  { label: 'Dashboard', href: '/(admin)/dashboard', icon: LayoutDashboard },
  { label: 'Productos', href: '/(admin)/products', icon: Package },
  { label: 'Pedidos', href: '/(admin)/orders', icon: ShoppingCart },
  { label: 'Categorias', href: '/(admin)/categories', icon: Grid3X3 },
  { label: 'Marcas', href: '/(admin)/brands', icon: Building2 },
  { label: 'Tags', href: '/(admin)/tags', icon: Tags },
  { label: 'Tipos de Producto', href: '/(admin)/product-types', icon: Type },
  { label: 'Envios', href: '/(admin)/shipping-methods', icon: Truck },
  { label: 'Combos', href: '/(admin)/combos', icon: Grid3X3 },
  { label: 'Clientes', href: '/(admin)/customers', icon: Users },
  { label: 'Miembros', href: '/(admin)/members', icon: Users },
  { label: 'Configuracion', href: '/(admin)/settings', icon: Settings },
];

export function AdminDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const { tenant, setTenant } = useTenantStore();

  const handleLogout = () => {
    clearAuth();
    setTenant(null);
    props.navigation.closeDrawer();
    router.replace('/(auth)/login');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <Text variant="h3" className="font-bold">
          Admin
        </Text>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X size={24} className="text-foreground" />
        </TouchableOpacity>
      </View>

      {/* Tenant info */}
      <View className="mx-3 mt-3 rounded-lg bg-muted px-3 py-3">
        <View className="flex-row items-center gap-2">
          <Store size={16} className="text-muted-foreground" />
          <Text variant="small" className="font-medium text-foreground">
            {tenant?.name ?? 'Sin tienda'}
          </Text>
        </View>
        {tenant?.slug && (
          <Text variant="xs" className="ml-6 text-muted-foreground">
            {tenant.slug}
          </Text>
        )}
      </View>

      {/* Menu */}
      <ScrollView className="flex-1 px-2 py-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => {
                router.push(item.href as any);
                props.navigation.closeDrawer();
              }}
              className={cn(
                'flex-row items-center rounded-lg px-3 py-3',
                isActive ? 'bg-primary/10' : 'bg-transparent'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <Text
                variant="body"
                className={cn(
                  'ml-3 font-medium',
                  isActive ? 'text-primary' : 'text-foreground'
                )}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer: user + logout */}
      <View className="border-t border-border px-4 py-3">
        <Text variant="small" className="mb-2 text-muted-foreground">
          {user?.name ?? 'Usuario'}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center gap-2 rounded-md bg-destructive/5 px-3 py-2"
        >
          <LogOut size={18} className="text-destructive" />
          <Text variant="body" className="font-medium text-destructive">
            Cerrar sesion
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
