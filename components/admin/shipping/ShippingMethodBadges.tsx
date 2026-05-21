import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import type { ShippingMethod } from '@/types';

export function ShippingMethodBadges({ method }: { method: ShippingMethod }) {
  const locations = method.logistics ?? [];
  const preview = locations.slice(0, 3);
  const remaining = locations.length - preview.length;

  return (
    <View className="flex-row flex-wrap gap-2">
      <Badge>{method.isActive === false ? 'Inactivo' : 'Activo'}</Badge>
      <Badge>{method.requiresDetails ? 'Solicita datos de entrega' : 'Sin datos extra'}</Badge>
      {locations.length === 0 ? (
        <Badge>Sin zonas</Badge>
      ) : (
        preview.map((location) => (
          <Badge key={location.documentId}>
            {location.label}
            {location.extraPrice ? ` +${formatPrice(location.extraPrice)}` : ''}
          </Badge>
        ))
      )}
      {remaining > 0 && <Badge>+{remaining} mas</Badge>}
    </View>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <View className="rounded-full bg-secondary px-2.5 py-1">
      <Text variant="xs" className="font-medium text-foreground">
        {children}
      </Text>
    </View>
  );
}
