import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import type { LucideIcon } from "lucide-react-native";

interface Props {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  sub?: string;
}

export function MetricCard({ label, value, Icon, sub }: Props) {
  return (
    <View className="flex-1 rounded-2xl bg-card border border-border p-4 gap-3 min-w-[140px]">
      <View className="flex-row items-center justify-between">
        <Text variant="small" className="text-muted-foreground font-medium">
          {label}
        </Text>
        <View className="rounded-lg bg-primary/10 p-1.5">
          <Icon size={16} className="text-primary" />
        </View>
      </View>
      <Text variant="h2" className="font-bold text-foreground">
        {value}
      </Text>
      {sub ? (
        <Text variant="xs" className="text-muted-foreground">
          {sub}
        </Text>
      ) : null}
    </View>
  );
}
