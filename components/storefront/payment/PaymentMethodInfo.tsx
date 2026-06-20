import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { PaymentProviderType } from '@/types';

export function PaymentMethodInfo({ method }: { method: PaymentProviderType }) {
  if (method === 'yappy') {
    return (
      <InfoCard
        title="Como funciona Yappy?"
        body="Al confirmar, ingresaras tu numero Yappy y recibiras una notificacion en tu app para aprobar el pago."
      />
    );
  }

  if (method === 'cash') {
    return (
      <InfoCard
        title="Pago en efectivo"
        body="Prepara el monto exacto al momento de la entrega. El pedido quedara registrado y el cobrador confirmara el pago."
      />
    );
  }

  return null;
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <View className="rounded-lg border border-border bg-secondary p-4">
      <Text variant="small" className="font-semibold">{title}</Text>
      <Text variant="xs" className="mt-1 leading-5 text-muted-foreground">{body}</Text>
    </View>
  );
}
