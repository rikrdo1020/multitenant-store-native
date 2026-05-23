import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  useCatalogBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '@/hooks/api/use-catalog-brands';
import { useUploadImage } from '@/hooks/api/use-upload-image';
import type { Brand } from '@/types';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '@/lib/theme';

const brandSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  logo: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  initial?: Partial<BrandFormValues>;
  onSubmit: (values: BrandFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function BrandForm({ initial, onSubmit, onCancel, submitting }: BrandFormProps) {
  const uploadImage = useUploadImage();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: initial?.name ?? '',
      logo: initial?.logo ?? '',
    },
  });

  const logoUrl = watch('logo');

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    uploadImage.mutate({ fileUri: uri, folder: 'brands' }, {
      onSuccess: (data) => setValue('logo', data.url),
    });
  };

  return (
    <View className="rounded-xl border border-border bg-background p-4">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nombre"
            placeholder="Ej: Nike"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Text variant="small" className="mb-1 font-medium text-foreground">Logo</Text>
      <View className="mb-3 flex-row items-center gap-3">
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            className="h-16 w-16 rounded-lg border border-border"
            resizeMode="contain"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
            <ImageIcon size={24} color={colors.mutedForeground} />
          </View>
        )}
        <Button
          variant="outline"
          size="sm"
          onPress={pickLogo}
          loading={uploadImage.isPending}
        >
          {logoUrl ? 'Cambiar logo' : 'Subir logo'}
        </Button>
      </View>

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

export function BrandsTab() {
  const { data: brands = [], isLoading, isRefetching, refetch, error } = useCatalogBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [toDelete, setToDelete] = useState<Brand | null>(null);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  const handleCreate = (values: BrandFormValues) => {
    createBrand.mutate(values, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleUpdate = (values: BrandFormValues) => {
    if (!editing) return;
    updateBrand.mutate({ id: editing.documentId, payload: values }, {
      onSuccess: () => setEditing(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteBrand.mutate(toDelete.documentId, {
      onSuccess: () => setToDelete(null),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
        <Text variant="small" className="mt-3">Cargando marcas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Text variant="body" className="text-destructive mb-4 text-center">Error al cargar marcas</Text>
        <Button onPress={() => refetch()}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text variant="small" className="text-muted-foreground">{brands.length} marcas</Text>
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
          <BrandForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={createBrand.isPending}
          />
        </View>
      )}

      <FlatList
        data={brands}
        keyExtractor={(item) => item.documentId}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
        renderItem={({ item }) => (
          <>
            {editing?.documentId === item.documentId ? (
              <View className="mb-1">
                <BrandForm
                  initial={{ name: item.name, logo: item.logo }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditing(null)}
                  submitting={updateBrand.isPending}
                />
              </View>
            ) : (
              <View className="flex-row items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  {item.logo ? (
                    <Image
                      source={{ uri: item.logo }}
                      className="h-10 w-10 rounded-lg border border-border"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <ImageIcon size={18} color={colors.mutedForeground} />
                    </View>
                  )}
                  <Text variant="body" className="font-medium flex-1" numberOfLines={1}>{item.name}</Text>
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
            <Text variant="body" className="text-muted-foreground">No hay marcas aún.</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={!!toDelete}
        title="Eliminar marca"
        description={`¿Eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        loading={deleteBrand.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}
