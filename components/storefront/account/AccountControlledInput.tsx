import type { KeyboardTypeOptions } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

interface AccountControlledInputProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: FieldPath<TFormValues>;
  label: string;
  editable: boolean;
  className?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  placeholder?: string;
}

export function AccountControlledInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  editable,
  className,
  keyboardType,
  multiline,
  placeholder,
}: AccountControlledInputProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <Input
          label={label}
          value={typeof value === 'string' ? value : ''}
          placeholder={placeholder}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType={keyboardType}
          multiline={multiline}
          className={className}
          error={fieldState.error?.message}
          editable={editable}
        />
      )}
    />
  );
}
