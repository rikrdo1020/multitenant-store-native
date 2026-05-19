import { Controller } from 'react-hook-form';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Store } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { SlugField } from '@/components/forms/SlugField';
import { useCreateStore } from '@/hooks/use-create-store';

export default function CreateStoreScreen() {
  const { form, logoUri, pickLogo, onSubmit, isPending } = useCreateStore();
  const { control, watch, formState: { errors } } = form;
  const nameValue = watch('name');

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerClassName="px-6 py-8 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text variant="h1">Crear tienda</Text>
          <Text variant="small" className="text-muted-foreground">
            Configura los datos básicos de tu tienda
          </Text>
        </View>

        {/* Logo */}
        <View className="items-start gap-2">
          <Text variant="small" className="font-medium text-foreground">Logo</Text>
          <TouchableOpacity
            onPress={pickLogo}
            className="h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted"
          >
            {logoUri ? (
              <Image source={{ uri: logoUri }} className="h-24 w-24" resizeMode="cover" />
            ) : (
              <Store size={32} className="text-muted-foreground" />
            )}
          </TouchableOpacity>
          <Text variant="xs" className="text-muted-foreground">Toca para subir un logo</Text>
        </View>

        {/* Nombre */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre de la tienda"
              placeholder="Mi Tienda"
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
              placeholder="Breve descripción de tu tienda"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              multiline
              numberOfLines={3}
              error={errors.description?.message}
            />
          )}
        />

        <Button onPress={onSubmit} disabled={isPending}>
          {isPending ? 'Creando...' : 'Crear tienda'}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
