import { useLocalSearchParams } from 'expo-router';
import { AdminOrderDetailScreen } from '@/components/admin/orders/AdminOrderDetailScreen';

export default function AdminOrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <AdminOrderDetailScreen orderId={id} />;
}
