import { useCallback, useState } from 'react';
import {
  useCatalogBrands,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from '@/hooks/api/use-catalog-brands';
import { useUploadImage } from '@/hooks/api/use-upload-image';
import type { Brand } from '@/types';

export interface BrandFormValues {
  name: string;
  logo?: string;
}

export function useBrandsTab() {
  const { data: brands = [], isLoading, isRefetching, refetch, error } = useCatalogBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const uploadImage = useUploadImage();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [toDelete, setToDelete] = useState<Brand | null>(null);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleStartCreate = useCallback(() => {
    setShowForm(true);
    setEditing(null);
  }, []);

  const handleStartEdit = useCallback((brand: Brand) => {
    setEditing(brand);
    setShowForm(false);
  }, []);

  const handleCreate = useCallback(
    (values: BrandFormValues) => {
      createBrand.mutate(values, { onSuccess: () => setShowForm(false) });
    },
    [createBrand],
  );

  const handleUpdate = useCallback(
    (values: BrandFormValues) => {
      if (!editing) return;
      updateBrand.mutate(
        { id: editing.documentId, payload: values },
        { onSuccess: () => setEditing(null) },
      );
    },
    [editing, updateBrand],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!toDelete) return;
    deleteBrand.mutate(toDelete.documentId, { onSuccess: () => setToDelete(null) });
  }, [deleteBrand, toDelete]);

  const handleUploadLogo = useCallback(
    (fileUri: string, onDone: (url: string) => void) => {
      uploadImage.mutate({ fileUri, folder: 'brands' }, {
        onSuccess: (data) => onDone(data.url),
      });
    },
    [uploadImage],
  );

  return {
    brands,
    isLoading,
    isRefetching,
    error,
    showForm,
    editing,
    toDelete,
    isCreating: createBrand.isPending,
    isUpdating: updateBrand.isPending,
    isDeleting: deleteBrand.isPending,
    isUploadingLogo: uploadImage.isPending,
    setShowForm,
    setEditing,
    setToDelete,
    handleRefresh,
    handleStartCreate,
    handleStartEdit,
    handleCreate,
    handleUpdate,
    handleConfirmDelete,
    handleUploadLogo,
  };
}
