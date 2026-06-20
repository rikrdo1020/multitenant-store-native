import { View } from "react-native";
import { Text } from "@/components/ui/Text";

export function ProductDescriptionSection({ description }: { description: string | null }) {
  if (!description) return null;

  return (
    <View className="gap-2">
      <Text variant="h3">Descripcion</Text>
      <Text variant="body" className="leading-6 text-muted-foreground">
        {description}
      </Text>
    </View>
  );
}
