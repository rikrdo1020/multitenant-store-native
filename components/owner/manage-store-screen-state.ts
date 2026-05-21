import type { ManageStoreScreenViewModel } from '@/hooks/use-manage-store-screen';

export type ManageStoreScreenState =
  | { kind: 'loading' }
  | {
      kind: 'panel';
      title: string;
      description: string;
      actionLabel?: string;
      onAction?: () => void;
      secondaryLabel?: string;
      onSecondaryAction?: () => void;
    };

export function getManageStoreScreenState(
  store: ManageStoreScreenViewModel,
): ManageStoreScreenState | null {
  if (!store.tenant) {
    return {
      kind: 'panel',
      title: 'No hay tienda seleccionada',
      description: 'Selecciona o crea una tienda antes de editar su perfil.',
      actionLabel: 'Volver',
      onAction: store.goBack,
    };
  }

  if (store.isLoading) return { kind: 'loading' };

  if (store.isOwnershipError) {
    return {
      kind: 'panel',
      title: 'No pudimos validar permisos',
      description: 'Necesitamos confirmar si esta cuenta puede editar el perfil de la tienda.',
      actionLabel: 'Reintentar',
      onAction: store.retryOwnership,
      secondaryLabel: 'Volver',
      onSecondaryAction: store.goBack,
    };
  }

  if (!store.canEditStore) {
    return {
      kind: 'panel',
      title: 'Perfil reservado al dueno',
      description: 'Esta cuenta puede operar la tienda, pero el perfil principal solo lo edita el dueno.',
      actionLabel: 'Ir a configuracion',
      onAction: store.goBack,
      secondaryLabel: 'Ver tienda',
      onSecondaryAction: store.goToStorefront,
    };
  }

  if (store.isProfileError || !store.profile) {
    return {
      kind: 'panel',
      title: 'No pudimos cargar la tienda',
      description: 'Revisa la conexion o intenta nuevamente.',
      actionLabel: 'Reintentar',
      onAction: store.retryProfile,
      secondaryLabel: 'Volver',
      onSecondaryAction: store.goBack,
    };
  }

  return null;
}
