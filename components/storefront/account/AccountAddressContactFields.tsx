import { AccountControlledInput } from './AccountControlledInput';
import type { CustomerAddressFormData } from '@/lib/validators';
import type { Control } from 'react-hook-form';

interface AccountAddressContactFieldsProps {
  control: Control<CustomerAddressFormData>;
  isSubmitting: boolean;
}

export function AccountAddressContactFields({
  control,
  isSubmitting,
}: AccountAddressContactFieldsProps) {
  return (
    <>
      <AccountControlledInput
        control={control}
        name="name"
        label="Nombre de quien recibe"
        placeholder="Nombre y apellido"
        editable={!isSubmitting}
      />
      <AccountControlledInput
        control={control}
        name="phone"
        label="Telefono"
        placeholder="6000-0000"
        keyboardType="phone-pad"
        editable={!isSubmitting}
      />
      <AccountControlledInput
        control={control}
        name="address"
        label="Direccion"
        placeholder="Calle, edificio, casa o local"
        editable={!isSubmitting}
      />
    </>
  );
}
