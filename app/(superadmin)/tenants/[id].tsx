import { useLocalSearchParams } from "expo-router";
import { TenantDetailScreenContent } from "@/components/superadmin/tenant-detail/TenantDetailScreenContent";
import { useSuperadminTenantDetailScreen } from "@/hooks/use-superadmin-tenant-detail-screen";

export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const screen = useSuperadminTenantDetailScreen(id);

  return <TenantDetailScreenContent screen={screen} />;
}
