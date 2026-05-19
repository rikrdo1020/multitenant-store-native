import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  useCatalogCombos,
  useCreateCombo,
  useUpdateCombo,
  useDeleteCombo,
} from '@/hooks/api/use-catalog-combos';
import { useCatalogProductTypes } from '@/hooks/api/use-catalog-product-types';
import type { ComboDefinition } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react-native';

const ruleSchema = z.object({
  productType: z.string().min(1, 'Selecciona un tipo'),
  quantity: z.coerce.number().int().min(1, 'Mínimo 1'),
});

const comboSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  isActive: z.boolean(),
  rules: z.array(ruleSchema).min(1, 'Agrega al menos una regla'),
});

type ComboFormValues = z.infer<typeof comboSchema>;

interface ComboFormProps {
  initial?: Partial<{
    name: string;
    price: number;
    isActive: boolean;
    rules: { productType: string; quantity: number }[];
  }>;
  onSubmit: (values: ComboFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function ComboForm({ initial, onSubmit, onCancel, submitting }: ComboFormProps) {
  const { data: productTypes = [] } = useCatalogProductTypes();
  const productTypeOptions = productTypes.map((pt) => ({ label: pt.name, value: pt.slug }));

  const { control, handleSubmit, formState: { errors } } = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: initial?.name ?? '',
      price: initial?.price ?? ('' as unknown as number),
      isActive: initial?.isActive ?? true,
      rules: initial?.rules?.length ? initial.rules : [{ productType: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rules' });

  return (
    <View className="rounded-xl border border-border bg-background p-4">
      {/* Active toggle */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="small" className="font-medium text-foreground">Activo</Text>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Switch value={field.value} onValueChange={field.onChange} />
          )}
        />
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nombre del combo"
            placeholder="Ej: Combo 3 Minoxidil + Dermaroller"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <Input
            label="Precio del combo"
            placeholder="30.00"
            value={field.value != null && field.value !== ('' as unknown as number) ? String(field.value) : ''}
            onChangeText={field.onChange}
            keyboardType="decimal-pad"
            error={errors.price?.message}
          />
        )}
      />

      {/* Rules */}
      <View className="mt-1">
        <View className="mb-2 flex-row items-center justify-between">
          <Text variant="small" className="font-medium text-foreground">Reglas del combo</Text>
          <TouchableOpacity
            onPress={() => append({ productType: '', quantity: 1 })}
            className="flex-row items-center gap-1 rounded-lg bg-muted px-2 py-1"
          >
            <Plus size={13} color="#374151" />
            <Text variant="xs">Agregar</Text>
          </TouchableOpacity>
        </View>

        {typeof errors.rules?.root?.message === 'string' && (
          <Text variant="xs" className="mb-2 text-destructive">{errors.rules.root.message}</Text>
        )}

        {fields.map((field, index) => (
          <View key={field.id} className="mb-2 flex-row items-end gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name={`rules.${index}.productType`}
                render={({ field: f }) => (
                  <Select
                    label="Tipo de producto"
                    value={f.value}
                    options={productTypeOptions}
                    onValueChange={f.onChange}
                    placeholder="Seleccionar..."
                    error={errors.rules?.[index]?.productType?.message}
                  />
                )}
              />
            </View>
            <View style={{ width: 80 }}>
              <Controller
                control={control}
                name={`rules.${index}.quantity`}
                render={({ field: f }) => (
                  <Input
                    label="Cant."
                    placeholder="1"
                    value={f.value != null && f.value !== ('' as unknown as number) ? String(f.value) : ''}
                    onChangeText={f.onChange}
                    keyboardType="number-pad"
                    error={errors.rules?.[index]?.quantity?.message}
                  />
                )}
              />
            </View>
            <TouchableOpacity
              onPress={() => remove(index)}
              className="mb-1 rounded-lg border border-destructive/30 bg-destructive/5 p-2"
              disabled={fields.length === 1}
              style={{ opacity: fields.length === 1 ? 0.4 : 1 }}
            >
              <X size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="flex-row gap-3 pt-2">
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

export function CombosTab() {
  const { data: combos = [], isLoading, isRefetching, refetch, error } = useCatalogCombos();
  const createCombo = useCreateCombo();
  const updateCombo = useUpdateCombo();
  const deleteCombo = useDeleteCombo();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ComboDefinition | null>(null);
  const [toDelete, setToDelete] = useState<ComboDefinition | null>(null);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

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
        <View className="px-4 pb-3">
          <ComboForm
            onSubmit={(values) => createCombo.mutate(values, { onSuccess: () => setShowForm(false) })}
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
              <View className="mb-1">
                <ComboForm
                  initial={{
                    name: item.name,
                    price: item.price,
                    isActive: item.isActive,
                    rules: item.rules,
                  }}
                  onSubmit={(values) => updateCombo.mutate({ id: item.documentId, payload: values }, { onSuccess: () => setEditing(null) })}
                  onCancel={() => setEditing(null)}
                  submitting={updateCombo.isPending}
                />
              </View>
            ) : (
              <View className="rounded-xl border border-border bg-background px-4 py-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 min-w-0 mr-3">
                    <View className="flex-row items-center gap-2">
                      <Text variant="body" className="font-medium flex-1" numberOfLines={1}>{item.name}</Text>
                      <View className={`rounded-full px-2 py-0.5 ${item.isActive ? 'bg-green-100' : 'bg-muted'}`}>
                        <Text variant="xs" className={`font-semibold ${item.isActive ? 'text-green-700' : 'text-muted-foreground'}`}>
                          {item.isActive ? 'Activo' : 'Inactivo'}
                        </Text>
                      </View>
                    </View>
                    <Text variant="small" className="mt-0.5 font-semibold text-primary">${item.price}</Text>
                    <View className="mt-2 gap-1">
                      {item.rules.map((rule, i) => (
                        <View key={i} className="flex-row items-center gap-1.5">
                          <View className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          <Text variant="xs" className="text-muted-foreground">
                            {rule.quantity}x {rule.productType}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => { setEditing(item); setShowForm(false); }}
                      className="rounded-lg border border-border p-2"
                    >
                      <Pencil size={16} color="#374151" />
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
        onConfirm={() => {
          if (!toDelete) return;
          deleteCombo.mutate(toDelete.documentId, { onSuccess: () => setToDelete(null) });
        }}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}
