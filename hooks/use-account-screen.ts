import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useCreateCustomerAddress,
  useCustomerAddresses,
  useCustomerProfile,
  useDeleteCustomerAddress,
  useUpdateCustomerAddress,
  useUpdateCustomerProfile,
} from '@/hooks/api/use-customers';
import { canOpenTenantAdminPanel } from '@/lib/admin-navigation';
import type { CustomerAddressFormData, CustomerProfileFormData } from '@/lib/validators';
import { showToast } from '@/lib/toast';
import { logout } from '@/services/auth';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ApiError, CustomerAddress } from '@/types';

export function useAccountScreen(tenantSlug?: string) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeTenant = useTenantStore((state) => state.tenant);
  const profileQuery = useCustomerProfile(tenantSlug, isAuthenticated);
  const addressesQuery = useCustomerAddresses(tenantSlug, isAuthenticated);
  const updateProfile = useUpdateCustomerProfile(tenantSlug);
  const createAddress = useCreateCustomerAddress(tenantSlug);
  const updateAddress = useUpdateCustomerAddress(tenantSlug);
  const deleteAddress = useDeleteCustomerAddress(tenantSlug);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<{
    type: 'create' | 'edit';
    address?: CustomerAddress;
  } | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<CustomerAddress | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const addresses = addressesQuery.data ?? [];
  const profile = profileQuery.data;
  const layoutClassName = useMemo(
    () => (isWide ? 'flex-row items-start gap-5' : 'gap-5'),
    [isWide],
  );

  const goToOrders = () => {
    if (!tenantSlug) return;
    router.push(`/(storefront)/${tenantSlug}/orders` as never);
  };

  const goToAdminPanel = () => {
    router.push('/(admin)/dashboard' as never);
  };

  const goToLogin = () => {
    const returnTo = tenantSlug ? `/(storefront)/${tenantSlug}/account` : '/';
    router.push(`/(auth)/login?returnTo=${encodeURIComponent(returnTo)}` as never);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const retryProfile = () => {
    void profileQuery.refetch();
  };

  const retryAddresses = () => {
    void addressesQuery.refetch();
  };

  const openCreateAddress = () => {
    setFormError(null);
    setAddressModalMode({ type: 'create' });
  };

  const openEditAddress = (address: CustomerAddress) => {
    setFormError(null);
    setAddressModalMode({ type: 'edit', address });
  };

  const openEditProfile = () => {
    setFormError(null);
    setProfileModalVisible(true);
  };

  const handleUpdateProfile = async (values: CustomerProfileFormData) => {
    try {
      setFormError(null);
      await updateProfile.mutateAsync({
        name: values.name.trim(),
        phone: values.phone.trim(),
        ...(values.notes?.trim() ? { notes: values.notes.trim() } : { notes: '' }),
      });
      showToast('Perfil actualizado', 'success');
      setProfileModalVisible(false);
    } catch (error) {
      const message = getApiErrorMessage(error, 'No pudimos actualizar tu perfil.');
      setFormError(message);
      showToast('No pudimos guardar', 'destructive', message);
    }
  };

  const handleSaveAddress = async (values: CustomerAddressFormData) => {
    try {
      setFormError(null);
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        department: values.department.trim(),
        phone: values.phone.trim(),
        isDefault: values.isDefault,
      };

      if (addressModalMode?.type === 'edit' && addressModalMode.address) {
        await updateAddress.mutateAsync({
          id: addressModalMode.address.documentId,
          payload,
        });
        showToast('Direccion actualizada', 'success');
      } else {
        await createAddress.mutateAsync(payload);
        showToast('Direccion guardada', 'success');
      }

      setAddressModalMode(null);
    } catch (error) {
      const message = getApiErrorMessage(error, 'No pudimos guardar la direccion.');
      setFormError(message);
      showToast('No pudimos guardar', 'destructive', message);
    }
  };

  const handleSetDefaultAddress = async (address: CustomerAddress) => {
    if (address.isDefault) return;

    try {
      await updateAddress.mutateAsync({
        id: address.documentId,
        payload: { isDefault: true },
      });
      showToast('Direccion principal actualizada', 'success');
    } catch (error) {
      showToast(
        'No pudimos actualizar',
        'destructive',
        getApiErrorMessage(error, 'Intenta de nuevo.'),
      );
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress.mutateAsync(addressToDelete.documentId);
      showToast('Direccion eliminada', 'success');
      setAddressToDelete(null);
    } catch (error) {
      showToast(
        'No pudimos eliminar',
        'destructive',
        getApiErrorMessage(error, 'Intenta de nuevo.'),
      );
    }
  };

  return {
    addresses,
    addressModalMode,
    addressToDelete,
    areAddressesLoading: addressesQuery.isLoading,
    areAddressesErrored: addressesQuery.isError,
    formError,
    closeAddressModal: () => setAddressModalMode(null),
    closeProfileModal: () => setProfileModalVisible(false),
    cancelDeleteAddress: () => setAddressToDelete(null),
    canOpenAdminPanel: canOpenTenantAdminPanel(user, activeTenant, tenantSlug),
    goToLogin,
    goToAdminPanel,
    goToOrders,
    handleDeleteAddress,
    handleLogout,
    handleSaveAddress,
    handleSetDefaultAddress,
    handleUpdateProfile,
    isAddressMutating: createAddress.isPending || updateAddress.isPending || deleteAddress.isPending,
    isAddressSubmitting: createAddress.isPending || updateAddress.isPending,
    isAuthenticated,
    isDeletingAddress: deleteAddress.isPending,
    isProfileErrored: profileQuery.isError,
    isProfileLoading: profileQuery.isLoading,
    isProfileSubmitting: updateProfile.isPending,
    isWide,
    layoutClassName,
    openCreateAddress,
    openEditAddress,
    openEditProfile,
    profile,
    profileModalVisible,
    requestDeleteAddress: setAddressToDelete,
    retryAddresses,
    retryProfile,
    user,
  };
}

export type AccountScreenViewModel = ReturnType<typeof useAccountScreen>;

function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as Partial<ApiError>;
  return typeof apiError.message === 'string' ? apiError.message : fallback;
}
