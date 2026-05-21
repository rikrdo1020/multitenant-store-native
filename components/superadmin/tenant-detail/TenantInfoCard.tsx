import { View } from "react-native";
import { Building2, Calendar, Mail, Package, ShoppingCart, Users } from "lucide-react-native";
import { TenantStatusBadge } from "@/components/superadmin/TenantStatusBadge";
import { Text } from "@/components/ui/Text";
import type { SuperadminTenantDetail } from "@/types";

interface TenantInfoCardProps {
  tenant: SuperadminTenantDetail;
  createdAt: string;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border py-3">
      <View className="flex-row items-center gap-2">
        {icon}
        <Text variant="small" className="text-muted-foreground">
          {label}
        </Text>
      </View>
      <Text variant="body" className="font-medium text-foreground">
        {value}
      </Text>
    </View>
  );
}

export function TenantInfoCard({ tenant, createdAt }: TenantInfoCardProps) {
  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-1">
          <Text variant="h2" className="font-bold">
            {tenant.name}
          </Text>
          <Text variant="small" className="text-muted-foreground">
            /{tenant.slug}
          </Text>
        </View>
        <TenantStatusBadge status={tenant.status} />
      </View>

      <InfoRow label="Owner" value={tenant.owner.email} icon={<Mail size={14} className="text-muted-foreground" />} />
      <InfoRow label="Creado" value={createdAt} icon={<Calendar size={14} className="text-muted-foreground" />} />
      <InfoRow label="Miembros" value={tenant._count.members} icon={<Users size={14} className="text-muted-foreground" />} />
      <InfoRow label="Productos" value={tenant._count.products} icon={<Package size={14} className="text-muted-foreground" />} />
      <InfoRow label="Ordenes" value={tenant._count.orders} icon={<ShoppingCart size={14} className="text-muted-foreground" />} />
      {tenant._count.customers !== undefined && (
        <InfoRow label="Clientes" value={tenant._count.customers} icon={<Building2 size={14} className="text-muted-foreground" />} />
      )}
    </View>
  );
}
