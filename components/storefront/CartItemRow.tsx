import { Image, Pressable, View } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
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
  const isAtStockLimit = item.quantity >= item.stock;

  return (
    <View className="rounded-lg border border-border bg-background p-3">
      <View className="flex-row gap-3">
        <View className="h-24 w-24 overflow-hidden rounded-md bg-secondary">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="h-full w-full"
              resizeMode="cover"
              accessibilityLabel={item.name}
            />
          ) : (
            <View className="h-full w-full items-center justify-center px-2">
              <Text variant="xs" className="text-center">
                Sin imagen
              </Text>
            </View>
          )}
        </View>

        <View className="min-w-0 flex-1 gap-2">
          <View className="flex-row items-start gap-2">
            <View className="min-w-0 flex-1">
              <Text className="font-semibold text-foreground" numberOfLines={2}>
                {item.name}
              </Text>
              {selectedOptions && (
                <Text variant="xs" className="mt-1 leading-4">
                  {selectedOptions}
                </Text>
              )}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ${item.name}`}
              hitSlop={8}
              onPress={() => onRemove(item)}
              className="h-11 w-11 items-center justify-center rounded-full bg-secondary"
            >
              <Trash2 size={16} color="#dc2626" />
            </Pressable>
          </View>

          <View className="flex-row flex-wrap items-end justify-between gap-3">
            <View>
              <Text variant="xs">Precio unitario</Text>
              <Text className="font-semibold">
                {formatPrice(item.price, currency)}
              </Text>
            </View>

            <View className="items-end gap-1">
              <View className="flex-row items-center overflow-hidden rounded-md border border-border">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Reducir cantidad de ${item.name}`}
                  onPress={() => onDecrease(item)}
                  className="h-11 w-11 items-center justify-center bg-background"
                >
                  <Minus size={15} color="#0a0a0a" />
                </Pressable>
                <View className="h-11 min-w-11 items-center justify-center border-x border-border px-2">
                  <Text className="font-semibold">{item.quantity}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Aumentar cantidad de ${item.name}`}
                  onPress={() => onIncrease(item)}
                  disabled={isAtStockLimit}
                  accessibilityState={{ disabled: isAtStockLimit }}
                  className="h-11 w-11 items-center justify-center bg-background disabled:opacity-40"
                >
                  <Plus size={15} color={isAtStockLimit ? '#a3a3a3' : '#0a0a0a'} />
                </Pressable>
              </View>
              {isAtStockLimit && (
                <Text variant="xs" className="text-right">
                  Stock maximo: {item.stock}
                </Text>
              )}
            </View>
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
