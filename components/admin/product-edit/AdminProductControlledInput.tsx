import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { AdminProductEditViewModel, ProductFormValues } from '@/hooks/use-admin-product-edit-screen';

type ProductFormKey = Extract<keyof ProductFormValues, string>;

interface AdminProductControlledInputProps {
  product: AdminProductEditViewModel;
  name: ProductFormKey;
  label: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  sanitize?: (text: string) => string;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  mutedWhenDisabled?: boolean;
}

export function AdminProductControlledInput({
  product,
  name,
  label,
  editable = true,
  multiline,
  numberOfLines,
  sanitize,
  keyboardType,
  mutedWhenDisabled,
}: AdminProductControlledInputProps) {
  const error = product.errors[name]?.message;

  return (
    <Controller
      control={product.control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label={label}
          value={value?.toString() ?? ''}
          onChangeText={(text) => onChange(sanitize ? sanitize(text) : text)}
          onBlur={onBlur}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          error={error}
          className={mutedWhenDisabled && !editable ? 'bg-muted text-muted-foreground' : undefined}
        />
      )}
    />
  );
}
