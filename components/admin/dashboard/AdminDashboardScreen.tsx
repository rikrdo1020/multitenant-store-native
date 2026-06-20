import { View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { DashboardKpiCards } from './DashboardKpiCards';
import { DashboardLowStockWidget } from './DashboardLowStockWidget';
import { DashboardRangeSelector } from './DashboardRangeSelector';
import { DashboardRecentOrdersWidget } from './DashboardRecentOrdersWidget';
import { DashboardSalesChart } from './DashboardSalesChart';
import { DashboardTopProducts } from './DashboardTopProducts';
import { useAdminDashboardScreen } from '@/hooks/use-admin-dashboard-screen';

export function AdminDashboardScreen() {
  const screen = useAdminDashboardScreen();

  if (!screen.tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Text variant="h2" className="text-center">No hay tienda seleccionada</Text>
          <Text variant="body" className="text-center text-muted-foreground">
            Selecciona o crea una tienda para ver el dashboard.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <View className="w-full max-w-6xl self-center gap-6 p-4 pb-10 md:p-6">
        <View className="flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="h1">Dashboard</Text>
            <Text variant="body" className="text-muted-foreground">Resumen de {screen.tenant.name}</Text>
          </View>
          <Button variant="outline" size="sm" onPress={screen.refresh}>
            Actualizar
          </Button>
        </View>
        <DashboardRangeSelector selected={screen.range} onChange={screen.setRange} />
        <DashboardKpiCards overview={screen.overview} loading={screen.overviewLoading} />
        <DashboardSalesChart sales={screen.sales} loading={screen.salesLoading} />
        <View className="gap-4 lg:flex-row">
          <View className="w-full lg:flex-1">
            <DashboardLowStockWidget
              products={screen.lowStock}
              loading={screen.lowStockLoading}
              error={screen.lowStockError}
              onRetry={screen.retryLowStock}
              onProductPress={screen.goToProduct}
              onViewAll={screen.goToLowStock}
            />
          </View>
          <View className="w-full lg:flex-1">
            <DashboardRecentOrdersWidget
              orders={screen.recentOrders}
              loading={screen.recentOrdersLoading}
              error={screen.recentOrdersError}
              onRetry={screen.retryRecentOrders}
              onOrderPress={screen.goToOrder}
              onViewAll={screen.goToOrders}
            />
          </View>
        </View>
        <DashboardTopProducts products={screen.topProducts} loading={screen.topProductsLoading} />
      </View>
    </ScreenWrapper>
  );
}
