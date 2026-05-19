import type { KeyboardTypeOptions } from 'react-native';
import { Controller, type Control, type FieldErrors, type FieldPath } from 'react-hook-form';
import { CheckoutTextField } from '@/components/storefront/CheckoutTextField';
import type { CheckoutFormData } from '@/lib/validators';

interface CheckoutControlledTextFieldProps {
  control: Control<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  name: FieldPath<CheckoutFormData>;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

export function CheckoutControlledTextField({
  control,
  errors,
  name,
  label,
  placeholder,
  keyboardType,
}: CheckoutControlledTextFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <CheckoutTextField
          label={label}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          error={errors[name]?.message}
          onChangeText={onChange}
        />
      )}
    />
  );
}
