import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: Platform.OS === 'web',
      networkMode: 'always',
      retry: 2,
    },
    mutations: {
      networkMode: 'always',
      retry: 1,
    },
  },
});
