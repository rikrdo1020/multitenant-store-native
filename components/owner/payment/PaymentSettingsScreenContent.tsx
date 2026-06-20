import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { OwnerHeader } from '@/components/owner/OwnerHeader';
import { YappyPreview } from '@/components/owner/YappyPreview';
import { YappySettingsFields } from '@/components/owner/payment/YappySettingsFields';
import { useYappySettingsForm } from '@/hooks/use-yappy-settings-form';
import { useTenantStore } from '@/stores/use-tenant-store';

export function PaymentSettingsScreenContent() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const { form, isPending, onSubmit } = useYappySettingsForm();
  const watchedPhone = form.watch('yappyPhone');
  const watchedName = form.watch('yappyName');
  const hasYappyData = Boolean(watchedPhone && watchedName);

  return (
    <ScreenWrapper>
      <OwnerHeader title="Metodos de pago" onBack={() => router.back()} />
      <ScrollView contentContainerClassName="px-6 py-6 gap-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#00D1A7]/10">
            <Smartphone size={20} color="#00D1A7" />
          </View>
          <View className="flex-1">
            <Text variant="body" className="font-semibold text-foreground">Yappy</Text>
            <Text variant="small" className="text-muted-foreground">Pagos moviles en Panama</Text>
          </View>
        </View>
        <Text variant="small" className="text-muted-foreground -mt-2">
          Ingresa el numero y nombre registrado en tu cuenta Yappy. El cliente vera estos datos para completar el pago.
        </Text>
        <YappySettingsFields form={form} />
        {hasYappyData ? <YappyPreview phone={watchedPhone} name={watchedName} storeName={tenant?.name ?? ''} /> : null}
        <Button onPress={onSubmit} disabled={isPending} className="mt-2">
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
