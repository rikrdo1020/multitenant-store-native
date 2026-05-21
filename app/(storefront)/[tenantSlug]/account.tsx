import { useLocalSearchParams } from 'expo-router';
import { AccountScreenContent } from '@/components/storefront/AccountScreenContent';
import { firstRouteParam } from '@/lib/route-params';

export default function AccountScreen() {
  const { tenantSlug: rawTenantSlug } = useLocalSearchParams<{ tenantSlug?: string | string[] }>();
  const tenantSlug = firstRouteParam(rawTenantSlug);

  return <AccountScreenContent tenantSlug={tenantSlug} />;
}
