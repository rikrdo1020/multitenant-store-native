import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import type { TenantStatus } from "@/types";

const STATUS_CONFIG: Record<TenantStatus, { label: string; bg: string; text: string }> = {
  active: { label: "Activo", bg: "bg-emerald-500/10", text: "text-emerald-600" },
  suspended: { label: "Suspendido", bg: "bg-amber-500/10", text: "text-amber-600" },
  inactive: { label: "Inactivo", bg: "bg-muted", text: "text-muted-foreground" },
};

interface Props {
  status: TenantStatus;
}

export function TenantStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  return (
    <View className={cn("rounded-full px-2.5 py-0.5", config.bg)}>
      <Text variant="xs" className={cn("font-semibold", config.text)}>
        {config.label}
      </Text>
    </View>
  );
}
