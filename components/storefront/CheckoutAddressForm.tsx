import { type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { CheckoutControlledTextField } from '@/components/storefront/CheckoutControlledTextField';
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

      <CheckoutControlledTextField
        control={control}
        errors={errors}
        name="address"
        label="Direccion"
        placeholder="Calle, edificio, casa o local"
      />

      <View className={isWide ? 'flex-row gap-3' : 'gap-3'}>
        <View className="min-w-0 flex-1">
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="city"
            label="Ciudad"
            placeholder="Ciudad"
          />
        </View>

        <View className="min-w-0 flex-1">
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="department"
            label="Departamento"
            placeholder="Departamento o provincia"
          />
        </View>
      </View>

      <View className={isWide ? 'flex-row gap-3' : 'gap-3'}>
        <View className="min-w-0 flex-1">
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="reference"
            label="Referencia"
            placeholder="Punto de referencia"
          />
        </View>
      </View>
    </View>
  );
}
