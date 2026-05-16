import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CartSummary } from '@/components/storefront/CartSummary';
import { CheckoutItemSummary } from '@/components/storefront/CheckoutItemSummary';
import { generateItemKey } from '@/lib/utils';
import type { CartItem, Order, PricingResult, ShippingMethod } from '@/types';

interface CheckoutSummaryColumnProps {
  items: CartItem[];
  pricing: PricingResult;
  currency?: string;
  selectedMethod?: ShippingMethod;
  shippingCost: number;
  createdOrder: Order | null;
  isSubmitting: boolean;
  isShippingLoading: boolean;
  hasShippingMethods: boolean;
  submitError: string | null;
  onSubmit: () => void;
}

export function CheckoutSummaryColumn({
  items,
  pricing,
  currency,
  selectedMethod,
  shippingCost,
  createdOrder,
  isSubmitting,
  isShippingLoading,
  hasShippingMethods,
  submitError,
  onSubmit,
}: CheckoutSummaryColumnProps) {
  return (
    <>
      <View className="gap-4 rounded-lg border border-border bg-background p-4">
        <Text variant="h3">Productos</Text>
        <View className="gap-3">
          {items.map((item) => (
            <CheckoutItemSummary
              key={generateItemKey(item.documentId, item.selectedOptions)}
              item={item}
              currency={currency}
            />
          ))}
        </View>
      </View>

      <CartSummary
        pricing={pricing}
        currency={currency}
        shippingCost={selectedMethod ? shippingCost : undefined}
        shippingLabel="Selecciona envio"
        actionLabel={createdOrder ? 'Orden creada' : 'Crear orden'}
        actionLoading={isSubmitting}
        actionDisabled={!!createdOrder || isSubmitting || isShippingLoading || !hasShippingMethods}
        actionError={submitError}
        actionSuccess={
          createdOrder
            ? {
                title: `Orden creada: ${createdOrder.orderId}`,
                description: 'Queda pendiente de pago para el siguiente paso del flujo.',
              }
            : null
        }
        onAction={onSubmit}
      />

      <View className="rounded-md bg-secondary px-3 py-3">
        <Text variant="xs" className="leading-5">
          El pago se confirma en el siguiente paso del flujo. No vaciamos el carrito hasta que el pago quede confirmado.
        </Text>
      </View>
    </>
  );
}
