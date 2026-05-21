import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

interface ShippingLocationRowProps {
  control: Control<ShippingMethodFormData>;
  errors: FieldErrors<ShippingMethodFormData>;
  index: number;
  loading: boolean;
  onRemove: () => void;
}

export function ShippingLocationRow({
  control,
  errors,
  index,
  loading,
  onRemove,
}: ShippingLocationRowProps) {
  const locationErrors = errors.locations?.[index];

  return (
    <View className="gap-2 rounded-md border border-border p-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="font-semibold text-foreground">Zona {index + 1}</Text>
        <Button size="sm" variant="ghost" disabled={loading} onPress={onRemove}>
          <Trash2 size={16} className="text-destructive" />
        </Button>
      </View>
      <Controller
        control={control}
        name={`locations.${index}.label`}
        render={({ field }) => (
          <Input label="Nombre visible" value={field.value} editable={!loading} onChangeText={field.onChange} error={locationErrors?.label?.message} />
        )}
      />
      <Controller
        control={control}
        name={`locations.${index}.key`}
        render={({ field }) => (
          <Input label="Clave" value={field.value} editable={!loading} autoCapitalize="none" onChangeText={field.onChange} error={locationErrors?.key?.message} />
        )}
      />
      <Controller
        control={control}
        name={`locations.${index}.extraPrice`}
        render={({ field }) => (
          <Input label="Recargo" value={field.value?.toString() ?? ''} editable={!loading} keyboardType="decimal-pad" onChangeText={field.onChange} error={locationErrors?.extraPrice?.message} />
        )}
      />
    </View>
  );
}
