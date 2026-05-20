import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TenantStatusBadge } from "@/components/superadmin/TenantStatusBadge";
import { useSuperadminTenant, useSetTenantStatus } from "@/hooks/api/use-superadmin-tenant";
import {
  Building2,
  Mail,
  Package,
  ShoppingCart,
  Users,
  Calendar,
} from "lucide-react-native";
import type { TenantStatus } from "@/types";

const STATUS_ACTIONS: { label: string; status: TenantStatus; destructive: boolean }[] = [
  { label: "Activar", status: "active", destructive: false },
  { label: "Suspender", status: "suspended", destructive: true },
  { label: "Desactivar", status: "inactive", destructive: true },
];

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border">
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

export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: tenant, isLoading, error } = useSuperadminTenant(id);
  const { mutate: setStatus, isPending } = useSetTenantStatus();


  const [pendingAction, setPendingAction] = useState<{
    label: string;
    status: TenantStatus;
    destructive: boolean;
  } | null>(null);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center text-destructive">
            Tenant no encontrado
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            Volver
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    setStatus(
      { id: tenant.documentId, status: pendingAction.status },
      { onSuccess: () => setPendingAction(null) },
    );
  };

  const availableActions = STATUS_ACTIONS.filter(
    (a) => a.status !== tenant.status,
  );

  const createdAt = new Date(tenant.createdAt).toLocaleDateString("es-PA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl bg-card border border-border p-4 gap-3">
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

          <InfoRow
            label="Owner"
            value={tenant.owner.email}
            icon={<Mail size={14} className="text-muted-foreground" />}
          />
          <InfoRow
            label="Creado"
            value={createdAt}
            icon={<Calendar size={14} className="text-muted-foreground" />}
          />
          <InfoRow
            label="Miembros"
            value={tenant._count.members}
            icon={<Users size={14} className="text-muted-foreground" />}
          />
          <InfoRow
            label="Productos"
            value={tenant._count.products}
            icon={<Package size={14} className="text-muted-foreground" />}
          />
          <InfoRow
            label="Órdenes"
            value={tenant._count.orders}
            icon={<ShoppingCart size={14} className="text-muted-foreground" />}
          />
          {tenant._count.customers !== undefined && (
            <InfoRow
              label="Clientes"
              value={tenant._count.customers}
              icon={<Building2 size={14} className="text-muted-foreground" />}
            />
          )}
        </View>

        {availableActions.length > 0 && (
          <View className="rounded-2xl bg-card border border-border p-4 gap-3">
            <Text variant="body" className="font-semibold">
              Acciones
            </Text>
            <View className="gap-2">
              {availableActions.map((action) => (
                <TouchableOpacity
                  key={action.status}
                  onPress={() => setPendingAction(action)}
                  className={`rounded-xl border px-4 py-3 items-center ${
                    action.destructive
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-emerald-500/30 bg-emerald-500/5"
                  }`}
                >
                  <Text
                    variant="body"
                    className={`font-semibold ${action.destructive ? "text-destructive" : "text-emerald-600"}`}
                  >
                    {action.label} tenant
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {pendingAction && (
        <ConfirmDialog
          visible
          title={`${pendingAction.label} tenant`}
          description={`¿Confirmas ${pendingAction.label.toLowerCase()} la tienda "${tenant.name}"? Esta acción afectará el acceso de sus usuarios.`}
          confirmLabel={pendingAction.label}
          destructive={pendingAction.destructive}
          loading={isPending}
          onConfirm={handleConfirmAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </ScreenWrapper>
  );
}
