import { Controller } from 'react-hook-form';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { ImagePlus } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useOnboardingProduct } from '@/hooks/use-onboarding-product';

export default function OnboardingProductScreen() {
  const { form, imageUri, pickImage, isPending, onSubmit, skip } = useOnboardingProduct();
  const { control, formState: { errors } } = form;

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerClassName="px-6 py-8 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OnboardingProgress currentStep={2} totalSteps={3} />

        <View className="gap-1">
          <Text variant="h1">Agrega tu primer producto</Text>
          <Text variant="small" className="text-muted-foreground">
            Puedes completar los detalles más tarde desde el panel.
          </Text>
        </View>

        {/* Imagen */}
        <View className="gap-2">
          <Text variant="small" className="font-medium text-foreground">Imagen</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="h-36 w-36" resizeMode="cover" />
            ) : (
              <View className="items-center gap-2">
                <ImagePlus size={28} color="#9ca3af" />
                <Text variant="xs" className="text-muted-foreground">Subir imagen</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre del producto"
              placeholder="Ej: Camiseta básica blanca"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Descripción (opcional)"
              placeholder="Breve descripción del producto"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value ?? ''}
              multiline
              numberOfLines={3}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Precio"
              placeholder="0.00"
              keyboardType="decimal-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined ? String(value) : ''}
              error={errors.price?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="stock"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Stock inicial (opcional)"
              placeholder="0"
              keyboardType="number-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value !== undefined ? String(value) : ''}
              error={errors.stock?.message}
            />
          )}
        />

        <View className="gap-3 pt-2">
          <Button onPress={onSubmit} loading={isPending} className="rounded-sm">
            Guardar y continuar
          </Button>
          <Button variant="ghost" onPress={skip} disabled={isPending} className="rounded-sm">
            <Text className="text-muted-foreground text-sm">Saltar por ahora</Text>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
