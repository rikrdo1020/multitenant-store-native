import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BannersHeader } from '@/components/admin/banners/BannersHeader';
import { BannersPanel } from '@/components/admin/banners/BannersPanel';
import { BannersStatePanel } from '@/components/admin/banners/BannersStatePanel';
import { BannerFormModal } from '@/components/admin/banners/BannerFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { useAdminBannersScreen } from '@/hooks/use-admin-banners-screen';

export function BannersScreen() {
  const screen = useAdminBannersScreen();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const contentStyle = useMemo(
    () => (isWide ? { maxWidth: 1120, width: '100%' as const } : undefined),
    [isWide],
  );

  if (!screen.tenant) {
    return (
      <ScreenWrapper>
        <BannersStatePanel
          title="No hay tienda seleccionada"
          description="Necesitas seleccionar o crear una tienda para gestionar banners."
          actionLabel="Crear tienda"
          onAction={screen.goToCreateStore}
        />
      </ScreenWrapper>
    );
  }

  if (!screen.canManageBanners) {
    return (
      <ScreenWrapper>
        <BannersStatePanel
          title="Acceso restringido"
          description="Tu rol actual no permite gestionar banners."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <View className="w-full self-center gap-6 p-4 md:p-6" style={contentStyle}>
        <BannersHeader tenantName={screen.tenant.name} isWide={isWide} onCreate={screen.openCreate} />
        <BannersPanel
          banners={screen.banners}
          isLoading={screen.isLoading}
          isError={screen.isError}
          isMutating={screen.isSaving || screen.isRemoving}
          onRefresh={screen.refresh}
          onCreate={screen.openCreate}
          onEdit={screen.openEdit}
          onRemove={screen.openRemoveDialog}
          onToggleActive={screen.toggleActive}
          onMoveUp={screen.moveUp}
          onMoveDown={screen.moveDown}
        />
      </View>
      <BannerFormModal
        visible={screen.formVisible}
        banner={screen.bannerForEdit}
        loading={screen.isSaving}
        onClose={screen.closeForm}
        onSubmit={screen.submitForm}
      />
      <ConfirmDialog
        visible={Boolean(screen.bannerForRemoval)}
        title="Eliminar banner"
        description="Este banner dejara de aparecer en la home de la tienda."
        confirmLabel="Eliminar"
        destructive
        loading={screen.isRemoving}
        onConfirm={screen.confirmRemove}
        onCancel={screen.closeRemoveDialog}
      />
    </ScreenWrapper>
  );
}
