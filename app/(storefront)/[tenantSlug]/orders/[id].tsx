import { useLocalSearchParams } from 'expo-router';
import { OrderDetailScreenContent } from '@/components/storefront/OrderDetailScreenContent';

export default function OrderDetailScreen() {
  const { tenantSlug, id } = useLocalSearchParams<{ tenantSlug: string; id: string }>();

  return <OrderDetailScreenContent tenantSlug={tenantSlug} orderId={id} />;
}
