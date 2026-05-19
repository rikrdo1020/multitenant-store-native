import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { TenantListItem } from "@/components/superadmin/TenantListItem";
import { useSuperadminTenants } from "@/hooks/api/use-superadmin-tenants";
import type { SuperadminTenant, TenantStatus } from "@/types";
import { Search } from "lucide-react-native";

type StatusFilter = TenantStatus | "all";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Suspendidos", value: "suspended" },
  { label: "Inactivos", value: "inactive" },
];

export default function SuperadminTenantsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isRefetching, refetch, error } = useSuperadminTenants({
    page,
    pageSize: 20,
  });

  const allTenants = data?.data ?? [];

  const filtered = allTenants.filter((t) => {
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesSearch =
      search.trim() === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTenantPress = (tenant: SuperadminTenant) => {
    router.push(`/(superadmin)/tenants/${tenant.documentId}`);
  };

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
        <View className="px-4 pt-4 pb-3 gap-3">
          <View className="flex-row items-center justify-between">
            <Text variant="h1">Tenants</Text>
            {meta && (
              <Text variant="small" className="text-muted-foreground">
                {meta.total} total
              </Text>
            )}
          </View>

          <View className="flex-row items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
            <Search size={16} className="text-muted-foreground" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nombre o slug..."
              placeholderTextColor="#737373"
              className="flex-1 text-foreground text-sm"
              autoCapitalize="none"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2 flex-grow-0"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
        >
          {STATUS_FILTERS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => handleStatusChange(opt.value)}
              className={`rounded-full border px-4 py-2 ${
                statusFilter === opt.value
                  ? "border-primary bg-primary"
                  : "border-border bg-background"
              }`}
            >
              <Text
                variant="small"
                className={`font-medium ${
                  statusFilter === opt.value
                    ? "text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          style={{ flex: 1 }}
          data={filtered}
          keyExtractor={(item) => item.documentId}
          renderItem={({ item }) => (
            <TenantListItem tenant={item} onPress={handleTenantPress} />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="mt-16 items-center">
              <Text variant="body" className="text-muted-foreground">
                No hay tenants.
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
    </ScreenWrapper>
  );
}
