import Toast from 'react-native-toast-message';
import {
  useCatalogProductTypes,
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType,
} from '@/hooks/api/use-catalog-product-types';
import { SimpleNameTab } from './SimpleNameTab';
import type { ApiError } from '@/types';

export function ProductTypesTab() {
  const { data: productTypes = [], isLoading, isRefetching, refetch, error } = useCatalogProductTypes();
  const createProductType = useCreateProductType();
  const updateProductType = useUpdateProductType();
  const deleteProductType = useDeleteProductType();

  return (
    <SimpleNameTab
      items={productTypes}
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      onRefetch={refetch}
      isCreating={createProductType.isPending}
      isUpdating={updateProductType.isPending}
      isDeleting={deleteProductType.isPending}
      countLabel="tipos"
      formPlaceholder="Ej: Bebida"
      emptyLabel="No hay tipos de producto aún."
      deleteTitle="Eliminar tipo de producto"
      deleteDescription={(name) => `¿Eliminar el tipo "${name}"? Esta acción no se puede deshacer.`}
      onCreateSubmit={(name, onDone) => {
        createProductType.mutate({ name }, { onSuccess: onDone });
      }}
      onUpdateSubmit={(id, name, onDone) => {
        updateProductType.mutate({ id, payload: { name } }, { onSuccess: onDone });
      }}
      onDelete={(id, onDone) => {
        deleteProductType.mutate(id, {
          onSuccess: onDone,
          onError: (err) => {
            onDone();
            const msg = (err as unknown as ApiError).message;
            Toast.show({
              type: 'error',
              text1: 'No se puede eliminar',
              text2: typeof msg === 'string' ? msg : 'Este tipo está siendo usado en uno o más combos.',
            });
          },
        });
      }}
    />
  );
}
