import { Controller, type UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { OnboardingShippingFormData } from '@/lib/validators';

interface OnboardingShippingFieldsProps {
  form: UseFormReturn<OnboardingShippingFormData>;
}

export function OnboardingShippingFields({ form }: OnboardingShippingFieldsProps) {
  const { control, formState: { errors } } = form;

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre del metodo" placeholder="Ej: Envio a domicilio" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="basePrice"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Precio base" placeholder="0.00" keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} value={value !== undefined ? String(value) : ''} error={errors.basePrice?.message} />
        )}
      />
    </>
  );
}
