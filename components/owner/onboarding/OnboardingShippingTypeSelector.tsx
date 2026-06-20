import { Controller, type UseFormReturn } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { OnboardingShippingFormData } from '@/lib/validators';

const SHIPPING_TYPES = [
  { value: 'delivery_zone', label: 'Entrega por zona', description: 'Zonas de cobertura con precio base.' },
  { value: 'pickup_point', label: 'Retiro en punto', description: 'El cliente elige donde recoger.' },
  { value: 'third_party', label: 'Courier externo', description: 'Envio por proveedor externo.' },
] as const;

export function OnboardingShippingTypeSelector({
  form,
}: {
  form: UseFormReturn<OnboardingShippingFormData>;
}) {
  const { control, watch, formState: { errors } } = form;
  const selectedType = watch('type');

  return (
    <View className="gap-2">
      <Text variant="small" className="font-medium text-foreground">Tipo de envio</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange } }) => (
          <View className="gap-2">
            {SHIPPING_TYPES.map((option) => (
              <TouchableOpacity key={option.value} onPress={() => onChange(option.value)} className={`rounded-lg border p-4 ${selectedType === option.value ? 'border-foreground bg-muted' : 'border-border bg-background'}`}>
                <Text className="text-sm font-semibold text-foreground">{option.label}</Text>
                <Text variant="xs" className="text-muted-foreground mt-0.5">{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.type ? <Text variant="xs" className="text-destructive">{errors.type.message}</Text> : null}
    </View>
  );
}
