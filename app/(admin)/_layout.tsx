import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { AdminDrawerContent } from '@/components/admin/AdminDrawerContent';
import { useAuthStore } from '@/stores/use-auth-store';

export default function AdminLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (user?.role === 'superadmin') {
      router.replace('/(superadmin)/dashboard');
    }
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated || user?.role === 'superadmin') return null;

  return (
    <Drawer
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        swipeEnabled: true,
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Drawer.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="products" options={{ title: 'Productos' }} />
      <Drawer.Screen name="orders/index" options={{ title: 'Pedidos', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="orders/[id]" options={{ title: 'Detalle del Pedido', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="categories" options={{ title: 'Categorias' }} />
      <Drawer.Screen name="brands" options={{ title: 'Marcas' }} />
      <Drawer.Screen name="tags" options={{ title: 'Etiquetas' }} />
      <Drawer.Screen name="product-types" options={{ title: 'Combos', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="shipping-methods" options={{ title: 'Metodos de Envio' }} />
      <Drawer.Screen name="combos" options={{ title: 'Combos' }} />
      <Drawer.Screen name="customers/index" options={{ title: 'Clientes' }} />
      <Drawer.Screen name="customers/[id]" options={{ title: 'Detalle del Cliente', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="settings" options={{ title: 'Configuracion' }} />
      <Drawer.Screen name="members" options={{ title: 'Miembros' }} />
    </Drawer>
  );
}
