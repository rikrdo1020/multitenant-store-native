import {
  useCatalogTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/hooks/api/use-catalog-tags';
import { SimpleNameTab } from './SimpleNameTab';

export function TagsTab() {
  const { data: tags = [], isLoading, isRefetching, refetch, error } = useCatalogTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  return (
    <SimpleNameTab
      items={tags}
      isLoading={isLoading}
      isRefetching={isRefetching}
      error={error}
      onRefetch={refetch}
      isCreating={createTag.isPending}
      isUpdating={updateTag.isPending}
      isDeleting={deleteTag.isPending}
      countLabel="etiquetas"
      formPlaceholder="Ej: Oferta"
      emptyLabel="No hay etiquetas aún."
      deleteTitle="Eliminar etiqueta"
      deleteDescription={(name) => `¿Eliminar la etiqueta "${name}"? Esta acción no se puede deshacer.`}
      onCreateSubmit={(name, onDone) => {
        createTag.mutate({ name }, { onSuccess: onDone });
      }}
      onUpdateSubmit={(id, name, onDone) => {
        updateTag.mutate({ id, payload: { name } }, { onSuccess: onDone });
      }}
      onDelete={(id, onDone) => {
        deleteTag.mutate(id, { onSuccess: onDone });
      }}
    />
  );
}
