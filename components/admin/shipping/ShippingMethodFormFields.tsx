import { ScrollView } from 'react-native';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ShippingLocationFields } from '@/components/admin/shipping/ShippingLocationFields';
import { ShippingMethodBasicsFields } from '@/components/admin/shipping/ShippingMethodBasicsFields';
import { ShippingMethodTypePicker } from '@/components/admin/shipping/ShippingMethodTypePicker';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

interface ShippingMethodFormFieldsProps {
  control: Control<ShippingMethodFormData>;
  errors: FieldErrors<ShippingMethodFormData>;
  loading: boolean;
}

export function ShippingMethodFormFields({
  control,
  errors,
  loading,
}: ShippingMethodFormFieldsProps) {
  return (
    <ScrollView
      className="max-h-[640px]"
      contentContainerClassName="gap-5"
      keyboardShouldPersistTaps="handled"
    >
      <ShippingMethodBasicsFields control={control} errors={errors} loading={loading} />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <ShippingMethodTypePicker
            value={field.value}
            disabled={loading}
            error={errors.type?.message}
            onChange={field.onChange}
          />
        )}
      />
      <ShippingLocationFields control={control} errors={errors} loading={loading} />
    </ScrollView>
  );
}
