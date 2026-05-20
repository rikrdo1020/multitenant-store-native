import { useRouter } from 'expo-router';
import { useManageStore } from '@/hooks/use-manage-store';

export function useManageStoreScreen() {
  const router = useRouter();
  const manageStore = useManageStore();

  return {
    ...manageStore,
    goBack: () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(admin)/settings');
      }
    },
    goToStoreSettings: () => router.push('/(owner)/store-settings'),
  };
}
