import { Controller } from 'react-hook-form';
import { ImagePickerField } from '@/components/ui/ImagePickerField';
import { ProductOptionsField } from '@/components/ui/ProductOptionsField';
import type { AdminProductEditViewModel } from '@/hooks/use-admin-product-edit-screen';

export function AdminProductMediaFields({ product }: { product: AdminProductEditViewModel }) {
  return (
    <>
      <Controller
        control={product.control}
        name="images"
        render={({ field: { onChange, value } }) => (
          <ImagePickerField
            label="Imagenes"
            images={value}
            onImagesChange={onChange}
            onPickImage={product.pickImage}
            uploading={product.uploadingIndex !== null}
          />
        )}
      />
      <ProductOptionsField value={product.options} onChange={product.setOptions} />
    </>
  );
}
