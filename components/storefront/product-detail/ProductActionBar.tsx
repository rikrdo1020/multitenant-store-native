import { View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface ProductActionBarProps {
  canAddToCart: boolean;
  addDisabledReason: string | null;
  onAddToCart: () => void;
}

export function ProductActionBar({
  canAddToCart,
  addDisabledReason,
  onAddToCart,
}: ProductActionBarProps) {
  return (
    <View className="border-t border-border bg-background px-4 pb-4 pt-3">
      {addDisabledReason ? (
        <Text variant="xs" className="mb-2 text-center">
          {addDisabledReason}
        </Text>
      ) : null}
      <Button size="lg" disabled={!canAddToCart} onPress={onAddToCart}>
        <View className="flex-row items-center gap-2">
          <ShoppingCart size={18} color="#ffffff" />
          <Text className="font-semibold text-primary-foreground">
            Agregar al carrito
          </Text>
        </View>
      </Button>
    </View>
  );
}
