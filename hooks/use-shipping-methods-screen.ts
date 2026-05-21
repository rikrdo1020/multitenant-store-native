import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  useAdminShippingMethods,
  useCreateShippingMethod,
  useDeleteShippingMethod,
  useUpdateShippingMethod,
} from '@/hooks/api/use-shipping-methods';
import { toShippingMethodPayload, type ShippingMethodFormData } from '@/lib/shipping-method-form';
import { showToast } from '@/lib/toast';
import { getShippingErrorMessage } from '@/services/shipping';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ShippingMethod } from '@/types';

type FormResult = Promise<string | null>;

export function useShippingMethodsScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const { user } = useAuthStore();
  const [formVisible, setFormVisible] = useState(false);
  const [methodForEdit, setMethodForEdit] = useState<ShippingMethod | null>(null);
  const [methodForRemoval, setMethodForRemoval] = useState<ShippingMethod | null>(null);
  const canManageShipping = user?.role === 'admin' || user?.role === 'superadmin';

  const methodsQuery = useAdminShippingMethods(undefined, canManageShipping);
  const createMethod = useCreateShippingMethod();
  const updateMethod = useUpdateShippingMethod();
  const deleteMethod = useDeleteShippingMethod();

  const openCreate = () => {
    setMethodForEdit(null);
    setFormVisible(true);
  };

  const openEdit = (method: ShippingMethod) => {
    setMethodForEdit(method);
    setFormVisible(true);
  };

  const closeForm = () => {
    if (createMethod.isPending || updateMethod.isPending) return;
    setFormVisible(false);
    setMethodForEdit(null);
  };

  const submitForm = async (values: ShippingMethodFormData): FormResult => {
    try {
      if (methodForEdit) {
        await updateMethod.mutateAsync({
          methodId: methodForEdit.documentId,
          data: toShippingMethodPayload(values),
        });
        showToast('Metodo actualizado', 'success', methodForEdit.name);
      } else {
        const method = await createMethod.mutateAsync(toShippingMethodPayload(values));
        showToast('Metodo creado', 'success', method.name);
      }

      setFormVisible(false);
      setMethodForEdit(null);
      return null;
    } catch (error) {
      return getShippingErrorMessage(error, 'No pudimos guardar el metodo de envio.');
    }
  };

  const confirmRemove = async () => {
    if (!methodForRemoval) return;

    try {
      await deleteMethod.mutateAsync(methodForRemoval.documentId);
      showToast('Metodo eliminado', 'success', methodForRemoval.name);
      setMethodForRemoval(null);
    } catch (error) {
      showToast(
        'No pudimos eliminar el metodo',
        'destructive',
        getShippingErrorMessage(error, 'Intenta de nuevo.'),
      );
    }
  };

  return {
    tenant,
    user,
    canManageShipping,
    methods: methodsQuery.data ?? [],
    methodsLoading: methodsQuery.isLoading,
    methodsError: Boolean(methodsQuery.error),
    methodsRefreshing: methodsQuery.isFetching,
    formVisible,
    methodForEdit,
    methodForRemoval,
    isSaving: createMethod.isPending || updateMethod.isPending,
    isRemoving: deleteMethod.isPending,
    goToCreateStore: () => router.push('/(owner)/create-store'),
    refreshMethods: () => void methodsQuery.refetch(),
    openCreate,
    openEdit,
    closeForm,
    openRemoveDialog: setMethodForRemoval,
    closeRemoveDialog: () => setMethodForRemoval(null),
    submitForm,
    confirmRemove,
  };
}

export type ShippingMethodsScreenViewModel = ReturnType<typeof useShippingMethodsScreen>;
