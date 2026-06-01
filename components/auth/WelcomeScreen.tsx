import { View } from 'react-native';
import { ArrowRight, LayoutDashboard, ListChecks } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useWelcomeScreen } from '@/hooks/use-welcome-screen';

const STEPS = [
  'Crea tu tienda',
  'Agrega tus productos',
  'Configura métodos de envío',
];

export function WelcomeScreen() {
  const { completing, goToChecklist, goToDashboard } = useWelcomeScreen();

  return (
    <ScreenWrapper scroll={false} safeArea>
      <View className="flex-1 px-6 pt-14 pb-10">

        {/* Label */}
        <View className="self-start mb-10">
          <Text className="text-[11px] tracking-[3px] uppercase text-muted-foreground font-medium">
            Bienvenido
          </Text>
        </View>

        {/* Headline */}
        <View className="gap-4 mb-12">
          <Text className="text-[44px] font-bold leading-[1.0] text-foreground">
            Tu tienda está lista.{'\n'}Empieza a vender{'\n'}en 3 pasos.
          </Text>
          <View className="h-[2px] w-10 bg-foreground" />
        </View>

        {/* Steps */}
        <View className="gap-4 mb-auto">
          {STEPS.map((step, i) => (
            <View key={i} className="flex-row items-center gap-4">
              <View className="h-8 w-8 items-center justify-center rounded-full border border-border">
                <Text className="text-xs font-bold text-foreground">{i + 1}</Text>
              </View>
              <Text className="text-sm text-foreground flex-1">{step}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View className="gap-3 mt-12">
          <Button
            size="lg"
            onPress={goToChecklist}
            loading={completing}
            className="rounded-sm"
            accessibilityLabel="Comenzar configuración"
          >
            <View className="flex-row items-center gap-2">
              <ListChecks size={18} color="#fff" />
              <Text className="font-semibold text-primary-foreground">Comenzar configuración</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onPress={goToDashboard}
            disabled={completing}
            className="rounded-sm"
            accessibilityLabel="Ir al dashboard"
          >
            <View className="flex-row items-center gap-2">
              <LayoutDashboard size={18} color="#000" />
              <Text className="font-semibold text-foreground">Ir al dashboard</Text>
            </View>
          </Button>
        </View>

      </View>
    </ScreenWrapper>
  );
}
