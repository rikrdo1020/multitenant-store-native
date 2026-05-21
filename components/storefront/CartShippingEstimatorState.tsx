import { ActivityIndicator, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface CartShippingEstimatorStateProps {
  type: 'loading' | 'error' | 'empty';
  onRetry: () => void;
}

export function CartShippingEstimatorState({
  type,
  onRetry,
}: CartShippingEstimatorStateProps) {
  if (type === 'loading') {
    return (
      <View className="flex-row items-center gap-2 rounded-md bg-secondary px-3 py-3">
        <ActivityIndicator size="small" color="#737373" />
        <Text variant="small">Cargando metodos...</Text>
      </View>
    );
  }

  if (type === 'error') {
    return (
      <View className="gap-3 rounded-md border border-destructive p-3">
        <Text className="font-semibold text-destructive">
          No pudimos cargar los envios.
        </Text>
        <Button variant="outline" size="sm" onPress={onRetry}>
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <View className="rounded-md bg-secondary px-3 py-3">
      <Text variant="small">Esta tienda aun no tiene envios configurados.</Text>
    </View>
  );
}
