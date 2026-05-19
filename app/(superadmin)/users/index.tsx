import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useSuperadminUsers, useSetUserActive } from "@/hooks/api/use-superadmin-users";
import type { SuperadminUser } from "@/types";
import { User } from "lucide-react-native";

interface UserRowProps {
  user: SuperadminUser;
  onToggleActive: (user: SuperadminUser) => void;
}

function UserRow({ user, onToggleActive }: UserRowProps) {
  const createdAt = new Date(user.createdAt).toLocaleDateString("es-PA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View className="rounded-xl bg-card border border-border px-4 py-3 gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="rounded-full bg-muted p-1.5">
            <User size={14} className="text-muted-foreground" />
          </View>
          <View className="flex-1">
            <Text variant="body" className="font-semibold text-foreground" numberOfLines={1}>
              {user.name ?? "Sin nombre"}
            </Text>
            <Text variant="xs" className="text-muted-foreground" numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>
        <Switch
          value={user.isActive}
          onValueChange={() => onToggleActive(user)}
          trackColor={{ false: "#374151", true: "#6366f1" }}
          thumbColor="#ffffff"
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text variant="xs" className="text-muted-foreground">
          Desde {createdAt}
        </Text>
        {user.tenants.length > 0 && (
          <Text variant="xs" className="text-muted-foreground">
            {user.tenants.length} tienda{user.tenants.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function SuperadminUsersScreen() {
  const [page, setPage] = useState(1);
  const [pendingUser, setPendingUser] = useState<SuperadminUser | null>(null);

  const { data, isLoading, isRefetching, refetch, error } = useSuperadminUsers({
    page,
    pageSize: 20,
  });

  const { mutate: setUserActive, isPending } = useSetUserActive();

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleToggleActive = (user: SuperadminUser) => {
    setPendingUser(user);
  };

  const handleConfirm = () => {
    if (!pendingUser) return;
    setUserActive(
      { id: pendingUser.documentId, isActive: !pendingUser.isActive },
      { onSuccess: () => setPendingUser(null) },
    );
  };

  const users = data?.data ?? [];
  const meta = data?.meta;
  const hasNextPage = meta ? page < meta.totalPages : false;

  if (isLoading && !data) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center text-destructive">
            Error al cargar
          </Text>
          <Text variant="body" className="text-center text-muted-foreground">
            {error instanceof Error ? error.message : "Error inesperado"}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
          <Text variant="h1">Usuarios</Text>
          {meta && (
            <Text variant="small" className="text-muted-foreground">
              {meta.total} total
            </Text>
          )}
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={users}
          keyExtractor={(item) => item.documentId}
          renderItem={({ item }) => (
            <UserRow user={item} onToggleActive={handleToggleActive} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="mt-16 items-center">
              <Text variant="body" className="text-muted-foreground">
                No hay usuarios.
              </Text>
            </View>
          }
          ListFooterComponent={
            hasNextPage ? (
              <TouchableOpacity
                onPress={() => setPage((p) => p + 1)}
                className="mt-4 items-center py-3"
              >
                <Text variant="small" className="font-medium text-primary">
                  Cargar más
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>

      {pendingUser && (
        <ConfirmDialog
          visible
          title={pendingUser.isActive ? "Desactivar usuario" : "Activar usuario"}
          description={`¿Confirmas ${pendingUser.isActive ? "desactivar" : "activar"} la cuenta de "${pendingUser.email}"?`}
          confirmLabel={pendingUser.isActive ? "Desactivar" : "Activar"}
          destructive={pendingUser.isActive}
          loading={isPending}
          onConfirm={handleConfirm}
          onCancel={() => setPendingUser(null)}
        />
      )}
    </ScreenWrapper>
  );
}
