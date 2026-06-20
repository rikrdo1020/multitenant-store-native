import { Controller, type UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { YappySettingsFormData } from '@/lib/validators';

interface YappySettingsFieldsProps {
  form: UseFormReturn<YappySettingsFormData>;
}

export function YappySettingsFields({ form }: YappySettingsFieldsProps) {
  const { control, formState: { errors } } = form;

  return (
    <>
      <Controller
        control={control}
        name="yappyPhone"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Numero Yappy" placeholder="6000-0000" keyboardType="phone-pad" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.yappyPhone?.message} />
        )}
      />
      <Controller
        control={control}
        name="yappyName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre en Yappy" placeholder="Nombre del negocio" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.yappyName?.message} />
        )}
      />
    </>
  );
}
