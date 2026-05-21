import { Button } from '@/components/ui/Button';
import { StorefrontScreenHeader } from '@/components/storefront/StorefrontScreenHeader';

interface CheckoutHeaderProps {
  compact?: boolean;
  onBack: () => void;
  onCartPress?: () => void;
}

export function CheckoutHeader({ compact = false, onBack, onCartPress }: CheckoutHeaderProps) {
  return (
    <StorefrontScreenHeader
      title="Checkout"
      subtitle={compact ? undefined : 'Datos de envio y resumen final'}
      onBack={onBack}
      rightAction={
        onCartPress ? (
          <Button variant="ghost" size="sm" onPress={onCartPress}>
            Carrito
          </Button>
        ) : undefined
      }
    />
  );
}
