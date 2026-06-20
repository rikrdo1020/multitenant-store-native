import { Switch, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Text } from '@/components/ui/Text';
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
      <Controller
        control={product.control}
        name="isFeatured"
        render={({ field: { value, onChange } }) => (
          <View className="mb-3 flex-row items-center justify-between rounded-md border border-border bg-background px-3 py-3">
            <View className="mr-3 min-w-0 flex-1">
              <Text variant="small" className="font-semibold text-foreground">
                Producto destacado
              </Text>
              <Text variant="xs" className="text-muted-foreground">
                Aparece en la home de la tienda.
              </Text>
            </View>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />
      {product.isFeaturedSelected && (
        <AdminProductControlledInput product={product} name="featuredOrder" label="Orden en destacados" keyboardType="number-pad" sanitize={product.sanitizeIntegerInput} />
      )}
    </>
  );
}
