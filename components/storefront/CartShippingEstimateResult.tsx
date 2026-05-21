import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import type { CartShippingEstimatorViewModel } from '@/hooks/use-cart-shipping-estimator';

interface CartShippingEstimateResultProps {
  estimator: CartShippingEstimatorViewModel;
  currency?: string;
}

export function CartShippingEstimateResult({
  estimator,
  currency,
}: CartShippingEstimateResultProps) {
  const needsLocation = (estimator.selectedMethod?.logistics?.length ?? 0) > 0;
  const isIncomplete = estimator.selectedMethod && !estimator.selectedLocation && needsLocation;

  return (
    <>
      {estimator.selectedMethod && estimator.shippingCost !== undefined && (
        <View className="flex-row items-center justify-between gap-3 rounded-md bg-secondary px-3 py-3">
          <Text variant="small" className="font-medium">
            {estimator.isCalculating ? 'Calculando envio' : 'Envio estimado'}
          </Text>
          <Text className="font-semibold">
            {formatPrice(estimator.shippingCost, currency)}
          </Text>
        </View>
      )}

      {isIncomplete && (
        <View className="flex-row items-start gap-2 rounded-md bg-secondary px-3 py-2">
          <AlertCircle size={16} color="#dc2626" />
          <Text variant="small" className="min-w-0 flex-1 text-destructive">
            Selecciona una zona o punto para ver el costo completo.
          </Text>
        </View>
      )}
    </>
  );
}
