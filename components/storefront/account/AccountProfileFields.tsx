import { Input } from '@/components/ui/Input';
import { AccountControlledInput } from './AccountControlledInput';
import type { CustomerProfileFormData } from '@/lib/validators';
import type { Control } from 'react-hook-form';

interface AccountProfileFieldsProps {
  control: Control<CustomerProfileFormData>;
  email: string;
  isSubmitting: boolean;
}

export function AccountProfileFields({
  control,
  email,
  isSubmitting,
}: AccountProfileFieldsProps) {
  return (
    <>
      <Input label="Correo" value={email} editable={false} />
      <AccountControlledInput control={control} name="name" label="Nombre" editable={!isSubmitting} />
      <AccountControlledInput
        control={control}
        name="phone"
        label="Telefono"
        keyboardType="phone-pad"
        editable={!isSubmitting}
      />
      <AccountControlledInput
        control={control}
        name="notes"
        label="Notas opcionales"
        multiline
        className="min-h-20"
        editable={!isSubmitting}
      />
    </>
  );
}
