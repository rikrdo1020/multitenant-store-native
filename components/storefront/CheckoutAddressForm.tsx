import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { CheckoutTextField } from '@/components/storefront/CheckoutTextField';
import type { CheckoutFormData } from '@/lib/validators';

interface CheckoutAddressFormProps {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isWide: boolean;
}

export function CheckoutAddressForm({ control, errors, isWide }: CheckoutAddressFormProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="flex-row items-start gap-2">
        <MapPin size={18} color="#0a0a0a" />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3">Direccion de envio</Text>
          <Text variant="small">El checkout conserva estos datos si vuelves al carrito.</Text>
        </View>
      </View>

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <CheckoutTextField
            label="Direccion"
            value={value}
            placeholder="Calle, edificio, casa o local"
            error={errors.address?.message}
            onChangeText={onChange}
          />
        )}
      />

      <View className={isWide ? 'flex-row gap-3' : 'gap-3'}>
        <View className="min-w-0 flex-1">
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Ciudad"
                value={value}
                placeholder="Ciudad"
                error={errors.city?.message}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View className="min-w-0 flex-1">
          <Controller
            control={control}
            name="reference"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Referencia"
                value={value}
                placeholder="Punto de referencia"
                error={errors.reference?.message}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
