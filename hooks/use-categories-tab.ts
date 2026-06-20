import { useCallback, useState } from 'react';
import {
  useCatalogCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/api/use-catalog-categories';
import type { Category } from '@/types';

export interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}

export function useCategoriesTab() {
  const { data: categories = [], isLoading, isRefetching, refetch, error } =
    useCatalogCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleStartCreate = useCallback(() => {
    setShowForm(true);
    setEditing(null);
  }, []);

  const handleStartEdit = useCallback((category: Category) => {
    setEditing(category);
    setShowForm(false);
  }, []);

  const handleCreate = useCallback(
    (values: CategoryFormValues) => {
      createCategory.mutate(values, { onSuccess: () => setShowForm(false) });
    },
    [createCategory],
  );

  const handleUpdate = useCallback(
    (values: CategoryFormValues) => {
      if (!editing) return;
      updateCategory.mutate(
        { id: editing.documentId, payload: values },
        { onSuccess: () => setEditing(null) },
      );
    },
    [editing, updateCategory],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!toDelete) return;
    deleteCategory.mutate(toDelete.documentId, { onSuccess: () => setToDelete(null) });
  }, [deleteCategory, toDelete]);

  return {
    categories,
    isLoading,
    isRefetching,
    error,
    showForm,
    editing,
    toDelete,
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    isDeleting: deleteCategory.isPending,
    setShowForm,
    setEditing,
    setToDelete,
    handleRefresh,
    handleStartCreate,
    handleStartEdit,
    handleCreate,
    handleUpdate,
    handleConfirmDelete,
  };
}
