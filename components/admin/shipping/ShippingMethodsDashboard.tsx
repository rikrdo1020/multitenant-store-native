import { View } from 'react-native';
import { ShippingMethodsHeader } from '@/components/admin/shipping/ShippingMethodsHeader';
import { ShippingMethodsPanel } from '@/components/admin/shipping/ShippingMethodsPanel';
import type { useShippingMethodsScreen } from '@/hooks/use-shipping-methods-screen';

interface ShippingMethodsDashboardProps {
  screen: ReturnType<typeof useShippingMethodsScreen>;
  isWide: boolean;
}

export function ShippingMethodsDashboard({ screen, isWide }: ShippingMethodsDashboardProps) {
  return (
    <View className="gap-6">
      <ShippingMethodsHeader
        tenantName={screen.tenant!.name}
        isWide={isWide}
        onCreate={screen.openCreate}
      />
      <ShippingMethodsPanel
        methods={screen.methods}
        isWide={isWide}
        isLoading={screen.methodsLoading}
        isError={screen.methodsError}
        isRefreshing={screen.methodsRefreshing}
        isMutating={screen.isRemoving}
        onRefresh={screen.refreshMethods}
        onCreate={screen.openCreate}
        onEdit={screen.openEdit}
        onRemove={screen.openRemoveDialog}
      />
    </View>
  );
}
