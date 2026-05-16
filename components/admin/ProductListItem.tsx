import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ProductStatusBadge } from './ProductStatusBadge';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { Pencil, Trash2 } from 'lucide-react-native';

interface ProductListItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductListItem({ product, onEdit, onDelete }: ProductListItemProps) {
  const thumbnail = product.images?.[0];

  return (
    <View className="flex-row items-center rounded-lg border border-border bg-card p-3">
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          className="h-14 w-14 rounded-md bg-muted"
          resizeMode="cover"
        />
      ) : (
        <View className="h-14 w-14 rounded-md bg-muted" />
      )}
      <View className="ml-3 flex-1">
        <Text variant="body" className="font-semibold text-foreground">
          {product.name}
        </Text>
        <Text variant="small" className="text-muted-foreground">
          {product.category?.name ?? 'Sin categoría'}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Text variant="small" className="font-medium text-foreground">
            {formatPrice(product.price)}
          </Text>
          <ProductStatusBadge status={product.productStatus} />
        </View>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          testID="edit-button"
          onPress={() => onEdit(product)}
          className="rounded-md bg-primary/10 p-2"
        >
          <Pencil size={18} className="text-primary" />
        </TouchableOpacity>
        <TouchableOpacity
          testID="delete-button"
          onPress={() => onDelete(product)}
          className="rounded-md bg-destructive/10 p-2"
        >
          <Trash2 size={18} className="text-destructive" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
