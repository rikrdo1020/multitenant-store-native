import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CheckoutTextField } from '@/components/storefront/CheckoutTextField';
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
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Nombre"
                value={value}
                placeholder="Nombre y apellido"
                error={errors.name?.message}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Correo"
                value={value}
                placeholder="cliente@correo.com"
                error={errors.email?.message}
                keyboardType="email-address"
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View className="min-w-0 flex-1 gap-3">
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Telefono"
                value={value}
                placeholder="6000-0000"
                error={errors.phone?.message}
                keyboardType="phone-pad"
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <CheckoutTextField
                label="Nota opcional"
                value={value}
                placeholder="Indicaciones para la tienda"
                error={errors.notes?.message}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
