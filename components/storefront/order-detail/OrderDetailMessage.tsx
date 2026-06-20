import { View } from "react-native";
import { Package } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface OrderDetailMessageProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  variant?: "default" | "outline";
}

export function OrderDetailMessage({
  title,
  message,
  actionLabel,
  onAction,
  variant,
}: OrderDetailMessageProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Package size={34} color="#737373" />
      <View className="gap-1">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
        <Text variant="small" className="text-center">
          {message}
        </Text>
      </View>
      <Button variant={variant} onPress={onAction}>
        {actionLabel}
      </Button>
    </View>
  );
}
