import { Stack } from 'expo-router';

export default function StorefrontLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[tenantSlug]" />
    </Stack>
  );
}
