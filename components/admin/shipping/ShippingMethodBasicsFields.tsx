import { type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';
import { ShippingCheckboxField } from '@/components/admin/shipping/ShippingCheckboxField';
import { ShippingControlledInput } from '@/components/admin/shipping/ShippingControlledInput';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

interface ShippingMethodBasicsFieldsProps {
  control: Control<ShippingMethodFormData>;
  errors: FieldErrors<ShippingMethodFormData>;
  loading: boolean;
}

export function ShippingMethodBasicsFields({
  control,
  errors,
  loading,
}: ShippingMethodBasicsFieldsProps) {
  return (
    <View className="gap-1">
      <ShippingControlledInput control={control} errors={errors} name="name" label="Nombre" disabled={loading} />
      <ShippingControlledInput control={control} errors={errors} name="basePrice" label="Precio base" disabled={loading} keyboardType="decimal-pad" />
      <ShippingControlledInput
        control={control}
        errors={errors}
        name="disclaimer"
        label="Descripcion"
        disabled={loading}
        multiline
        numberOfLines={3}
      />
      <ShippingCheckboxField
        control={control}
        name="requiresDetails"
        title="Requiere datos de entrega"
        description="Pide direccion o datos del receptor durante el checkout."
        loading={loading}
      />
      <ShippingCheckboxField
        control={control}
        name="isActive"
        title="Metodo activo"
        description="Los clientes solo veran este metodo cuando este activo."
        loading={loading}
      />
    </View>
  );
}
