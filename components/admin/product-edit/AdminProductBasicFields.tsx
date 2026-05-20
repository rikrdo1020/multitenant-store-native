import { Controller } from 'react-hook-form';
import { RichTextField } from '@/components/ui/RichTextField';
import { AdminProductControlledInput } from './AdminProductControlledInput';
import type { AdminProductEditViewModel } from '@/hooks/use-admin-product-edit-screen';

export function AdminProductBasicFields({ product }: { product: AdminProductEditViewModel }) {
  return (
    <>
      <AdminProductControlledInput product={product} name="name" label="Nombre" />
      <AdminProductControlledInput
        product={product}
        name="slug"
        label="Slug"
        editable={!product.isNew}
        mutedWhenDisabled
      />
      <Controller
        control={product.control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <RichTextField label="Descripcion" value={value ?? ''} onChange={onChange} />
        )}
      />
    </>
  );
}
