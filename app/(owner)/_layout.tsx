import { Stack } from 'expo-router';
import { useOwnerRouteGuard } from '@/hooks/use-owner-route-guard';

export default function OwnerLayout() {
  const shouldRender = useOwnerRouteGuard();

  if (!shouldRender) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-store" options={{ title: 'Crear Tienda' }} />
      <Stack.Screen name="onboarding-product" options={{ title: 'Agregar Producto' }} />
      <Stack.Screen name="onboarding-shipping" options={{ title: 'Métodos de Envío' }} />
      <Stack.Screen name="manage-store" options={{ title: 'Gestionar Tienda' }} />
      <Stack.Screen name="store-settings" options={{ title: 'Configuración de Tienda' }} />
    </Stack>
  );
}
