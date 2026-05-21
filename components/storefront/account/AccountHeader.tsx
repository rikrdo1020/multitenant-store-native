import { StorefrontScreenHeader } from '@/components/storefront/StorefrontScreenHeader';

interface AccountHeaderProps {
  canOpenAdminPanel?: boolean;
  onOpenAdminPanel?: () => void;
}

export function AccountHeader({
  canOpenAdminPanel = false,
  onOpenAdminPanel,
}: AccountHeaderProps) {
  return (
    <StorefrontScreenHeader
      title="Mi cuenta"
      subtitle="Gestiona tu perfil, direcciones y pedidos de esta tienda."
      onBack={canOpenAdminPanel ? onOpenAdminPanel : undefined}
      backAccessibilityLabel="Volver al panel de tienda"
    />
  );
}
