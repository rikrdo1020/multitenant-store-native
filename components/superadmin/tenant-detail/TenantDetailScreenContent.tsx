import { ActivityIndicator, ScrollView, View } from "react-native";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TenantAdminActionsCard } from "./TenantAdminActionsCard";
import { TenantInfoCard } from "./TenantInfoCard";
import { TenantStatusActionsCard } from "./TenantStatusActionsCard";
import type { SuperadminTenantDetailViewModel } from "@/hooks/use-superadmin-tenant-detail-screen";

interface TenantDetailScreenContentProps {
  screen: SuperadminTenantDetailViewModel;
}

export function TenantDetailScreenContent({ screen }: TenantDetailScreenContentProps) {
  if (screen.isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </ScreenWrapper>
    );
  }

  if (screen.hasError || !screen.tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center text-destructive">
            Tenant no encontrado
          </Text>
          <Button variant="outline" onPress={screen.goBack}>
            Volver
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }} showsVerticalScrollIndicator={false}>
        <TenantInfoCard tenant={screen.tenant} createdAt={screen.createdAt} />
        <TenantAdminActionsCard
          onManageStoreAdmin={screen.manageStoreAdmin}
          onManageMembers={screen.manageMembers}
        />
        <TenantStatusActionsCard actions={screen.availableActions} onSelect={screen.openStatusAction} />
      </ScrollView>

      {screen.pendingAction && (
        <ConfirmDialog
          visible
          title={`${screen.pendingAction.label} tenant`}
          description={`Confirmas ${screen.pendingAction.label.toLowerCase()} la tienda "${screen.tenant.name}"? Esta accion afectara el acceso de sus usuarios.`}
          confirmLabel={screen.pendingAction.label}
          destructive={screen.pendingAction.destructive}
          loading={screen.isUpdatingStatus}
          onConfirm={screen.confirmStatusAction}
          onCancel={screen.closeStatusAction}
        />
      )}
    </ScreenWrapper>
  );
}
