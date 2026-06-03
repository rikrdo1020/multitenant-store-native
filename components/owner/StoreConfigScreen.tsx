import { Controller } from 'react-hook-form';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Store,
  type LucideIcon,
} from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { adminColors } from '@/lib/admin-theme';
import { useStoreConfigScreen } from '@/hooks/use-store-config-screen';

const CURRENCY_OPTIONS = [
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Guaraní (PYG)', value: 'PYG' },
  { label: 'Peso colombiano (COP)', value: 'COP' },
  { label: 'Peso mexicano (MXN)', value: 'MXN' },
  { label: 'Sol peruano (PEN)', value: 'PEN' },
  { label: 'Peso argentino (ARS)', value: 'ARS' },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <Text variant="xs" className="px-1 font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
    </Text>
  );
}

interface NavRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function NavRow({ icon: Icon, title, subtitle, onPress }: NavRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-4 py-4"
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-muted">
        <Icon size={18} color={adminColors.foreground} />
      </View>
      <View className="flex-1">
        <Text variant="small" className="font-semibold text-foreground leading-tight">
          {title}
        </Text>
        <Text variant="xs" className="mt-0.5 text-muted-foreground" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={16} color={adminColors.mutedForeground} />
    </TouchableOpacity>
  );
}

export function StoreConfigScreen() {
  const { tenant, settingsForm, goBack, goToManageStore, goToPaymentSettings } =
    useStoreConfigScreen();
  const { form, isLoading, isPending, onSubmit } = settingsForm;
  const { control, formState: { errors } } = form;

  const yappyConfigured = Boolean(tenant?.yappyPhone && tenant?.yappyName);
  const paymentSubtitle = yappyConfigured
    ? `Yappy: ${tenant!.yappyPhone}`
    : 'Sin método de pago configurado';

  const profileSubtitle =
    tenant ? `${tenant.name} · ${tenant.slug}` : 'Sin tienda seleccionada';

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
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-4">
        <TouchableOpacity onPress={goBack} className="p-1">
          <ArrowLeft size={22} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="body" className="font-semibold">Configurar tienda</Text>
      </View>

      <ScrollView
        contentContainerClassName="gap-6 px-4 py-6 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* IDENTIDAD */}
        <View className="gap-2">
          <SectionLabel label="Identidad" />
          <NavRow
            icon={Store}
            title="Perfil de tienda"
            subtitle={profileSubtitle}
            onPress={goToManageStore}
          />
        </View>

        {/* OPERACIONES */}
        <View className="gap-2">
          <SectionLabel label="Operaciones" />
          <View className="rounded-xl border border-border bg-card px-4 py-5 gap-4">
            <Controller
              control={control}
              name="currency"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Moneda"
                  value={value}
                  options={CURRENCY_OPTIONS}
                  onValueChange={onChange}
                  error={errors.currency?.message}
                />
              )}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="taxRate"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="IVA (%)"
                      placeholder="0"
                      keyboardType="decimal-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={String(value)}
                      error={errors.taxRate?.message}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="lowStockThreshold"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Stock bajo"
                      placeholder="5"
                      keyboardType="number-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={String(value)}
                      error={errors.lowStockThreshold?.message}
                    />
                  )}
                />
              </View>
            </View>
            <Button onPress={onSubmit} disabled={isPending} variant="outline">
              {isPending ? 'Guardando...' : 'Guardar operaciones'}
            </Button>
          </View>
        </View>

        {/* PAGOS */}
        <View className="gap-2">
          <SectionLabel label="Pagos" />
          <NavRow
            icon={CreditCard}
            title="Métodos de pago"
            subtitle={paymentSubtitle}
            onPress={goToPaymentSettings}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
