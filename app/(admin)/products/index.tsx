import { useState, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { ProductListItem } from "@/components/admin/ProductListItem";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminProducts } from "@/hooks/api/use-admin-products";
import { useDeleteProduct } from "@/hooks/api/use-delete-product";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { Product, ProductFilters } from "@/types";
import { Plus } from "lucide-react-native";

type SortOption = NonNullable<ProductFilters["sort"]>;

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Nombre A-Z", value: "name_asc" },
  { label: "Nombre Z-A", value: "name_desc" },
  { label: "Precio ↑", value: "price_asc" },
  { label: "Precio ↓", value: "price_desc" },
  { label: "Más nuevos", value: "newest" },
];

export default function AdminProductsScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const [sort, setSort] = useState<SortOption>("name_asc");
  const { data, isLoading, isRefetching, refetch, error } = useAdminProducts({
    sort,
  });
  const deleteProduct = useDeleteProduct();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEdit = (product: Product) => {
    router.push(`/(admin)/products/${product.slug}`);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct.mutate(productToDelete.documentId, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  const products = data?.data ?? [];

  if (!tenant) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-center">
            No hay tienda seleccionada
          </Text>
          <Text
            variant="body"
            className="mb-6 text-center text-muted-foreground"
          >
            Necesitas seleccionar o crear una tienda para gestionar productos.
          </Text>
          <Button onPress={() => router.push("/(owner)/create-store")}>
            Crear tienda
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text variant="body" className="mt-4 text-muted-foreground">
            Cargando productos...
          </Text>
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
          <Text
            variant="body"
            className="mb-6 text-center text-muted-foreground"
          >
            {error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado"}
          </Text>
          <Button onPress={() => refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text variant="h1">Productos</Text>
          <TouchableOpacity
            onPress={() => router.push("/(admin)/products/new")}
            className="rounded-full bg-primary p-2"
          >
            <Plus size={20} className="text-primary-foreground" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 -mx-1 min-h-10 flex-grow-0"
          contentContainerStyle={{ paddingHorizontal: 4, gap: 6 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setSort(opt.value)}
              className={`rounded-full border px-4 py-2.5 ${sort === opt.value ? "border-primary bg-primary" : "border-border bg-background"}`}
            >
              <Text
                variant="body"
                className={`text-sm font-medium ${sort === opt.value ? "text-primary-foreground" : "text-foreground"}`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={products}
          keyExtractor={(item) => item.documentId}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <View className="mt-12 items-center">
              <Text variant="body" className="text-muted-foreground">
                No hay productos aún.
              </Text>
              <Button
                className="mt-4"
                onPress={() => router.push("/(admin)/products/new")}
              >
                Crear producto
              </Button>
            </View>
          }
        />
      </View>

      <ConfirmDialog
        visible={!!productToDelete}
        title="Eliminar producto"
        description={`¿Estás seguro de eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
        loading={deleteProduct.isPending}
      />
    </ScreenWrapper>
  );
}
