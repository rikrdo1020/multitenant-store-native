import { Controller } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useOnboardingShipping } from '@/hooks/use-onboarding-shipping';

const SHIPPING_TYPES = [
  { value: 'delivery_zone', label: 'Entrega por zona', description: 'Zonas de cobertura con precio base.' },
  { value: 'pickup_point', label: 'Retiro en punto', description: 'El cliente elige dónde recoger.' },
  { value: 'third_party', label: 'Courier externo', description: 'Envío por proveedor externo.' },
] as const;

export default function OnboardingShippingScreen() {
  const { form, isPending, onSubmit, skip } = useOnboardingShipping();
  const { control, watch, formState: { errors } } = form;
  const selectedType = watch('type');

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerClassName="px-6 py-8 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OnboardingProgress currentStep={3} totalSteps={3} />

        <View className="gap-1">
          <Text variant="h1">Configura el envío</Text>
          <Text variant="small" className="text-muted-foreground">
            Define cómo entregas tus pedidos. Puedes agregar más métodos después.
          </Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre del método"
              placeholder="Ej: Envío a domicilio"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <View className="gap-2">
          <Text variant="small" className="font-medium text-foreground">Tipo de envío</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange } }) => (
              <View className="gap-2">
                {SHIPPING_TYPES.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => onChange(option.value)}
                    className={`rounded-lg border p-4 ${
                      selectedType === option.value
                        ? 'border-foreground bg-muted'
                        : 'border-border bg-background'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${selectedType === option.value ? 'text-foreground' : 'text-foreground'}`}>
                      {option.label}
                    </Text>
                    <Text variant="xs" className="text-muted-foreground mt-0.5">
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.type && (
            <Text variant="xs" className="text-destructive">{errors.type.message}</Text>
          )}
        </View>

        <Controller
          control={control}
          name="basePrice"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Precio base"
              placeholder="0.00"
              keyboardType="decimal-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined ? String(value) : ''}
              error={errors.basePrice?.message}
            />
          )}
        />

        <View className="gap-3 pt-2">
          <Button onPress={onSubmit} loading={isPending} className="rounded-sm">
            Guardar y finalizar
          </Button>
          <Button variant="ghost" onPress={skip} disabled={isPending} className="rounded-sm">
            <Text className="text-muted-foreground text-sm">Saltar por ahora</Text>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
