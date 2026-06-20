import { Switch, View } from 'react-native';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { BannerFormValues } from './banner-form-schema';

interface BannerFormFieldsProps {
  control: Control<BannerFormValues>;
  errors: FieldErrors<BannerFormValues>;
}

export function BannerFormFields({ control, errors }: BannerFormFieldsProps) {
  return (
    <>
      <ControlledInput control={control} errors={errors} name="title" label="Titulo" />
      <ControlledInput control={control} errors={errors} name="subtitle" label="Subtitulo" />
      <ControlledInput control={control} errors={errors} name="imageUrl" label="URL de imagen" />
      <ControlledInput control={control} errors={errors} name="ctaText" label="Texto del boton" />
      <ControlledInput control={control} errors={errors} name="ctaUrl" label="URL del boton" />
      <ControlledInput control={control} errors={errors} name="order" label="Orden" keyboardType="number-pad" />
      <Controller
        control={control}
        name="active"
        render={({ field: { value, onChange } }) => (
          <View className="mb-3 flex-row items-center justify-between rounded-md border border-border px-3 py-3">
            <View>
              <Text variant="small" className="font-semibold text-foreground">Activo</Text>
              <Text variant="xs">Visible en la home de la tienda.</Text>
            </View>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />
    </>
  );
}

function ControlledInput({
  control,
  errors,
  name,
  label,
  keyboardType,
}: BannerFormFieldsProps & {
  name: keyof BannerFormValues;
  label: string;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onBlur, onChange } }) => (
        <Input
          label={label}
          value={value?.toString() ?? ''}
          onBlur={onBlur}
          onChangeText={onChange}
          keyboardType={keyboardType}
          error={errors[name]?.message}
        />
      )}
    />
  );
}
