import { View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface MemberModalActionsProps {
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export function MemberModalActions({
  loading,
  submitLabel,
  onCancel,
  onSubmit,
}: MemberModalActionsProps) {
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
