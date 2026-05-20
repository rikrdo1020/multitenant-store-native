import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Users } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAdminCustomers } from '@/hooks/api/use-admin-customers';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { AdminCustomerFilters, Customer } from '@/types';

export default function AdminCustomersScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filters: AdminCustomerFilters = {
    ...(search.trim() ? { search: search.trim() } : {}),
    page,
    pageSize: 20,
  };

  const { data, isLoading, isRefetching, refetch, error } = useAdminCustomers(filters);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleCustomerPress = (customer: Customer) => {
    router.push(`/(admin)/customers/${customer.documentId}`);
  };

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const hasNextPage = meta ? page < meta.totalPages : false;

  if (!tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center">Sin tienda</Text>
          <Text variant="body" className="text-center text-muted-foreground">
            Selecciona una tienda para ver los clientes.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text variant="body" className="mt-4 text-muted-foreground">Cargando clientes...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center text-destructive">Error al cargar</Text>
          <Text variant="body" className="mb-6 text-center text-muted-foreground">
            {error instanceof Error ? error.message : 'Error inesperado'}
          </Text>
          <Button onPress={() => refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-4 pt-4 pb-3">
          <Text variant="h1">Clientes</Text>

          <View className="mt-3 flex-row items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Search size={16} className="text-muted-foreground" />
            <TextInput
              className="flex-1 py-3 text-base text-foreground"
              placeholder="Buscar por nombre o email..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={customers}
          keyExtractor={(item) => item.documentId}
          renderItem={({ item }) => (
            <CustomerListItem customer={item} onPress={handleCustomerPress} />
          )}
          ItemSeparatorComponent={() => <View className="h-px mx-4 bg-border" />}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="mt-16 items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Users size={24} className="text-muted-foreground" />
              </View>
              <Text variant="body" className="text-muted-foreground">
                {search ? 'Sin resultados para tu búsqueda.' : 'No hay clientes aún.'}
              </Text>
            </View>
          }
          ListFooterComponent={
            hasNextPage ? (
              <TouchableOpacity
                onPress={() => setPage((p) => p + 1)}
                className="mt-4 items-center py-3"
              >
                <Text variant="small" className="text-primary font-medium">Cargar más</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </ScreenWrapper>
  );
}

function CustomerListItem({
  customer,
  onPress,
}: {
  customer: Customer;
  onPress: (customer: Customer) => void;
}) {
  const initials = customer.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const registrationDate = new Date(customer.createdAt).toLocaleDateString('es-PA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(customer)}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-muted/50"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Text variant="small" className="font-bold text-primary">{initials}</Text>
      </View>

      <View className="min-w-0 flex-1">
        <Text variant="body" className="font-semibold text-foreground" numberOfLines={1}>
          {customer.name}
        </Text>
        <Text variant="xs" className="text-muted-foreground" numberOfLines={1}>
          {customer.email}
        </Text>
        {customer.phone ? (
          <Text variant="xs" className="text-muted-foreground">{customer.phone}</Text>
        ) : null}
      </View>

      <View className="items-end gap-0.5">
        <Text variant="xs" className="font-semibold text-foreground">
          {customer.totalOrders} {customer.totalOrders === 1 ? 'orden' : 'órdenes'}
        </Text>
        <Text variant="xs" className="text-muted-foreground">{registrationDate}</Text>
      </View>
    </TouchableOpacity>
  );
}
