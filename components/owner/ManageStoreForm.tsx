import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SlugField } from '@/components/forms/SlugField';
import type { useManageStoreScreen } from '@/hooks/use-manage-store-screen';

type ManageStoreViewModel = ReturnType<typeof useManageStoreScreen>;

interface ManageStoreFormProps {
  store: ManageStoreViewModel;
}

export function ManageStoreForm({ store }: ManageStoreFormProps) {
  const { control, watch, formState: { errors } } = store.form;
  const nameValue = watch('name');

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Nombre de la tienda" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="slug"
        render={({ field: { onChange, value } }) => (
          <SlugField value={value} onChangeText={onChange} nameValue={nameValue} excludeDocumentId={store.profile!.documentId} error={errors.slug?.message} />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Descripcion (opcional)" onChangeText={onChange} onBlur={onBlur} value={value ?? ''} multiline numberOfLines={3} error={errors.description?.message} />
        )}
      />
      <Button onPress={store.onSubmit} disabled={store.isPending}>
        {store.isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </>
  );
}
