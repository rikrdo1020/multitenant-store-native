import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  useCatalogCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/api/use-catalog-categories';
import type { Category } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react-native';
import { colors } from '@/lib/theme';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CategoryFormProps {
  initial?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function CategoryForm({ initial, onSubmit, onCancel, submitting }: CategoryFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
    },
  });

  return (
    <View className="rounded-xl border border-border bg-background p-4">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nombre"
            placeholder="Ej: Electrónica"
            value={field.value}
            onChangeText={(text) => {
              field.onChange(text);
              if (!initial?.slug) {
                setValue('slug', slugify(text));
              }
            }}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="slug"
        render={({ field }) => (
          <Input
            label="Slug"
            placeholder="electronica"
            value={field.value}
            onChangeText={field.onChange}
            autoCapitalize="none"
            error={errors.slug?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            label="Descripción (opcional)"
            placeholder="Describe esta categoría"
            value={field.value}
            onChangeText={field.onChange}
            multiline
            numberOfLines={3}
            error={errors.description?.message}
          />
        )}
      />
      <View className="flex-row gap-3 pt-1">
        <Button variant="outline" className="flex-1" onPress={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button className="flex-1" onPress={handleSubmit(onSubmit)} loading={submitting}>
          Guardar
        </Button>
      </View>
    </View>
  );
}

export function CategoriesTab() {
  const { data: categories = [], isLoading, isRefetching, refetch, error } = useCatalogCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  const handleCreate = (values: CategoryFormValues) => {
    createCategory.mutate(values, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (values: CategoryFormValues) => {
    if (!editing) return;
    updateCategory.mutate({ id: editing.documentId, payload: values }, {
      onSuccess: () => setEditing(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteCategory.mutate(toDelete.documentId, {
      onSuccess: () => setToDelete(null),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
        <Text variant="small" className="mt-3">Cargando categorías...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Text variant="body" className="text-destructive mb-4 text-center">Error al cargar categorías</Text>
        <Button onPress={() => refetch()}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text variant="small" className="text-muted-foreground">{categories.length} categorías</Text>
        <TouchableOpacity
          onPress={() => { setShowForm(true); setEditing(null); }}
          className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-2"
        >
          <Plus size={16} color="white" />
          <Text variant="small" className="font-semibold text-primary-foreground">Nueva</Text>
        </TouchableOpacity>
      </View>

      {showForm && !editing && (
        <View className="px-4 pb-3">
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={createCategory.isPending}
          />
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => item.documentId}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        renderItem={({ item }) => (
          <>
            {editing?.documentId === item.documentId ? (
              <View className="mb-1">
                <CategoryForm
                  initial={{ name: item.name, slug: item.slug }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditing(null)}
                  submitting={updateCategory.isPending}
                />
              </View>
            ) : (
              <View className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <View className="flex-1 min-w-0">
                  <Text variant="body" className="font-medium" numberOfLines={1}>{item.name}</Text>
                  <Text variant="xs" className="text-muted-foreground">{item.slug}</Text>
                </View>
                <View className="flex-row gap-2 ml-3">
                  <TouchableOpacity
                    onPress={() => { setEditing(item); setShowForm(false); }}
                    className="rounded-lg border border-border p-2"
                  >
                    <Pencil size={16} color={colors.foreground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setToDelete(item)}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-2"
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
        ListEmptyComponent={
          <View className="mt-8 items-center">
            <Text variant="body" className="text-muted-foreground">No hay categorías aún.</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar categoría"
        description={`¿Eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        loading={deleteCategory.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}
