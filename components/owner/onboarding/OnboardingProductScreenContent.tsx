import { ScrollView, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingProductFields } from '@/components/owner/onboarding/OnboardingProductFields';
import { OnboardingProductImagePicker } from '@/components/owner/onboarding/OnboardingProductImagePicker';
import { useOnboardingProduct } from '@/hooks/use-onboarding-product';

export function OnboardingProductScreenContent() {
  const product = useOnboardingProduct();

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
            Puedes completar los detalles mas tarde desde el panel.
          </Text>
        </View>
        <OnboardingProductImagePicker
          imageUri={product.imageUri}
          onPickImage={product.pickImage}
        />
        <OnboardingProductFields form={product.form} />
        <View className="gap-3 pt-2">
          <Button onPress={product.onSubmit} loading={product.isPending} className="rounded-sm">
            Guardar y continuar
          </Button>
          <Button variant="ghost" onPress={product.skip} disabled={product.isPending} className="rounded-sm">
            <Text className="text-muted-foreground text-sm">Saltar por ahora</Text>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
