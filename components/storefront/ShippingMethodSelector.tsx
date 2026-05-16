import { ActivityIndicator, View } from 'react-native';
import { AlertCircle, Truck } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ShippingMethodCard } from '@/components/storefront/ShippingMethodCard';
import type { ShippingMethod } from '@/types';

interface ShippingMethodSelectorProps {
  methods: ShippingMethod[];
  currency?: string;
  isLoading: boolean;
  isError: boolean;
  selectedMethodId: string | null;
  selectedLocationId: string | null;
  selectionError: string | null;
  onRetry: () => void;
  onSelectMethod: (method: ShippingMethod) => void;
  onSelectLocation: (locationId: string) => void;
}

export function ShippingMethodSelector({
  methods,
  currency,
  isLoading,
  isError,
  selectedMethodId,
  selectedLocationId,
  selectionError,
  onRetry,
  onSelectMethod,
  onSelectLocation,
}: ShippingMethodSelectorProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-start gap-2">
        <Truck size={18} color="#0a0a0a" />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Metodo de envio</Text>
          <Text variant="small">Selecciona una opcion para calcular el total final.</Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-row items-center gap-2 rounded-md bg-secondary px-3 py-3">
          <ActivityIndicator size="small" color="#737373" />
          <Text variant="small">Cargando metodos de envio...</Text>
        </View>
      ) : isError ? (
        <View className="gap-3 rounded-md border border-destructive p-3">
          <Text className="font-semibold text-destructive">
            No pudimos cargar los metodos de envio.
          </Text>
          <Button variant="outline" size="sm" onPress={onRetry}>
            Reintentar
          </Button>
        </View>
      ) : methods.length === 0 ? (
        <View className="rounded-md bg-secondary px-3 py-3">
          <Text variant="small">
            Esta tienda aun no tiene metodos de envio disponibles.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {methods.map((method) => (
            <ShippingMethodCard
              key={method.documentId}
              method={method}
              currency={currency}
              selected={method.documentId === selectedMethodId}
              selectedLocationId={selectedLocationId}
              onSelect={onSelectMethod}
              onSelectLocation={onSelectLocation}
            />
          ))}
        </View>
      )}

      {selectionError && (
        <View className="flex-row items-center gap-2 rounded-md bg-secondary px-3 py-2">
          <AlertCircle size={16} color="#dc2626" />
          <Text variant="small" className="text-destructive">
            {selectionError}
          </Text>
        </View>
      )}
    </View>
  );
}
