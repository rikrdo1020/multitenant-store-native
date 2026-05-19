import { Pressable, View } from 'react-native';
import { Check, MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { CustomerAddress } from '@/types';

interface SavedAddressCardProps {
  address: CustomerAddress;
  isSelected: boolean;
  onSelect: () => void;
}

export function SavedAddressCard({ address, isSelected, onSelect }: SavedAddressCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onSelect}
      className={cn(
        'gap-2 rounded-md border border-border p-3 active:bg-muted',
        isSelected && 'border-primary bg-secondary',
      )}
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-muted">
          {isSelected ? <Check size={16} color="#171717" /> : <MapPin size={16} color="#171717" />}
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
    </Pressable>
  );
}
