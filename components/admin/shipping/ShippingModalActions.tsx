import { View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface ShippingModalActionsProps {
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ShippingModalActions({
  loading,
  submitLabel,
  onCancel,
  onSubmit,
}: ShippingModalActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Button variant="outline" className="flex-1" disabled={loading} onPress={onCancel}>
        Cancelar
      </Button>
      <Button className="flex-1" loading={loading} onPress={onSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}
