import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import type { TenantStatusAction } from "@/hooks/use-superadmin-tenant-detail-screen";

interface TenantStatusActionsCardProps {
  actions: TenantStatusAction[];
  onSelect: (action: TenantStatusAction) => void;
}

export function TenantStatusActionsCard({ actions, onSelect }: TenantStatusActionsCardProps) {
  if (actions.length === 0) return null;

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <Text variant="body" className="font-semibold">
        Acciones
      </Text>
      <View className="gap-2">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.status}
            onPress={() => onSelect(action)}
            className={cn(
              "items-center rounded-xl border px-4 py-3",
              action.destructive
                ? "border-destructive/30 bg-destructive/5"
                : "border-emerald-500/30 bg-emerald-500/5",
            )}
          >
            <Text
              variant="body"
              className={cn(
                "font-semibold",
                action.destructive ? "text-destructive" : "text-emerald-600",
              )}
            >
              {action.label} tenant
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
