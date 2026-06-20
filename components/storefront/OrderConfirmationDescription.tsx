import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';

interface OrderConfirmationDescriptionProps {
  orderId: string;
  total?: number;
  message?: string;
  success?: boolean;
  pending?: boolean;
  cash?: boolean;
}

export function OrderConfirmationDescription({
  orderId,
  total,
  message,
  success,
  pending,
  cash,
}: OrderConfirmationDescriptionProps) {
  if (success) {
    return (
      <>
        Tu pedido <OrderIdText orderId={orderId} /> fue procesado exitosamente.
        <ConfirmedTotal total={total} />
      </>
    );
  }

  if (pending) {
    return (
      <>
        Te enviamos una solicitud de pago en tu app de Yappy.{'\n'}Tu pedido es{' '}
        <OrderIdText orderId={orderId} />
        <ConfirmedTotal total={total} />
      </>
    );
  }

  if (cash) {
    return (
      <>
        Tu pedido <OrderIdText orderId={orderId} /> fue registrado exitosamente.
        {'\n'}Nos estaremos poniendo en contacto contigo para coordinar el pago en efectivo.
        <ConfirmedTotal total={total} />
      </>
    );
  }

  return (
    <>
      El pedido <OrderIdText orderId={orderId} /> no pudo ser confirmado.{'\n'}
      {message}
      <ConfirmedTotal total={total} />
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

function ConfirmedTotal({ total }: { total?: number }) {
  if (typeof total !== 'number') return null;

  return (
    <>
      {'\n'}Total confirmado:{' '}
      <Text variant="small" className="font-semibold text-foreground">
        {formatPrice(total)}
      </Text>
    </>
  );
}
