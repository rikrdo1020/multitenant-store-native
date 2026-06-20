import { Button } from '@/components/ui/Button';

interface CartSummaryActionButtonProps {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function CartSummaryActionButton({
  label,
  disabled,
  loading,
  onPress,
}: CartSummaryActionButtonProps) {
  if (!label || !onPress) return null;

  return (
    <Button size="lg" onPress={onPress} disabled={disabled} loading={loading}>
      {label}
    </Button>
  );
}
