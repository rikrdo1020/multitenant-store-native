import { Controller, type UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { OnboardingProductFormData } from '@/lib/validators';

interface OnboardingProductFieldsProps {
  form: UseFormReturn<OnboardingProductFormData>;
}

export function OnboardingProductFields({ form }: OnboardingProductFieldsProps) {
  const { control, formState: { errors } } = form;

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre del producto" placeholder="Ej: Camiseta basica blanca" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Descripcion (opcional)" placeholder="Breve descripcion del producto" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} multiline numberOfLines={3} error={errors.description?.message} />
        )}
      />
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Precio" placeholder="0.00" keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} value={value !== undefined ? String(value) : ''} error={errors.price?.message} />
        )}
      />
      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Stock inicial (opcional)" placeholder="0" keyboardType="number-pad" onChangeText={onChange} onBlur={onBlur} value={value !== undefined ? String(value) : ''} error={errors.stock?.message} />
        )}
      />
    </>
  );
}
