import { View } from 'react-native';
import { Truck } from 'lucide-react-native';
import { CartShippingEstimateResult } from '@/components/storefront/CartShippingEstimateResult';
import { CartShippingEstimatorState } from '@/components/storefront/CartShippingEstimatorState';
import { ShippingMethodCard } from '@/components/storefront/ShippingMethodCard';
import { Text } from '@/components/ui/Text';
import type { CartShippingEstimatorViewModel } from '@/hooks/use-cart-shipping-estimator';

interface CartShippingEstimatorProps {
  estimator: CartShippingEstimatorViewModel;
  currency?: string;
}

export function CartShippingEstimator({
  estimator,
  currency,
}: CartShippingEstimatorProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-start gap-2">
        <Truck size={18} color="#0a0a0a" />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Estimador de envio</Text>
          <Text variant="small">
            Puedes calcular el costo ahora y conservar la seleccion para checkout.
          </Text>
        </View>
      </View>

      {estimator.isLoading && <CartShippingEstimatorState type="loading" onRetry={estimator.retry} />}
      {estimator.isError && <CartShippingEstimatorState type="error" onRetry={estimator.retry} />}
      {!estimator.isLoading && !estimator.isError && estimator.methods.length === 0 && (
        <CartShippingEstimatorState type="empty" onRetry={estimator.retry} />
      )}
      {!estimator.isLoading && !estimator.isError && estimator.methods.length > 0 && (
        <View className="gap-3">
          {estimator.methods.map((method) => (
            <ShippingMethodCard
              key={method.documentId}
              method={method}
              currency={currency}
              selected={method.documentId === estimator.selectedMethodId}
              selectedLocationId={estimator.selectedLocationId}
              onSelect={estimator.selectMethod}
              onSelectLocation={estimator.selectLocation}
            />
          ))}
        </View>
      )}

      <CartShippingEstimateResult estimator={estimator} currency={currency} />
    </View>
  );
}
