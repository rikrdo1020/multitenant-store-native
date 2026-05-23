import { Text } from '@/components/ui/Text';

interface OrderConfirmationDescriptionProps {
  orderId: string;
  message?: string;
  success?: boolean;
  pending?: boolean;
}

export function OrderConfirmationDescription({
  orderId,
  message,
  success,
  pending,
}: OrderConfirmationDescriptionProps) {
  if (success) {
    return (
      <>
        Tu pedido <OrderIdText orderId={orderId} /> fue procesado exitosamente.
      </>
    );
  }

  if (pending) {
    return (
      <>
        Te enviamos una solicitud de pago en tu app de Yappy.{'\n'}Tu pedido es{' '}
        <OrderIdText orderId={orderId} />
      </>
    );
  }

  return (
    <>
      El pedido <OrderIdText orderId={orderId} /> no pudo ser confirmado.{'\n'}
      {message}
    </>
  );
}

function OrderIdText({ orderId }: { orderId: string }) {
  return (
    <Text variant="small" className="font-semibold text-foreground">
      {orderId}
    </Text>
  );
}
