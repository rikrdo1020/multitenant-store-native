import { useRouter } from 'expo-router';
import { useStoreSettingsForm } from '@/hooks/use-store-settings-form';
import { useTenantStore } from '@/stores/use-tenant-store';

export function useStoreConfigScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const settingsForm = useStoreSettingsForm();

  return {
    tenant,
    settingsForm,
    goBack: () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(admin)/settings');
      }
    },
    goToManageStore: () => router.push('/(owner)/manage-store'),
    goToPaymentSettings: () => router.push('/(owner)/payment-settings'),
  };
}
