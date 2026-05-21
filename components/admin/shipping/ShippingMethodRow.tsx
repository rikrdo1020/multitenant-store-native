import { View } from 'react-native';
import { ShippingMethodActions } from '@/components/admin/shipping/ShippingMethodActions';
import { ShippingMethodBadges } from '@/components/admin/shipping/ShippingMethodBadges';
import { Text } from '@/components/ui/Text';
import { getShippingTypeLabel } from '@/lib/shipping-method-form';
import { formatPrice } from '@/lib/utils';
import type { ShippingMethod } from '@/types';

interface ShippingMethodRowProps {
  method: ShippingMethod;
  isWide: boolean;
  disabled: boolean;
  onEdit: (method: ShippingMethod) => void;
  onRemove: (method: ShippingMethod) => void;
}

export function ShippingMethodRow({
  method,
  isWide,
  disabled,
  onEdit,
  onRemove,
}: ShippingMethodRowProps) {
  const locations = method.logistics ?? [];
  const priceLabel = locations.length > 0
    ? `Desde ${formatPrice(method.basePrice ?? 0)}`
    : formatPrice(method.basePrice ?? 0);

  return (
    <View className={isWide ? 'flex-row items-center gap-4 p-4' : 'gap-4 p-4'}>
      <View className="min-w-0 flex-1 gap-2">
        <View className={isWide ? 'flex-row items-start justify-between gap-4' : 'gap-1'}>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="font-semibold text-foreground">{method.name}</Text>
            <Text variant="small" className="text-muted-foreground">
              {getShippingTypeLabel(method.type)}
            </Text>
          </View>
          <Text className="font-semibold text-foreground">{priceLabel}</Text>
        </View>
        {method.disclaimer && (
          <Text variant="small" className="leading-5 text-muted-foreground">
            {method.disclaimer}
          </Text>
        )}
        <ShippingMethodBadges method={method} />
      </View>
      <ShippingMethodActions
        disabled={disabled}
        onEdit={() => onEdit(method)}
        onRemove={() => onRemove(method)}
      />
    </View>
  );
}
