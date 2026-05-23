import { useLocalSearchParams } from 'expo-router';
import { OrderConfirmationScreenContent } from '@/components/storefront/OrderConfirmationScreenContent';

export default function ConfirmationScreen() {
  const { tenantSlug, orderId, viewToken } = useLocalSearchParams<{
    tenantSlug: string;
    orderId: string;
    viewToken?: string;
  }>();

  return (
    <OrderConfirmationScreenContent
      tenantSlug={tenantSlug}
      orderId={orderId}
      viewToken={viewToken}
    />
  );
}
