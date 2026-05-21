import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { ShippingMethodFormData } from '@/lib/shipping-method-form';

type ShippingFormKey = Extract<keyof ShippingMethodFormData, string>;

interface ShippingControlledInputProps {
  control: Control<ShippingMethodFormData>;
  errors: FieldErrors<ShippingMethodFormData>;
  name: ShippingFormKey;
  label: string;
  disabled: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'decimal-pad';
}

export function ShippingControlledInput({
  control,
  errors,
  name,
  label,
  disabled,
  multiline,
  numberOfLines,
  keyboardType,
}: ShippingControlledInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          value={value?.toString() ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          error={errors[name]?.message as string | undefined}
        />
      )}
    />
  );
}
