import { Image, View } from "react-native";
import { Text } from "@/components/ui/Text";

interface CartItemImageProps {
  image?: string;
  name: string;
}

export function CartItemImage({ image, name }: CartItemImageProps) {
  return (
    <View className="h-24 w-24 overflow-hidden rounded-md bg-secondary">
      {image ? (
        <Image
          source={{ uri: image }}
          className="h-full w-full"
          resizeMode="cover"
          accessibilityLabel={name}
        />
      ) : (
        <View className="h-full w-full items-center justify-center px-2">
          <Text variant="xs" className="text-center">
            Sin imagen
          </Text>
        </View>
      )}
    </View>
  );
}
