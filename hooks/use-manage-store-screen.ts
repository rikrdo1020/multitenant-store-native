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
    goToStoreConfig: () => router.push('/(owner)/store-config'),
    goToPaymentSettings: () => router.push('/(owner)/payment-settings'),
    goToStorefront: () => {
      if (manageStore.tenant?.slug) {
        router.push(`/(storefront)/${manageStore.tenant.slug}` as never);
      }
    },
  };
}

export type ManageStoreScreenViewModel = ReturnType<typeof useManageStoreScreen>;
