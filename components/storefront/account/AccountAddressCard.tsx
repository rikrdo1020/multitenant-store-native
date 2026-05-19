import { View } from 'react-native';
import { MapPin, Pencil, Star, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { CustomerAddress } from '@/types';

interface AccountAddressCardProps {
  address: CustomerAddress;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export function AccountAddressCard({
  address,
  disabled,
  onEdit,
  onDelete,
  onSetDefault,
}: AccountAddressCardProps) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
          <MapPin size={18} color="#171717" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-semibold">{address.name}</Text>
            {address.isDefault && (
              <View className="rounded-full bg-primary px-2 py-0.5">
                <Text variant="xs" className="font-semibold text-primary-foreground">
                  Principal
                </Text>
              </View>
            )}
          </View>
          <Text variant="small">{address.address}</Text>
          <Text variant="small">
            {address.city}, {address.department}
          </Text>
          <Text variant="small">{address.phone}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {!address.isDefault && (
          <Button variant="outline" size="sm" disabled={disabled} onPress={onSetDefault}>
            <View className="flex-row items-center gap-2">
              <Star size={14} color="#171717" />
              <Text className="font-semibold">Principal</Text>
            </View>
          </Button>
        )}
        <Button variant="ghost" size="sm" disabled={disabled} onPress={onEdit}>
          <View className="flex-row items-center gap-2">
            <Pencil size={14} color="#171717" />
            <Text className="font-semibold">Editar</Text>
          </View>
        </Button>
        <Button variant="ghost" size="sm" disabled={disabled} onPress={onDelete}>
          <View className="flex-row items-center gap-2">
            <Trash2 size={14} color="#dc2626" />
            <Text className="font-semibold text-destructive">Eliminar</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
