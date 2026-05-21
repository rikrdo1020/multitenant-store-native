import { useFieldArray, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { ShippingLocationRow } from '@/components/admin/shipping/ShippingLocationRow';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

interface ShippingLocationFieldsProps {
  control: Control<ShippingMethodFormData>;
  errors: FieldErrors<ShippingMethodFormData>;
  loading: boolean;
}

export function ShippingLocationFields({
  control,
  errors,
  loading,
}: ShippingLocationFieldsProps) {
  const locations = useFieldArray({ control, name: 'locations' });

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="font-semibold text-foreground">Zonas o puntos</Text>
          <Text variant="small" className="text-muted-foreground">
            Agrega recargos por zona o puntos de retiro.
          </Text>
        </View>
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onPress={() => locations.append({ key: '', label: '', extraPrice: 0 })}
        >
          <View className="flex-row items-center gap-1">
            <Plus size={14} className="text-foreground" />
            <Text className="text-sm font-semibold text-foreground">Agregar</Text>
          </View>
        </Button>
      </View>

      {locations.fields.length === 0 ? (
        <View className="rounded-md bg-secondary p-3">
          <Text variant="small">Sin zonas configuradas. El precio sera solo el base.</Text>
        </View>
      ) : (
        <View className="gap-3">
          {locations.fields.map((field, index) => (
            <ShippingLocationRow
              key={field.id}
              control={control}
              errors={errors}
              index={index}
              loading={loading}
              onRemove={() => locations.remove(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
