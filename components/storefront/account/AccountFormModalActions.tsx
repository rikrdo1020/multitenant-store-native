import { View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface AccountFormModalActionsProps {
  submitLabel: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function AccountFormModalActions({
  submitLabel,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountFormModalActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Button
        variant="outline"
        className="flex-1"
        disabled={isSubmitting}
        onPress={onClose}
      >
        Cancelar
      </Button>
      <Button className="flex-1" loading={isSubmitting} onPress={onSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}
