/**
 * Componente genérico para tabs de catálogo que solo necesitan
 * un campo "nombre" (Tags y Tipos de Producto).
 */
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
import { Plus, Pencil, Trash2 } from 'lucide-react-native';
import { colors } from '@/lib/theme';

const nameSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

type NameFormValues = z.infer<typeof nameSchema>;

interface NameItem {
  documentId: string;
  name: string;
}

interface NameFormProps {
  initial?: string;
  placeholder?: string;
  onSubmit: (values: NameFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function NameForm({ initial, placeholder, onSubmit, onCancel, submitting }: NameFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: initial ?? '' },
  });

  return (
    <View className="rounded-xl border border-border bg-background p-4">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nombre"
            placeholder={placeholder ?? 'Nombre'}
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
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

interface SimpleNameTabProps {
  items: NameItem[];
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  onRefetch: () => void;
  onCreateSubmit: (name: string, onDone: () => void) => void;
  onUpdateSubmit: (id: string, name: string, onDone: () => void) => void;
  onDelete: (id: string, onDone: () => void) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  emptyLabel?: string;
  countLabel?: string;
  formPlaceholder?: string;
  deleteTitle?: string;
  deleteDescription?: (name: string) => string;
}

export function SimpleNameTab({
  items,
  isLoading,
  isRefetching,
  error,
  onRefetch,
  onCreateSubmit,
  onUpdateSubmit,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
  emptyLabel = 'No hay elementos aún.',
  countLabel,
  formPlaceholder,
  deleteTitle = 'Eliminar',
  deleteDescription,
}: SimpleNameTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NameItem | null>(null);
  const [toDelete, setToDelete] = useState<NameItem | null>(null);

  const handleRefresh = useCallback(() => { onRefetch(); }, [onRefetch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Text variant="body" className="text-destructive mb-4 text-center">Error al cargar datos</Text>
        <Button onPress={onRefetch}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3">
        {countLabel && (
          <Text variant="small" className="text-muted-foreground">{items.length} {countLabel}</Text>
        )}
        <View className="ml-auto">
          <TouchableOpacity
            onPress={() => { setShowForm(true); setEditing(null); }}
            className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-2"
          >
            <Plus size={16} color="white" />
            <Text variant="small" className="font-semibold text-primary-foreground">Nuevo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showForm && !editing && (
        <View className="px-4 pb-3">
          <NameForm
            placeholder={formPlaceholder}
            onSubmit={(v) => onCreateSubmit(v.name, () => setShowForm(false))}
            onCancel={() => setShowForm(false)}
            submitting={isCreating}
          />
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.documentId}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        renderItem={({ item }) => (
          <>
            {editing?.documentId === item.documentId ? (
              <View className="mb-1">
                <NameForm
                  initial={item.name}
                  placeholder={formPlaceholder}
                  onSubmit={(v) => onUpdateSubmit(item.documentId, v.name, () => setEditing(null))}
                  onCancel={() => setEditing(null)}
                  submitting={isUpdating}
                />
              </View>
            ) : (
              <View className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <Text variant="body" className="font-medium flex-1" numberOfLines={1}>{item.name}</Text>
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
            <Text variant="body" className="text-muted-foreground">{emptyLabel}</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={!!toDelete}
        title={deleteTitle}
        description={
          toDelete
            ? (deleteDescription?.(toDelete.name) ?? `¿Eliminar "${toDelete.name}"? Esta acción no se puede deshacer.`)
            : ''
        }
        confirmLabel="Eliminar"
        destructive
        loading={isDeleting}
        onConfirm={() => {
          if (!toDelete) return;
          onDelete(toDelete.documentId, () => setToDelete(null));
        }}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}
