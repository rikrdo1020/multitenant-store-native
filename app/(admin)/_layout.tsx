import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitle: 'Panel de Administración' }}>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="products/index" options={{ title: 'Productos' }} />
      <Stack.Screen name="products/[id]" options={{ title: 'Editar Producto' }} />
      <Stack.Screen name="orders/index" options={{ title: 'Pedidos' }} />
      <Stack.Screen name="orders/[id]" options={{ title: 'Detalle del Pedido' }} />
      <Stack.Screen name="categories" options={{ title: 'Categorías' }} />
      <Stack.Screen name="brands" options={{ title: 'Marcas' }} />
      <Stack.Screen name="tags" options={{ title: 'Etiquetas' }} />
      <Stack.Screen name="product-types" options={{ title: 'Tipos de Producto' }} />
      <Stack.Screen name="shipping-methods" options={{ title: 'Métodos de Envío' }} />
      <Stack.Screen name="combos" options={{ title: 'Combos' }} />
      <Stack.Screen name="customers" options={{ title: 'Clientes' }} />
      <Stack.Screen name="settings" options={{ title: 'Configuración' }} />
      <Stack.Screen name="members" options={{ title: 'Miembros' }} />
    </Stack>
  );
}
