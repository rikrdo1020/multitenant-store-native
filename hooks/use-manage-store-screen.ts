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
    goToStorefront: () => {
      if (manageStore.tenant?.slug) {
        router.push(`/(storefront)/${manageStore.tenant.slug}` as never);
      }
    },
  };
}

export type ManageStoreScreenViewModel = ReturnType<typeof useManageStoreScreen>;
