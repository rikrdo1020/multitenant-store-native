import { useLocalSearchParams } from 'expo-router';
import { PaymentScreenContent } from '@/components/storefront/payment/PaymentScreenContent';

export default function PaymentRoute() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();
  return <PaymentScreenContent tenantSlug={tenantSlug} />;
}
