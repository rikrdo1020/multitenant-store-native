import { Pressable, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Star } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { CustomerAddressFormData } from '@/lib/validators';

interface AccountDefaultAddressFieldProps {
  control: Control<CustomerAddressFormData>;
  disabled: boolean;
}

export function AccountDefaultAddressField({
  control,
  disabled,
}: AccountDefaultAddressFieldProps) {
  return (
    <Controller
      control={control}
      name="isDefault"
      render={({ field: { onChange, value } }) => (
        <Pressable
          onPress={() => onChange(!value)}
          disabled={disabled}
          className="flex-row items-center gap-3 rounded-md border border-border p-3"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!value }}
        >
          <View
            className={cn(
              'h-5 w-5 items-center justify-center rounded border border-border',
              value && 'border-primary bg-primary',
            )}
          >
            {value && <Star size={12} color="#ffffff" />}
          </View>
          <Text className="font-medium">Usar como direccion principal</Text>
        </Pressable>
      )}
    />
  );
}
