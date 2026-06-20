import { View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface OrderDetailHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export function OrderDetailHeader({
  title,
  subtitle,
  onBack,
}: OrderDetailHeaderProps) {
  return (
    <View className="border-b border-border bg-background px-4 py-3">
      <View className="mx-auto w-full max-w-6xl flex-row items-center gap-3">
        <Button variant="ghost" size="sm" onPress={onBack} className="px-1">
          <ArrowLeft size={22} color="#171717" />
        </Button>
        <View className="min-w-0 flex-1">
          <Text variant="h2" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="small">{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}
