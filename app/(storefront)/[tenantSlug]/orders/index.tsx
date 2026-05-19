import { useLocalSearchParams } from 'expo-router';
import { OrderHistoryScreenContent } from '@/components/storefront/OrderHistoryScreenContent';

export default function OrderHistoryScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();

  return <OrderHistoryScreenContent tenantSlug={tenantSlug} />;
}
