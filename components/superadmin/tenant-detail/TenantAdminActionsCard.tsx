import { View } from "react-native";
import { UserCog } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface TenantAdminActionsCardProps {
  onManageStoreAdmin: () => void;
  onManageMembers: () => void;
}

export function TenantAdminActionsCard({
  onManageStoreAdmin,
  onManageMembers,
}: TenantAdminActionsCardProps) {
  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <Text variant="body" className="font-semibold">
        Administracion
      </Text>
      <Button onPress={onManageStoreAdmin}>
        <Text variant="body" className="font-semibold text-primary-foreground">
          Administrar tienda
        </Text>
      </Button>
      <Button onPress={onManageMembers}>
        <View className="flex-row items-center gap-2">
          <UserCog size={18} className="text-primary-foreground" />
          <Text variant="body" className="font-semibold text-primary-foreground">
            Gestionar miembros
          </Text>
        </View>
      </Button>
    </View>
  );
}
