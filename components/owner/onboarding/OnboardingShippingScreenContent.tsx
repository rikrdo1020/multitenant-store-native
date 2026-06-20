import { ScrollView, View } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingShippingFields } from '@/components/owner/onboarding/OnboardingShippingFields';
import { OnboardingShippingTypeSelector } from '@/components/owner/onboarding/OnboardingShippingTypeSelector';
import { useOnboardingShipping } from '@/hooks/use-onboarding-shipping';

export function OnboardingShippingScreenContent() {
  const shipping = useOnboardingShipping();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerClassName="px-6 py-8 gap-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <OnboardingProgress currentStep={3} totalSteps={3} />
        <View className="gap-1">
          <Text variant="h1">Configura el envio</Text>
          <Text variant="small" className="text-muted-foreground">
            Define como entregas tus pedidos. Puedes agregar mas metodos despues.
          </Text>
        </View>
        <OnboardingShippingFields form={shipping.form} />
        <OnboardingShippingTypeSelector form={shipping.form} />
        <View className="gap-3 pt-2">
          <Button onPress={shipping.onSubmit} loading={shipping.isPending} className="rounded-sm">
            Guardar y finalizar
          </Button>
          <Button variant="ghost" onPress={shipping.skip} disabled={shipping.isPending} className="rounded-sm">
            <Text className="text-muted-foreground text-sm">Saltar por ahora</Text>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
