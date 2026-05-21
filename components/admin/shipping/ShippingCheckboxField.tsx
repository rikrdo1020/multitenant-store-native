import { Controller, type Control } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

interface ShippingCheckboxFieldProps {
  control: Control<ShippingMethodFormData>;
  name: 'requiresDetails' | 'isActive';
  title: string;
  description: string;
  loading: boolean;
}

export function ShippingCheckboxField({
  control,
  name,
  title,
  description,
  loading,
}: ShippingCheckboxFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Pressable
          onPress={() => onChange(!value)}
          disabled={loading}
          className="flex-row items-start gap-3 rounded-md border border-border p-3"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: Boolean(value) }}
        >
          <View className={cn('mt-0.5 h-5 w-5 items-center justify-center rounded border', value ? 'border-primary bg-primary' : 'border-border')}>
            {value && <Check size={14} color="#ffffff" />}
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="font-semibold text-foreground">{title}</Text>
            <Text variant="small" className="leading-5 text-muted-foreground">
              {description}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}
