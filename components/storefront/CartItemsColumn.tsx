import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from '@/components/storefront/CartItemRow';
import { generateItemKey } from '@/lib/utils';
import type { CartItem } from '@/types';

interface CartItemsColumnProps {
  items: CartItem[];
  currency?: string;
  onDecrease: (item: CartItem) => void;
  onIncrease: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onBrowseProducts: () => void;
}

export function CartItemsColumn({
  items,
  currency,
  onDecrease,
  onIncrease,
  onRemove,
  onBrowseProducts,
}: CartItemsColumnProps) {
  return (
    <View className="min-w-0 flex-1 gap-3">
      {items.map((item) => (
        <CartItemRow
          key={generateItemKey(item.documentId, item.selectedOptions)}
          item={item}
          currency={currency}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          onRemove={onRemove}
        />
      ))}
      <Button variant="outline" onPress={onBrowseProducts}>
        Seguir comprando
      </Button>
    </View>
  );
}
