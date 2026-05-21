import { useLocalSearchParams } from 'expo-router';
import { StoreHomeScreenContent } from '@/components/storefront/StoreHomeScreenContent';
import { firstRouteParam } from '@/lib/route-params';

export default function StoreHomeScreen() {
  const { tenantSlug: rawTenantSlug } = useLocalSearchParams<{ tenantSlug?: string | string[] }>();
  const tenantSlug = firstRouteParam(rawTenantSlug);

  return <StoreHomeScreenContent tenantSlug={tenantSlug} />;
}
