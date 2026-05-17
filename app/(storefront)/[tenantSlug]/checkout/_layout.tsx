import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Envío' }} />
      <Stack.Screen name="payment" options={{ title: 'Pago' }} />
      <Stack.Screen name="confirmation" options={{ title: 'Confirmación', gestureEnabled: false }} />
    </Stack>
  );
}
