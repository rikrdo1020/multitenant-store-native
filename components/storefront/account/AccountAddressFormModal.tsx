import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerAddressSchema, type CustomerAddressFormData } from '@/lib/validators';
import { AccountAddressContactFields } from './AccountAddressContactFields';
import { AccountAddressLocationFields } from './AccountAddressLocationFields';
import { AccountDefaultAddressField } from './AccountDefaultAddressField';
import { AccountFormModal } from './AccountFormModal';
import type { CustomerAddress } from '@/types';

interface AccountAddressFormModalProps {
  visible: boolean;
  address?: CustomerAddress;
  submitError: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerAddressFormData) => Promise<void>;
}

export function AccountAddressFormModal({
  visible,
  address,
  submitError,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountAddressFormModalProps) {
  const form = useForm<CustomerAddressFormData>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: getAddressDefaults(address),
  });

  useEffect(() => {
    if (visible) form.reset(getAddressDefaults(address));
  }, [address, form, visible]);

  return (
    <AccountFormModal
      visible={visible}
      title={address ? 'Editar direccion' : 'Nueva direccion'}
      description="Esta direccion podra reutilizarse en el checkout."
      submitLabel={address ? 'Guardar cambios' : 'Guardar direccion'}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <AccountAddressContactFields control={form.control} isSubmitting={isSubmitting} />
      <AccountAddressLocationFields control={form.control} isSubmitting={isSubmitting} />
      <AccountDefaultAddressField control={form.control} disabled={isSubmitting} />
    </AccountFormModal>
  );
}

function getAddressDefaults(address?: CustomerAddress): CustomerAddressFormData {
  return {
    name: address?.name ?? '',
    address: address?.address ?? '',
    city: address?.city ?? '',
    department: address?.department ?? '',
    phone: address?.phone ?? '',
    isDefault: address?.isDefault ?? false,
  };
}
