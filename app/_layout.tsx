import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from '@/lib/query-client';
import { AppToast } from '@/components/ui/AppToast';
import '@/global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="marketplace" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(storefront)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(owner)" />
            <Stack.Screen name="(superadmin)" />
          </Stack>
          <AppToast />
          <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
