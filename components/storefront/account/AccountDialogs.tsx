import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AccountAddressFormModal } from './AccountAddressFormModal';
import { AccountProfileFormModal } from './AccountProfileFormModal';
import type { AccountScreenViewModel } from '@/hooks/use-account-screen';

interface AccountDialogsProps {
  account: AccountScreenViewModel;
}

export function AccountDialogs({ account }: AccountDialogsProps) {
  return (
    <>
      <AccountProfileFormModal
        visible={account.profileModalVisible}
        profile={account.profile}
        fallbackName={account.user?.name ?? ''}
        fallbackPhone={account.user?.phone ?? ''}
        fallbackEmail={account.user?.email ?? ''}
        submitError={account.formError}
        isSubmitting={account.isProfileSubmitting}
        onClose={account.closeProfileModal}
        onSubmit={account.handleUpdateProfile}
      />

      <AccountAddressFormModal
        visible={!!account.addressModalMode}
        address={account.addressModalMode?.address}
        submitError={account.formError}
        isSubmitting={account.isAddressSubmitting}
        onClose={account.closeAddressModal}
        onSubmit={account.handleSaveAddress}
      />

      <ConfirmDialog
        visible={!!account.addressToDelete}
        title="Eliminar direccion"
        description={`Se eliminara "${account.addressToDelete?.address ?? 'esta direccion'}" de tus direcciones guardadas.`}
        confirmLabel="Eliminar"
        destructive
        loading={account.isDeletingAddress}
        onCancel={account.cancelDeleteAddress}
        onConfirm={account.handleDeleteAddress}
      />
    </>
  );
}
