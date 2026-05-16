import { useLocalSearchParams } from 'expo-router';
import { CartScreenContent } from '@/components/storefront/CartScreenContent';

export default function CartScreen() {
  const { tenantSlug } = useLocalSearchParams<{ tenantSlug: string }>();

  return <CartScreenContent tenantSlug={tenantSlug} />;
}
