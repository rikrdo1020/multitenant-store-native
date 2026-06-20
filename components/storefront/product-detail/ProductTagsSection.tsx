import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import type { Product } from "@/types";

export function ProductTagsSection({ product }: { product: Product }) {
  if (!product.tags || product.tags.length === 0) return null;

  return (
    <View className="gap-3">
      <Text variant="small" className="font-semibold text-foreground">Etiquetas</Text>
      <View className="flex-row flex-wrap gap-2">
        {product.tags.map((tag) => (
          <Text
            key={tag.documentId}
            variant="xs"
            className="rounded-md border border-border px-2 py-1 text-foreground"
          >
            {tag.name}
          </Text>
        ))}
      </View>
    </View>
  );
}
