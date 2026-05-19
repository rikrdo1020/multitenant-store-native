import { useLocalSearchParams } from 'expo-router';
import { AccountScreenContent } from '@/components/storefront/AccountScreenContent';

export default function AccountScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();

  return <AccountScreenContent tenantSlug={tenantSlug} />;
}
