import { View } from "react-native";
import { Text } from "@/components/ui/Text";

export function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-1">
      <Text variant="xs" className="uppercase">
        {label}
      </Text>
      <Text>{value}</Text>
    </View>
  );
}

export function TotalRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className={strong ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </Text>
      <Text className={strong ? "text-xl font-bold" : "font-medium"}>
        {value}
      </Text>
    </View>
  );
}
