import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { MetricCard } from "@/components/superadmin/MetricCard";
import { useSuperadminTenants } from "@/hooks/api/use-superadmin-tenants";
import { useSuperadminUsers } from "@/hooks/api/use-superadmin-users";
import { Building2, Users, ShoppingCart, Package } from "lucide-react-native";
import { Svg, Rect, Text as SvgText } from "react-native-svg";
import { useCallback } from "react";

function OrdersByTenantChart({ tenants }: { tenants: { name: string; orders: number }[] }) {
  const maxOrders = Math.max(...tenants.map((t) => t.orders), 1);
  const barWidth = 32;
  const chartHeight = 120;
  const gap = 12;
  const chartWidth = tenants.length * (barWidth + gap);

  return (
    <Svg width={chartWidth} height={chartHeight + 24}>
      {tenants.map((t, i) => {
        const barH = Math.max((t.orders / maxOrders) * chartHeight, 4);
        const x = i * (barWidth + gap);
        const y = chartHeight - barH;
        return (
          <Svg key={t.name}>
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={6}
              fill="#6366f1"
              opacity={0.85}
            />
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight + 16}
              textAnchor="middle"
              fontSize={9}
              fill="#737373"
            >
              {t.name.slice(0, 6)}
            </SvgText>
          </Svg>
        );
      })}
    </Svg>
  );
}

export default function SuperadminDashboard() {
  const {
    data: tenantsData,
    isLoading: tenantsLoading,
    refetch: refetchTenants,
  } = useSuperadminTenants({ page: 1, pageSize: 10 });

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useSuperadminUsers({ page: 1, pageSize: 1 });

  const isLoading = tenantsLoading || usersLoading;

  const onRefresh = useCallback(() => {
    refetchTenants();
    refetchUsers();
  }, [refetchTenants, refetchUsers]);

  const totalTenants = tenantsData?.meta.total ?? 0;
  const activeTenants = tenantsData?.data.filter((t) => t.status === "active").length ?? 0;
  const totalOrders = tenantsData?.data.reduce((acc, t) => acc + t._count.orders, 0) ?? 0;
  const totalProducts = tenantsData?.data.reduce((acc, t) => acc + t._count.products, 0) ?? 0;
  const totalUsers = usersData?.meta.total ?? 0;

  const chartData = (tenantsData?.data ?? [])
    .filter((t) => t._count.orders > 0)
    .slice(0, 8)
    .map((t) => ({ name: t.name, orders: t._count.orders }));

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text variant="h1" className="font-bold">
            Panel Global
          </Text>
          <Text variant="small" className="text-muted-foreground">
            Vista general de la plataforma
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" className="text-primary" />
          </View>
        ) : (
          <>
            <View className="gap-4">
              <Text variant="small" className="font-semibold text-muted-foreground uppercase tracking-widest">
                Métricas
              </Text>
              <View className="flex-row gap-3">
                <MetricCard
                  label="Tiendas activas"
                  value={activeTenants}
                  Icon={Building2}
                  sub={`de ${totalTenants} totales`}
                />
                <MetricCard
                  label="Usuarios"
                  value={totalUsers}
                  Icon={Users}
                />
              </View>
              <View className="flex-row gap-3">
                <MetricCard
                  label="Órdenes"
                  value={totalOrders}
                  Icon={ShoppingCart}
                  sub="en primeras 10 tiendas"
                />
                <MetricCard
                  label="Productos"
                  value={totalProducts}
                  Icon={Package}
                  sub="en primeras 10 tiendas"
                />
              </View>
            </View>

            {chartData.length > 0 && (
              <View className="rounded-2xl bg-card border border-border p-4 gap-4">
                <Text variant="body" className="font-semibold">
                  Órdenes por tenant
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <OrdersByTenantChart tenants={chartData} />
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
