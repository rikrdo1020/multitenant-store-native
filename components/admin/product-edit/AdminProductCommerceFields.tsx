import { AdminProductControlledInput } from './AdminProductControlledInput';
import { AdminProductControlledSelect } from './AdminProductControlledSelect';
import type { AdminProductEditViewModel } from '@/hooks/use-admin-product-edit-screen';

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Archivado', value: 'archived' },
];

export function AdminProductCommerceFields({ product }: { product: AdminProductEditViewModel }) {
  return (
    <>
      <AdminProductControlledInput product={product} name="price" label="Precio" keyboardType="decimal-pad" sanitize={(text) => product.sanitizeDecimalInput(text).replace(',', '.')} />
      <AdminProductControlledInput product={product} name="discountPrice" label="Precio de oferta" keyboardType="decimal-pad" sanitize={(text) => text ? product.sanitizeDecimalInput(text).replace(',', '.') : text} />
      <AdminProductControlledInput product={product} name="dku" label="DKU" editable={product.isNew} mutedWhenDisabled />
      <AdminProductControlledInput product={product} name="stock" label="Stock" keyboardType="number-pad" sanitize={product.sanitizeIntegerInput} />
      <AdminProductControlledSelect product={product} name="productStatus" label="Estado" options={statusOptions} />
    </>
  );
}
