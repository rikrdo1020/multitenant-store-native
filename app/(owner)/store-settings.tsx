import { Controller } from 'react-hook-form';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useStoreSettingsForm } from '@/hooks/use-store-settings-form';

const CURRENCY_OPTIONS = [
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Guaraní (PYG)', value: 'PYG' },
  { label: 'Peso colombiano (COP)', value: 'COP' },
  { label: 'Peso mexicano (MXN)', value: 'MXN' },
  { label: 'Sol peruano (PEN)', value: 'PEN' },
  { label: 'Peso argentino (ARS)', value: 'ARS' },
];

export default function StoreSettingsScreen() {
  const router = useRouter();
  const { form, isLoading, isPending, onSubmit } = useStoreSettingsForm();
  const { control, formState: { errors } } = form;

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ArrowLeft size={22} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="body" className="font-semibold">Configuración de tienda</Text>
      </View>

      <ScrollView
        contentContainerClassName="px-6 py-6 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Moneda */}
        <View className="gap-1">
          <Text variant="body" className="font-semibold text-foreground">Moneda y región</Text>
          <Text variant="small" className="text-muted-foreground">
            Afecta cómo se muestran los precios en tu tienda
          </Text>
        </View>

        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Moneda"
              value={value}
              options={CURRENCY_OPTIONS}
              onValueChange={onChange}
              error={errors.currency?.message}
            />
          )}
        />

        {/* Impuestos */}
        <View className="mt-2 gap-1">
          <Text variant="body" className="font-semibold text-foreground">Impuestos</Text>
          <Text variant="small" className="text-muted-foreground">
            Se aplica sobre el subtotal de cada orden
          </Text>
        </View>

        <Controller
          control={control}
          name="taxRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Tasa de impuesto (%)"
              placeholder="0"
              keyboardType="decimal-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={String(value)}
              error={errors.taxRate?.message}
            />
          )}
        />

        {/* Stock bajo */}
        <View className="mt-2 gap-1">
          <Text variant="body" className="font-semibold text-foreground">Inventario</Text>
        </View>

        <Controller
          control={control}
          name="lowStockThreshold"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Alerta de stock bajo (unidades)"
              placeholder="5"
              keyboardType="number-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={String(value)}
              error={errors.lowStockThreshold?.message}
            />
          )}
        />

        <Button onPress={onSubmit} disabled={isPending} className="mt-2">
          {isPending ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
