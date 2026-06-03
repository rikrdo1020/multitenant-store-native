import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface YappyPreviewProps {
  phone: string;
  name: string;
  storeName: string;
}

export function YappyPreview({ phone, name, storeName }: YappyPreviewProps) {
  return (
    <View className="gap-2">
      <Text variant="small" className="font-medium text-muted-foreground uppercase tracking-wider">
        Vista previa del cliente
      </Text>

      <View className="rounded-2xl border border-border bg-card p-5 gap-4">
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-[#00D1A7]" />
          <Text variant="small" className="font-semibold text-[#00D1A7]">Pago con Yappy</Text>
        </View>

        <View className="gap-1">
          <Text variant="small" className="text-muted-foreground">
            Envía el pago a través de Yappy a:
          </Text>
          <Text variant="body" className="font-bold text-foreground">{name}</Text>
          <Text variant="body" className="font-semibold text-foreground tracking-wide">{phone}</Text>
        </View>

        <View className="rounded-xl bg-muted px-4 py-3">
          <Text variant="small" className="text-muted-foreground">
            En el concepto escribe tu número de orden y envía el comprobante a{' '}
            <Text variant="small" className="font-semibold text-foreground">{storeName}</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}
