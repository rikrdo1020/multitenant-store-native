import { Controller } from 'react-hook-form';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Settings, Store } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { SlugField } from '@/components/forms/SlugField';
import { useManageStore } from '@/hooks/use-manage-store';
import { useTenantStore } from '@/stores/use-tenant-store';

export default function ManageStoreScreen() {
  const router = useRouter();
  const tenant = useTenantStore((s) => s.tenant);
  const { form, profile, isLoading, logoUri, pickLogo, onSubmit, isPending } = useManageStore();
  const { control, watch, formState: { errors } } = form;
  const nameValue = watch('name');

  if (isLoading || !profile) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  const displayLogo = logoUri ?? profile?.logo ?? null;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(admin)/settings')} className="p-1">
          <ArrowLeft size={22} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="body" className="font-semibold">Editar tienda</Text>
        <TouchableOpacity
          onPress={() => router.push('/(owner)/store-settings')}
          className="p-1"
        >
          <Settings size={22} className="text-foreground" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerClassName="px-6 py-6 gap-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center gap-3 py-2">
          <TouchableOpacity
            onPress={pickLogo}
            className="h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-muted"
          >
            {displayLogo ? (
              <Image source={{ uri: displayLogo }} className="h-28 w-28" resizeMode="cover" />
            ) : (
              <Store size={36} className="text-muted-foreground" />
            )}
          </TouchableOpacity>
          <Text variant="xs" className="text-muted-foreground">Toca el logo para cambiarlo</Text>
        </View>

        {/* Nombre */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre de la tienda"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        {/* Slug */}
        <Controller
          control={control}
          name="slug"
          render={({ field: { onChange, value } }) => (
            <SlugField
              value={value}
              onChangeText={onChange}
              nameValue={nameValue}
              excludeDocumentId={profile.documentId}
              error={errors.slug?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Descripción (opcional)"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ''}
              multiline
              numberOfLines={3}
              error={errors.description?.message}
            />
          )}
        />

        <Button onPress={onSubmit} disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
