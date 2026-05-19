import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/use-auth-store';
import { AppToast } from '@/components/ui/AppToast';
import '@/global.css';

export default function RootLayout() {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    // Hydration complete
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [setLoading]);

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
          </Stack>
          <AppToast />
          <StatusBar style="auto" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
