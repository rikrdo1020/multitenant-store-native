import type { Control, FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CheckoutControlledTextField } from '@/components/storefront/CheckoutControlledTextField';
import type { CheckoutFormData } from '@/lib/validators';

interface CheckoutCustomerFormProps {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isWide: boolean;
}

export function CheckoutCustomerForm({ control, errors, isWide }: CheckoutCustomerFormProps) {
  return (
    <View className="gap-4 rounded-lg border border-border bg-background p-4">
      <View className="gap-1">
        <Text variant="h3">Datos del cliente</Text>
        <Text variant="small">Usaremos esta informacion para preparar la entrega.</Text>
      </View>

      <View className={isWide ? 'flex-row gap-3' : 'gap-3'}>
        <View className="min-w-0 flex-1 gap-3">
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="name"
            label="Nombre"
            placeholder="Nombre y apellido"
          />
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="email"
            label="Correo"
            placeholder="cliente@correo.com"
            keyboardType="email-address"
          />
        </View>

        <View className="min-w-0 flex-1 gap-3">
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="phone"
            label="Telefono"
            placeholder="6000-0000"
            keyboardType="phone-pad"
          />
          <CheckoutControlledTextField
            control={control}
            errors={errors}
            name="notes"
            label="Nota opcional"
            placeholder="Indicaciones para la tienda"
          />
        </View>
      </View>
    </View>
  );
}
