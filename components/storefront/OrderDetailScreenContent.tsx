import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { OrderDetailGuardState } from '@/components/storefront/order-detail/OrderDetailGuardState';
import { OrderDetailLoadedContent } from '@/components/storefront/order-detail/OrderDetailLoadedContent';
import { useOrderDetailScreen } from '@/hooks/use-order-detail-screen';

interface OrderDetailScreenContentProps {
  tenantSlug?: string;
  orderId?: string;
}

export function OrderDetailScreenContent({ tenantSlug, orderId }: OrderDetailScreenContentProps) {
  const detail = useOrderDetailScreen({ tenantSlug, orderId });

  if (!detail.isAuthenticated) {
    return (
      <OrderDetailGuardState
        headerSubtitle="Acceso requerido"
        title="Inicia sesion para continuar"
        message="Necesitamos tu cuenta para confirmar que esta orden te pertenece."
        actionLabel="Iniciar sesion"
        onBack={detail.goBack}
        onAction={detail.goToLogin}
      />
    );
  }

  if (detail.isLoading) {
    return <LoadingScreen message="Cargando detalle..." />;
  }

  if (detail.isError || !detail.order) {
    return (
      <OrderDetailGuardState
        headerSubtitle="No disponible"
        title="No encontramos esta orden"
        message="Puede que no exista o que no este asociada a tu cuenta."
        actionLabel="Reintentar"
        variant="outline"
        onBack={detail.goBack}
        onAction={detail.retryOrder}
      />
    );
  }

  return <OrderDetailLoadedContent detail={detail} />;
}
