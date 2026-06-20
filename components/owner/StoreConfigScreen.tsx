import { ActivityIndicator, ScrollView, View } from 'react-native';
import { CreditCard, Store } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { OwnerHeader } from '@/components/owner/OwnerHeader';
import { StoreConfigNavSection } from '@/components/owner/store-config/StoreConfigNavSection';
import { StoreOperationsCard } from '@/components/owner/store-config/StoreOperationsCard';
import { useStoreConfigScreen } from '@/hooks/use-store-config-screen';

export function StoreConfigScreen() {
  const { tenant, settingsForm, goBack, goToManageStore, goToPaymentSettings } =
    useStoreConfigScreen();
  const { form, isLoading, isPending, onSubmit } = settingsForm;
  const yappyConfigured = Boolean(tenant?.yappyPhone && tenant?.yappyName);
  const paymentSubtitle = yappyConfigured
    ? `Yappy: ${tenant!.yappyPhone}`
    : 'Sin metodo de pago configurado';
  const profileSubtitle = tenant
    ? `${tenant.name} - ${tenant.slug}`
    : 'Sin tienda seleccionada';

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <OwnerHeader title="Configurar tienda" onBack={goBack} />
      <ScrollView contentContainerClassName="gap-6 px-4 py-6 pb-10" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StoreConfigNavSection label="Identidad" icon={Store} title="Perfil de tienda" subtitle={profileSubtitle} onPress={goToManageStore} />
        <StoreOperationsCard form={form} isPending={isPending} onSubmit={onSubmit} />
        <StoreConfigNavSection label="Pagos" icon={CreditCard} title="Metodos de pago" subtitle={paymentSubtitle} onPress={goToPaymentSettings} />
      </ScrollView>
    </ScreenWrapper>
  );
}
