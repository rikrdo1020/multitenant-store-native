import { Pressable, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { CartIconButton } from "@/components/storefront/CartIconButton";
import { ProductImageCarousel } from "@/components/storefront/ProductImageCarousel";
import type { Product } from "@/types";

interface ProductHeroMediaProps {
  product: Product;
  cartItemCount: number;
  onBack: () => void;
  onCartPress: () => void;
}

export function ProductHeroMedia({
  product,
  cartItemCount,
  onBack,
  onCartPress,
}: ProductHeroMediaProps) {
  return (
    <View>
      <ProductImageCarousel images={product.images} productName={product.name} />
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={8}
        className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-background"
      >
        <ArrowLeft size={21} color="#0a0a0a" />
      </Pressable>
      <CartIconButton
        count={cartItemCount}
        onPress={onCartPress}
        className="absolute right-4 top-4"
      />
    </View>
  );
}
