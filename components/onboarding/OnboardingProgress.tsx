import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

const STEP_LABELS = ['Crea tu tienda', 'Agrega productos', 'Métodos de envío'];

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <View className="gap-3">
      <Text variant="xs" className="text-muted-foreground tracking-widest uppercase">
        Paso {currentStep} de {totalSteps}
      </Text>
      <View className="flex-row items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const done = step < currentStep;
          const active = step === currentStep;
          return (
            <View key={step} className="flex-row items-center gap-2 flex-1">
              <View
                className={`h-7 w-7 items-center justify-center rounded-full border ${
                  done
                    ? 'bg-foreground border-foreground'
                    : active
                    ? 'border-foreground bg-background'
                    : 'border-border bg-background'
                }`}
              >
                {done ? (
                  <Check size={13} color="#fff" strokeWidth={3} />
                ) : (
                  <Text
                    className={`text-xs font-bold ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {step}
                  </Text>
                )}
              </View>
              <Text
                variant="xs"
                className={`flex-1 ${active ? 'text-foreground font-medium' : done ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}
                numberOfLines={1}
              >
                {label}
              </Text>
              {step < totalSteps && (
                <View className={`h-px w-3 ${done ? 'bg-foreground' : 'bg-border'}`} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
