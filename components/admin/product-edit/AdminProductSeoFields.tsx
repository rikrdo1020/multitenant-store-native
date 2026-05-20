import { AdminProductControlledInput } from './AdminProductControlledInput';
import type { AdminProductEditViewModel } from '@/hooks/use-admin-product-edit-screen';

export function AdminProductSeoFields({ product }: { product: AdminProductEditViewModel }) {
  return (
    <>
      <AdminProductControlledInput product={product} name="seoTitle" label="SEO Titulo" />
      <AdminProductControlledInput product={product} name="seoDescription" label="SEO Descripcion" multiline />
    </>
  );
}
