import { useLocalSearchParams } from 'expo-router';
import { CheckoutScreenContent } from '@/components/storefront/CheckoutScreenContent';

export default function CheckoutShippingScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();

  return <CheckoutScreenContent tenantSlug={tenantSlug} />;
}
