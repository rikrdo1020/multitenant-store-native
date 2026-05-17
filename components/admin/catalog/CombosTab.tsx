import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  useCatalogCombos,
  useCreateCombo,
  useUpdateCombo,
  useDeleteCombo,
} from '@/hooks/api/use-catalog-combos';
import { useAdminProducts } from '@/hooks/api/use-admin-products';
import type { ComboDefinition } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react-native';

const conditionSchema = z.object({
  productType: z.string().optional(),
  minQuantity: z.coerce.number().optional(),
});

const comboSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  discount: z.coerce.number().min(0.01, 'El descuento es requerido'),
  discountType: z.enum(['percentage', 'fixed']),
  productIds: z.array(z.string()).optional(),
  conditions: z.array(conditionSchema).optional(),
});

type ComboFormValues = z.infer<typeof comboSchema>;

const DISCOUNT_TYPE_OPTIONS = [
  { label: 'Porcentaje (%)', value: 'percentage' },
  { label: 'Monto fijo', value: 'fixed' },
];

interface ComboFormProps {
  initial?: Partial<{
    name: string;
    description: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    productIds: string[];
    conditions: { productType?: string; minQuantity?: number }[];
  }>;
  onSubmit: (values: ComboFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function ComboForm({ initial, onSubmit, onCancel, submitting }: ComboFormProps) {
  const { data: productsData } = useAdminProducts();
  const products = productsData?.data ?? [];

  const productOptions = products.map((p) => ({
    label: p.name,
    value: p.documentId,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      discount: initial?.discount ?? ('' as unknown as number),
      discountType: initial?.discountType ?? 'percentage',
      productIds: initial?.productIds ?? [],
      conditions: initial?.conditions?.map((c) => ({
        productType: c.productType ?? '',
        minQuantity: c.minQuantity ?? undefined,
      })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  });

  return (
    <ScrollView className="rounded-xl border border-border bg-background p-4" showsVerticalScrollIndicator={false}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nombre"
            placeholder="Ej: Combo 2x1"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            label="Descripción (opcional)"
            placeholder="Descripción del combo"
            value={field.value}
            onChangeText={field.onChange}
            multiline
            numberOfLines={2}
            error={errors.description?.message}
          />
        )}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Controller
            control={control}
            name="discount"
            render={({ field }) => (
              <Input
                label="Descuento"
                placeholder="10"
                value={field.value != null && field.value !== ('' as unknown as number) ? String(field.value) : ''}
                onChangeText={field.onChange}
                keyboardType="numeric"
                error={errors.discount?.message}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Select
                label="Tipo"
                value={field.value}
                options={DISCOUNT_TYPE_OPTIONS}
                onValueChange={field.onChange}
                error={errors.discountType?.message}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="productIds"
        render={({ field }) => (
          <MultiSelect
            label="Productos del combo"
            values={field.value ?? []}
            options={productOptions}
            onChange={field.onChange}
            placeholder="Seleccionar productos..."
          />
        )}
      />

      <View className="mb-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text variant="small" className="font-medium text-foreground">Condiciones mínimas</Text>
          <TouchableOpacity
            onPress={() => append({ productType: '', minQuantity: undefined })}
            className="flex-row items-center gap-1 rounded-lg bg-muted px-2 py-1"
          >
            <Plus size={14} className="text-foreground" />
            <Text variant="xs">Agregar</Text>
          </TouchableOpacity>
        </View>
        {fields.map((field, index) => (
          <View key={field.id} className="mb-2 rounded-lg border border-border p-3">
            <View className="flex-row items-start gap-2">
              <View className="flex-1">
                <Controller
                  control={control}
                  name={`conditions.${index}.productType`}
                  render={({ field: f }) => (
                    <Input
                      label="Tipo de producto"
                      placeholder="Ej: bebida"
                      value={f.value ?? ''}
                      onChangeText={f.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`conditions.${index}.minQuantity`}
                  render={({ field: f }) => (
                    <Input
                      label="Cantidad mínima"
                      placeholder="2"
                      value={f.value != null ? String(f.value) : ''}
                      onChangeText={f.onChange}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              <TouchableOpacity
                onPress={() => remove(index)}
                className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-2"
              >
                <X size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-row gap-3 pt-1">
        <Button variant="outline" className="flex-1" onPress={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button className="flex-1" onPress={handleSubmit(onSubmit)} loading={submitting}>
          Guardar
        </Button>
      </View>
    </ScrollView>
  );
}

export function CombosTab() {
  const { data: combos = [], isLoading, isRefetching, refetch, error } = useCatalogCombos();
  const createCombo = useCreateCombo();
  const updateCombo = useUpdateCombo();
  const deleteCombo = useDeleteCombo();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ComboDefinition | null>(null);
  const [toDelete, setToDelete] = useState<ComboDefinition | null>(null);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  const handleCreate = (values: ComboFormValues) => {
    createCombo.mutate(values, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (values: ComboFormValues) => {
    if (!editing) return;
    updateCombo.mutate({ id: editing.documentId, payload: values }, {
      onSuccess: () => setEditing(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteCombo.mutate(toDelete.documentId, {
      onSuccess: () => setToDelete(null),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
        <Text variant="small" className="mt-3">Cargando combos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Text variant="body" className="text-destructive mb-4 text-center">Error al cargar combos</Text>
        <Button onPress={() => refetch()}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text variant="small" className="text-muted-foreground">{combos.length} combos</Text>
        <TouchableOpacity
          onPress={() => { setShowForm(true); setEditing(null); }}
          className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-2"
        >
          <Plus size={16} color="white" />
          <Text variant="small" className="font-semibold text-primary-foreground">Nuevo</Text>
        </TouchableOpacity>
      </View>

      {showForm && !editing && (
        <View className="px-4 pb-3" style={{ maxHeight: 520 }}>
          <ComboForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={createCombo.isPending}
          />
        </View>
      )}

      <FlatList
        data={combos}
        keyExtractor={(item) => item.documentId}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        renderItem={({ item }) => (
          <>
            {editing?.documentId === item.documentId ? (
              <View className="mb-1" style={{ maxHeight: 520 }}>
                <ComboForm
                  initial={{
                    name: item.name,
                    description: item.description,
                    discount: item.discount,
                    discountType: item.discountType,
                    productIds: item.products?.map((p) => p.documentId),
                    conditions: item.conditions,
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditing(null)}
                  submitting={updateCombo.isPending}
                />
              </View>
            ) : (
              <View className="rounded-xl border border-border bg-background px-4 py-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 min-w-0 mr-3">
                    <Text variant="body" className="font-medium" numberOfLines={1}>{item.name}</Text>
                    <View className="mt-1 flex-row items-center gap-2">
                      <View className="rounded-full bg-primary/10 px-2 py-0.5">
                        <Text variant="xs" className="font-semibold text-primary">
                          {item.discountType === 'percentage'
                            ? `${item.discount}% dto.`
                            : `$${item.discount} dto.`}
                        </Text>
                      </View>
                      {item.products && item.products.length > 0 && (
                        <Text variant="xs" className="text-muted-foreground">
                          {item.products.length} producto{item.products.length !== 1 ? 's' : ''}
                        </Text>
                      )}
                    </View>
                    {item.description ? (
                      <Text variant="xs" className="mt-1 text-muted-foreground" numberOfLines={2}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => { setEditing(item); setShowForm(false); }}
                      className="rounded-lg border border-border p-2"
                    >
                      <Pencil size={16} className="text-foreground" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setToDelete(item)}
                      className="rounded-lg border border-destructive/30 bg-destructive/5 p-2"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
        ListEmptyComponent={
          <View className="mt-8 items-center">
            <Text variant="body" className="text-muted-foreground">No hay combos aún.</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar combo"
        description={`¿Eliminar el combo "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        loading={deleteCombo.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}
