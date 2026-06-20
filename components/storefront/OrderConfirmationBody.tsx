import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { OrderConfirmationDescription } from '@/components/storefront/OrderConfirmationDescription';
import { OrderConfirmationFailure } from '@/components/storefront/OrderConfirmationFailure';
import { OrderConfirmationState } from '@/components/storefront/OrderConfirmationState';
import type { OrderConfirmationViewModel } from '@/hooks/use-order-confirmation-screen';

interface OrderConfirmationBodyProps {
  confirmation: OrderConfirmationViewModel;
}

export function OrderConfirmationBody({
  confirmation,
}: OrderConfirmationBodyProps) {
  const order = confirmation.order;
  const confirmedTotal = order?.pricingBreakdown?.total ?? order?.total;

  if (confirmation.isUnavailable || !order) {
    return (
      <OrderConfirmationState
        icon={XCircle}
        iconColor="#dc2626"
        title="No encontramos tu pedido"
        description="El enlace de confirmacion no tiene el token necesario para ver esta orden."
        actions={[{ label: 'Volver a la tienda', onPress: confirmation.goToProducts }]}
      />
    );
  }

  if (confirmation.isSuccess) {
    return (
      <OrderConfirmationState
        icon={CheckCircle2}
        iconColor="#16a34a"
        title="Pedido confirmado"
        description={<OrderConfirmationDescription orderId={order.orderId} total={confirmedTotal} success />}
        actions={[{ label: 'Seguir comprando', onPress: confirmation.goToProducts }]}
      />
    );
  }

  if (confirmation.isFailed) {
    return (
      <OrderConfirmationFailure
        confirmation={confirmation}
        orderId={order.orderId}
        total={confirmedTotal}
      />
    );
  }

  if (confirmation.isCashPayment) {
    return (
      <OrderConfirmationState
        icon={CheckCircle2}
        iconColor="#16a34a"
        title="Pedido recibido"
        description={<OrderConfirmationDescription orderId={order.orderId} total={confirmedTotal} cash />}
        actions={[{ label: 'Volver a la tienda', onPress: confirmation.goToProducts }]}
      />
    );
  }

  return (
    <OrderConfirmationState
      icon={Clock}
      iconColor="#2563eb"
      title="Solicitud enviada"
      description={<OrderConfirmationDescription orderId={order.orderId} total={confirmedTotal} pending />}
      actions={[{ label: 'Volver a la tienda', onPress: confirmation.goToProducts }]}
    />
  );
}
