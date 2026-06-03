import { Controller } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft, Smartphone } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { YappyPreview } from '@/components/owner/YappyPreview';
import { useYappySettingsForm } from '@/hooks/use-yappy-settings-form';
import { useTenantStore } from '@/stores/use-tenant-store';

export default function PaymentSettingsScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const { form, isPending, onSubmit } = useYappySettingsForm();
  const { control, watch, formState: { errors } } = form;

  const watchedPhone = watch('yappyPhone');
  const watchedName = watch('yappyName');
  const hasYappyData = Boolean(watchedPhone && watchedName);

  return (
    <ScreenWrapper>
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ArrowLeft size={22} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="body" className="font-semibold">Métodos de pago</Text>
      </View>

      <ScrollView
        contentContainerClassName="px-6 py-6 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Yappy section header */}
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#00D1A7]/10">
            <Smartphone size={20} color="#00D1A7" />
          </View>
          <View className="flex-1">
            <Text variant="body" className="font-semibold text-foreground">Yappy</Text>
            <Text variant="small" className="text-muted-foreground">
              Pagos móviles en Panamá
            </Text>
          </View>
        </View>

        <Text variant="small" className="text-muted-foreground -mt-2">
          Ingresa el número y nombre registrado en tu cuenta Yappy. El cliente verá estos datos para completar el pago.
        </Text>

        <Controller
          control={control}
          name="yappyPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Número Yappy"
              placeholder="6000-0000"
              keyboardType="phone-pad"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.yappyPhone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="yappyName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nombre en Yappy"
              placeholder="Nombre del negocio"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.yappyName?.message}
            />
          )}
        />

        {/* Preview */}
        {hasYappyData && (
          <YappyPreview phone={watchedPhone} name={watchedName} storeName={tenant?.name ?? ''} />
        )}

        <Button onPress={onSubmit} disabled={isPending} className="mt-2">
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}
