import { useLocalSearchParams } from 'expo-router';
import { OrderTrackingScreenContent } from '@/components/storefront/OrderTrackingScreenContent';
import { firstRouteParam } from '@/lib/route-params';

export default function PublicOrderTrackingRoute() {
  const params = useLocalSearchParams<{
    tenantSlug?: string | string[];
    orderId?: string | string[];
    token?: string | string[];
  }>();

  return (
    <OrderTrackingScreenContent
      tenantSlug={firstRouteParam(params.tenantSlug)}
      orderId={firstRouteParam(params.orderId)}
      viewToken={firstRouteParam(params.token)}
    />
  );
}
