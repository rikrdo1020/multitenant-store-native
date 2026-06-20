import { Controller, type UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Text } from '@/components/ui/Text';
import { STORE_CURRENCY_OPTIONS } from './store-config-options';
import type { StoreSettingsFormData } from '@/lib/validators';

interface StoreOperationsCardProps {
  form: UseFormReturn<StoreSettingsFormData>;
  isPending: boolean;
  onSubmit: () => void;
}

export function StoreOperationsCard({ form, isPending, onSubmit }: StoreOperationsCardProps) {
  const { control, formState: { errors } } = form;

  return (
    <View className="gap-2">
      <Text variant="xs" className="px-1 font-semibold uppercase tracking-widest text-muted-foreground">Operaciones</Text>
      <View className="rounded-xl border border-border bg-card px-4 py-5 gap-4">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value } }) => (
            <Select label="Moneda" value={value} options={STORE_CURRENCY_OPTIONS} onValueChange={onChange} error={errors.currency?.message} />
          )}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller control={control} name="taxRate" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="IVA (%)" placeholder="0" keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} value={String(value)} error={errors.taxRate?.message} />
            )} />
          </View>
          <View className="flex-1">
            <Controller control={control} name="lowStockThreshold" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Stock bajo" placeholder="5" keyboardType="number-pad" onChangeText={onChange} onBlur={onBlur} value={String(value)} error={errors.lowStockThreshold?.message} />
            )} />
          </View>
        </View>
        <Button onPress={onSubmit} disabled={isPending} variant="outline">
          {isPending ? 'Guardando...' : 'Guardar operaciones'}
        </Button>
      </View>
    </View>
  );
}
