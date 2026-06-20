import { View } from 'react-native';
import { CartItemHeader } from '@/components/storefront/cart-item/CartItemHeader';
import { CartItemImage } from '@/components/storefront/cart-item/CartItemImage';
import { CartQuantityControl } from '@/components/storefront/cart-item/CartQuantityControl';
import { Text } from '@/components/ui/Text';
import { formatPrice } from '@/lib/utils';
import { formatSelectedOptions } from '@/lib/order';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  currency?: string;
  onDecrease: (item: CartItem) => void;
  onIncrease: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
}

export function CartItemRow({
  item,
  currency,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemRowProps) {
  const selectedOptions = formatSelectedOptions(item.selectedOptions);
  const isOutOfStock = item.stockStatus === 'out_of_stock' || item.stock <= 0;

  return (
    <View className="rounded-lg border border-border bg-background p-3">
      <View className="flex-row gap-3">
        <CartItemImage image={item.image} name={item.name} />

        <View className="min-w-0 flex-1 gap-2">
          <CartItemHeader item={item} selectedOptions={selectedOptions} onRemove={onRemove} />

          <View className="flex-row flex-wrap items-end justify-between gap-3">
            <View>
              <Text variant="xs">Precio unitario</Text>
              <Text className="font-semibold">
                {formatPrice(item.price, currency)}
              </Text>
            </View>

            <CartQuantityControl
              itemName={item.name}
              quantity={item.quantity}
              stock={item.stock}
              isOutOfStock={isOutOfStock}
              onDecrease={() => onDecrease(item)}
              onIncrease={() => onIncrease(item)}
            />
          </View>

          <View className="items-end">
            <Text variant="xs">Subtotal item</Text>
            <Text className="font-bold">
              {formatPrice(item.price * item.quantity, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
