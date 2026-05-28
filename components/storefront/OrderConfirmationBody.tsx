import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';
import { OrderConfirmationDescription } from '@/components/storefront/OrderConfirmationDescription';
import { OrderConfirmationState } from '@/components/storefront/OrderConfirmationState';
import type { OrderConfirmationViewModel } from '@/hooks/use-order-confirmation-screen';

interface OrderConfirmationBodyProps {
  confirmation: OrderConfirmationViewModel;
}

export function OrderConfirmationBody({
  confirmation,
}: OrderConfirmationBodyProps) {
  const order = confirmation.order;

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
        description={<OrderConfirmationDescription orderId={order.orderId} success />}
        actions={[{ label: 'Seguir comprando', onPress: confirmation.goToProducts }]}
      />
    );
  }

  if (confirmation.isFailed) {
    return (
      <OrderConfirmationState
        icon={XCircle}
        iconColor="#dc2626"
        title="Pago no completado"
        description={
          <OrderConfirmationDescription
            orderId={order.orderId}
            message={confirmation.failureMessage}
          />
        }
        actions={[
          { label: 'Intentar de nuevo', onPress: confirmation.goBackToPayment },
          {
            label: 'Volver a la tienda',
            variant: 'outline',
            onPress: confirmation.goToProducts,
          },
        ]}
      />
    );
  }

  if (confirmation.isCashPayment) {
    return (
      <OrderConfirmationState
        icon={CheckCircle2}
        iconColor="#16a34a"
        title="Pedido recibido"
        description={<OrderConfirmationDescription orderId={order.orderId} cash />}
        actions={[{ label: 'Volver a la tienda', onPress: confirmation.goToProducts }]}
      />
    );
  }

  return (
    <OrderConfirmationState
      icon={Clock}
      iconColor="#2563eb"
      title="Solicitud enviada"
      description={<OrderConfirmationDescription orderId={order.orderId} pending />}
      actions={[{ label: 'Volver a la tienda', onPress: confirmation.goToProducts }]}
    />
  );
}
