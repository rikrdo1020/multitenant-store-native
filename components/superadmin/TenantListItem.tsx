import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { TenantStatusBadge } from "./TenantStatusBadge";
import { ChevronRight, ShoppingCart, Package } from "lucide-react-native";
import type { SuperadminTenant } from "@/types";

interface Props {
  tenant: SuperadminTenant;
  onPress: (tenant: SuperadminTenant) => void;
}

export function TenantListItem({ tenant, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress(tenant)}

      activeOpacity={0.7}
      className="flex-row items-center gap-3 rounded-xl bg-card border border-border px-4 py-3"
    >
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center gap-2">
          <Text variant="body" className="font-semibold text-foreground flex-shrink">
            {tenant.name}
          </Text>
          <TenantStatusBadge status={tenant.status} />
        </View>
        <Text variant="xs" className="text-muted-foreground">
          /{tenant.slug}
        </Text>
        <View className="flex-row items-center gap-4 mt-1">
          <View className="flex-row items-center gap-1">
            <ShoppingCart size={12} className="text-muted-foreground" />
            <Text variant="xs" className="text-muted-foreground">
              {tenant._count.orders} órdenes
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Package size={12} className="text-muted-foreground" />
            <Text variant="xs" className="text-muted-foreground">
              {tenant._count.products} productos
            </Text>
          </View>
        </View>
      </View>
      <ChevronRight size={18} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
