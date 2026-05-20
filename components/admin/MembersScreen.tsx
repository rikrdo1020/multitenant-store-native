import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MembersDashboard } from '@/components/admin/members/MembersDashboard';
import { MembersStatePanel } from '@/components/admin/members/MembersStatePanel';
import { EditRoleModal } from '@/components/admin/members/EditRoleModal';
import { InviteMemberModal } from '@/components/admin/members/InviteMemberModal';
import { useMembersScreen } from '@/hooks/use-members-screen';

export function MembersScreen() {
  const screen = useMembersScreen();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const contentStyle = useMemo(
    () => (isWide ? { maxWidth: 1120, width: '100%' as const } : undefined),
    [isWide],
  );

  if (!screen.tenant) {
    return (
      <ScreenWrapper>
        <MembersStatePanel
          title="No hay tienda seleccionada"
          description="Necesitas seleccionar o crear una tienda para gestionar miembros."
          actionLabel="Crear tienda"
          onAction={screen.goToCreateStore}
        />
      </ScreenWrapper>
    );
  }

  if (!screen.canManageMembers) {
    return (
      <ScreenWrapper>
        <MembersStatePanel
          title="Acceso restringido"
          description="Tu rol actual no permite gestionar miembros de la tienda."
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <View className="w-full self-center p-4 md:p-6" style={contentStyle}>
        <MembersDashboard screen={screen} isWide={isWide} />
      </View>

      <InviteMemberModal
        visible={screen.inviteVisible}
        loading={screen.isInviting}
        onClose={screen.closeInvite}
        onSubmit={screen.submitInvite}
      />
      <EditRoleModal
        member={screen.memberForRole}
        loading={screen.isUpdatingRole}
        onClose={screen.closeRoleEditor}
        onSubmit={screen.submitRole}
      />
      <ConfirmDialog
        visible={Boolean(screen.memberForRemoval)}
        title="Eliminar miembro"
        description="Esta persona perdera acceso a la administracion de la tienda."
        confirmLabel="Eliminar"
        destructive
        loading={screen.isRemovingMember}
        onConfirm={screen.confirmRemove}
        onCancel={screen.closeRemoveDialog}
      />
    </ScreenWrapper>
  );
}
