import { Pressable, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { Text } from "@/components/ui/Text";

interface CartQuantityControlProps {
  itemName: string;
  quantity: number;
  stock: number;
  isOutOfStock: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function CartQuantityControl({
  itemName,
  quantity,
  stock,
  isOutOfStock,
  onDecrease,
  onIncrease,
}: CartQuantityControlProps) {
  const isAtStockLimit = quantity >= stock;

  return (
    <View className="items-end gap-1">
      <View className="flex-row items-center overflow-hidden rounded-md border border-border">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reducir cantidad de ${itemName}`}
          onPress={onDecrease}
          className="h-11 w-11 items-center justify-center bg-background"
        >
          <Minus size={15} color="#0a0a0a" />
        </Pressable>
        <View className="h-11 min-w-11 items-center justify-center border-x border-border px-2">
          <Text className="font-semibold">{quantity}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aumentar cantidad de ${itemName}`}
          onPress={onIncrease}
          disabled={isAtStockLimit}
          accessibilityState={{ disabled: isAtStockLimit }}
          className="h-11 w-11 items-center justify-center bg-background disabled:opacity-40"
        >
          <Plus size={15} color={isAtStockLimit ? "#a3a3a3" : "#0a0a0a"} />
        </Pressable>
      </View>
      {(isAtStockLimit || isOutOfStock) ? (
        <Text variant="xs" className={isOutOfStock ? "text-right text-destructive" : "text-right"}>
          {isOutOfStock ? "Sin stock disponible" : `Stock maximo: ${stock}`}
        </Text>
      ) : null}
    </View>
  );
}
