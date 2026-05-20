import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerProfileSchema, type CustomerProfileFormData } from '@/lib/validators';
import { AccountFormModal } from './AccountFormModal';
import { AccountProfileFields } from './AccountProfileFields';
import type { CustomerProfile } from '@/types';

interface AccountProfileFormModalProps {
  visible: boolean;
  profile?: CustomerProfile;
  fallbackName: string;
  fallbackPhone: string;
  fallbackEmail: string;
  submitError: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerProfileFormData) => Promise<void>;
}

export function AccountProfileFormModal({
  visible,
  profile,
  fallbackName,
  fallbackPhone,
  fallbackEmail,
  submitError,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountProfileFormModalProps) {
  const form = useForm<CustomerProfileFormData>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: getProfileDefaults(profile, fallbackName, fallbackPhone),
  });

  useEffect(() => {
    if (visible) form.reset(getProfileDefaults(profile, fallbackName, fallbackPhone));
  }, [fallbackName, fallbackPhone, form, profile, visible]);

  return (
    <AccountFormModal
      visible={visible}
      title="Editar perfil"
      description="El correo se mantiene vinculado a tu cuenta de acceso."
      submitLabel="Guardar perfil"
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <AccountProfileFields
        control={form.control}
        email={profile?.email ?? fallbackEmail}
        isSubmitting={isSubmitting}
      />
    </AccountFormModal>
  );
}

function getProfileDefaults(
  profile: CustomerProfile | undefined,
  fallbackName: string,
  fallbackPhone: string,
): CustomerProfileFormData {
  return {
    name: profile?.name ?? fallbackName,
    phone: profile?.phone ?? fallbackPhone,
    notes: profile?.notes ?? '',
  };
}
