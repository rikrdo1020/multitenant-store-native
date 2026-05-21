import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { ShippingMethodsDashboard } from '@/components/admin/shipping/ShippingMethodsDashboard';
import { ShippingMethodsStatePanel } from '@/components/admin/shipping/ShippingMethodsStatePanel';
import { ShippingMethodFormModal } from '@/components/admin/shipping/ShippingMethodFormModal';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useShippingMethodsScreen } from '@/hooks/use-shipping-methods-screen';

export function ShippingMethodsScreen() {
  const screen = useShippingMethodsScreen();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const contentStyle = useMemo(
    () => (isWide ? { maxWidth: 1120, width: '100%' as const } : undefined),
    [isWide],
  );

  if (!screen.tenant) {
    return (
      <ScreenWrapper>
        <ShippingMethodsStatePanel
          title="No hay tienda seleccionada"
          description="Necesitas seleccionar o crear una tienda para gestionar envios."
          actionLabel="Crear tienda"
          onAction={screen.goToCreateStore}
        />
      </ScreenWrapper>
    );
  }

  if (!screen.canManageShipping) {
    return (
      <ScreenWrapper>
        <ShippingMethodsStatePanel
          title="Acceso restringido"
          description="Tu rol actual no permite gestionar metodos de envio."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <View className="w-full self-center p-4 md:p-6" style={contentStyle}>
        <ShippingMethodsDashboard screen={screen} isWide={isWide} />
      </View>

      <ShippingMethodFormModal
        visible={screen.formVisible}
        method={screen.methodForEdit}
        loading={screen.isSaving}
        onClose={screen.closeForm}
        onSubmit={screen.submitForm}
      />
      <ConfirmDialog
        visible={Boolean(screen.methodForRemoval)}
        title="Eliminar metodo"
        description="Este metodo dejara de estar disponible para nuevas compras."
        confirmLabel="Eliminar"
        destructive
        loading={screen.isRemoving}
        onConfirm={screen.confirmRemove}
        onCancel={screen.closeRemoveDialog}
      />
    </ScreenWrapper>
  );
}
