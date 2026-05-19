import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-store" options={{ title: 'Crear Tienda' }} />
      <Stack.Screen name="manage-store" options={{ title: 'Gestionar Tienda' }} />
      <Stack.Screen name="store-settings" options={{ title: 'Configuración de Tienda' }} />
    </Stack>
  );
}
