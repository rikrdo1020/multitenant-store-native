import { View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { Order } from '@/types';

interface CheckoutCreatedOrderNoticeProps {
  order: Order;
}

export function CheckoutCreatedOrderNotice({ order }: CheckoutCreatedOrderNoticeProps) {
  return (
    <View className="gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
      <View className="flex-row items-center gap-2">
        <CheckCircle2 size={18} color="#15803d" />
        <Text className="font-semibold text-green-800">
          Orden creada: {order.orderId}
        </Text>
      </View>
      <Text variant="small" className="text-green-800">
        La orden quedo pendiente de pago para el siguiente paso del flujo.
      </Text>
    </View>
  );
}
