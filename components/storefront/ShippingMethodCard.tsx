import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import {
  getShippingBasePrice,
  getShippingLocationPrice,
} from '@/lib/shipping';
import { cn, formatPrice } from '@/lib/utils';
import type { ShippingMethod } from '@/types';

interface ShippingMethodCardProps {
  method: ShippingMethod;
  currency?: string;
  selected: boolean;
  selectedLocationId: string | null;
  onSelect: (method: ShippingMethod) => void;
  onSelectLocation: (locationId: string) => void;
}

export function ShippingMethodCard({
  method,
  currency,
  selected,
  selectedLocationId,
  onSelect,
  onSelectLocation,
}: ShippingMethodCardProps) {
  const logistics = method.logistics ?? [];
  const basePrice = getShippingBasePrice(method);
  const priceLabel = logistics.length > 0
    ? `Desde ${formatPrice(basePrice, currency)}`
    : formatPrice(basePrice, currency);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`Metodo de envio ${method.name}`}
      accessibilityState={{ selected, checked: selected }}
      onPress={() => onSelect(method)}
      className={cn(
        'gap-3 rounded-lg border p-4',
        selected ? 'border-foreground bg-secondary' : 'border-border bg-background',
      )}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-semibold">{method.name}</Text>
          {method.disclaimer && (
            <Text variant="xs" className="leading-4">
              {method.disclaimer}
            </Text>
          )}
        </View>
        <Text className="font-semibold">{priceLabel}</Text>
      </View>

      {selected && logistics.length > 0 && (
        <View className="gap-2">
          <Text variant="xs" className="font-semibold uppercase">
            Zona o punto
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {logistics.map((location) => {
              const active = location.documentId === selectedLocationId;
              const locationPrice = getShippingLocationPrice(location);
              return (
                <Pressable
                  key={location.documentId}
                  accessibilityRole="button"
                  accessibilityLabel={`Zona o punto ${location.label}`}
                  accessibilityState={{ selected: active }}
                  onPress={() => onSelectLocation(location.documentId)}
                  className={cn(
                    'rounded-md border px-3 py-2',
                    active ? 'border-foreground bg-foreground' : 'border-border bg-background',
                  )}
                >
                  <Text
                    variant="small"
                    className={active ? 'font-semibold text-background' : 'font-medium text-foreground'}
                  >
                    {location.label}
                    {locationPrice > 0 ? ` +${formatPrice(locationPrice, currency)}` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </Pressable>
  );
}
