import { Pressable, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import type { CartItem } from "@/types";

interface CartItemHeaderProps {
  item: CartItem;
  selectedOptions: string;
  onRemove: (item: CartItem) => void;
}

export function CartItemHeader({
  item,
  selectedOptions,
  onRemove,
}: CartItemHeaderProps) {
  return (
    <View className="flex-row items-start gap-2">
      <View className="min-w-0 flex-1">
        <Text className="font-semibold text-foreground" numberOfLines={2}>
          {item.name}
        </Text>
        {selectedOptions ? (
          <Text variant="xs" className="mt-1 leading-4">
            {selectedOptions}
          </Text>
        ) : null}
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
  );
}
