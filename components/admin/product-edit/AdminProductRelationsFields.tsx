import { Controller } from 'react-hook-form';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { AdminProductControlledSelect } from './AdminProductControlledSelect';
import type { AdminProductEditViewModel } from '@/hooks/use-admin-product-edit-screen';

export function AdminProductRelationsFields({ product }: { product: AdminProductEditViewModel }) {
  return (
    <>
      <AdminProductControlledSelect product={product} name="categoryId" label="Categoria" options={product.categoryOptions} />
      <AdminProductControlledSelect product={product} name="brandId" label="Marca" options={product.brandOptions} />
      <AdminProductControlledSelect product={product} name="type" label="Tipo de producto" options={product.productTypeOptions} />
      <Controller
        control={product.control}
        name="tagIds"
        render={({ field: { onChange, value } }) => (
          <MultiSelect label="Tags" values={value} onChange={onChange} options={product.tagOptions} />
        )}
      />
    </>
  );
}
