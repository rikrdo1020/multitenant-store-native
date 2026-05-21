import { Pressable, View } from 'react-native';
import { Truck } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { SHIPPING_TYPE_OPTIONS, type ShippingMethodType } from '@/lib/shipping-method-form';
import { cn } from '@/lib/utils';

interface ShippingMethodTypePickerProps {
  value: ShippingMethodType;
  disabled: boolean;
  error?: string;
  onChange: (type: ShippingMethodType) => void;
}

export function ShippingMethodTypePicker({
  value,
  disabled,
  error,
  onChange,
}: ShippingMethodTypePickerProps) {
  return (
    <View className="gap-2">
      <Text variant="small" className="font-medium text-foreground">Tipo</Text>
      <View className="gap-2">
        {SHIPPING_TYPE_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              disabled={disabled}
              className={cn('rounded-md border p-3', selected ? 'border-primary bg-primary/10' : 'border-border bg-background')}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <View className="flex-row items-start gap-3">
                <Truck size={18} className={selected ? 'text-primary' : 'text-muted-foreground'} />
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="font-semibold text-foreground">{option.label}</Text>
                  <Text variant="small" className="leading-5">{option.description}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      {error && <Text variant="xs" className="text-destructive">{error}</Text>}
    </View>
  );
}
