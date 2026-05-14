import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitle: 'Checkout' }}>
      <Stack.Screen name="index" options={{ title: 'Envío' }} />
      <Stack.Screen name="payment" options={{ title: 'Pago' }} />
    </Stack>
  );
}
