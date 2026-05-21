import { Button } from '@/components/ui/Button';
import { StorefrontScreenHeader } from '@/components/storefront/StorefrontScreenHeader';

interface CartHeaderProps {
  itemCount: number;
  onBack: () => void;
  onClear: () => void;
}

export function CartHeader({ itemCount, onBack, onClear }: CartHeaderProps) {
  const subtitle = itemCount === 0
    ? 'Sin productos seleccionados'
    : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'} en tu compra`;

  return (
    <StorefrontScreenHeader
      title="Carrito"
      subtitle={subtitle}
      onBack={onBack}
      rightAction={
        itemCount > 0 ? (
          <Button variant="ghost" size="sm" onPress={onClear}>
            Vaciar
          </Button>
        ) : undefined
      }
    />
  );
}
