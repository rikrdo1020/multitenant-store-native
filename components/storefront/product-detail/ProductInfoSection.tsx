import { View } from "react-native";
import { PackageCheck } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductInfoSectionProps {
  product: Product;
  currency?: string;
}

export function ProductInfoSection({ product, currency }: ProductInfoSectionProps) {
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const availableStock = product.availableStock ?? product.stock;
  const stockLabel = availableStock > 0
    ? `${availableStock} ${availableStock === 1 ? "disponible" : "disponibles"}`
    : "Agotado";
  const stockColor = availableStock > 0 ? "#16a34a" : "#737373";
  const stockTextClass = product.stockStatus === "low_stock"
    ? "font-medium text-amber-700"
    : availableStock > 0
      ? "font-medium text-green-700"
      : "font-medium";

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center gap-2">
        {product.brand ? <Text variant="xs" className="font-semibold uppercase tracking-widest text-muted-foreground">{product.brand.name}</Text> : null}
        {product.category ? <Text variant="xs" className="rounded-md bg-secondary px-2 py-1 text-foreground">{product.category.name}</Text> : null}
      </View>
      <Text variant="h1" className="leading-tight">{product.name}</Text>
      <View className="flex-row items-baseline gap-2">
        <Text variant="h2" className="font-bold">{formatPrice(displayPrice, currency)}</Text>
        {hasDiscount ? <Text variant="small" className="line-through">{formatPrice(product.price, currency)}</Text> : null}
      </View>
      <View className="flex-row items-center gap-2">
        <PackageCheck size={17} color={stockColor} />
        <Text variant="small" className={stockTextClass}>{stockLabel}</Text>
      </View>
    </View>
  );
}
