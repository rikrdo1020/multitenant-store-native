import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  useBanners,
  useCreateBanner,
  useDeleteBanner,
  useUpdateBanner,
} from '@/hooks/api/use-banners';
import { showToast } from '@/lib/toast';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ApiError, StoreBanner, StoreBannerPayload } from '@/types';

type FormResult = Promise<string | null>;

export function useAdminBannersScreen() {
  const router = useRouter();
  const { tenant } = useTenantStore();
  const { user } = useAuthStore();
  const canManageBanners = user?.role === 'admin' || user?.role === 'superadmin';
  const bannersQuery = useBanners(canManageBanners);
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [formVisible, setFormVisible] = useState(false);
  const [bannerForEdit, setBannerForEdit] = useState<StoreBanner | null>(null);
  const [bannerForRemoval, setBannerForRemoval] = useState<StoreBanner | null>(null);

  const banners = useMemo(
    () => [...(bannersQuery.data ?? [])].sort((a, b) => a.order - b.order),
    [bannersQuery.data],
  );

  const openCreate = () => {
    setBannerForEdit(null);
    setFormVisible(true);
  };

  const openEdit = (banner: StoreBanner) => {
    setBannerForEdit(banner);
    setFormVisible(true);
  };

  const closeForm = () => {
    if (createBanner.isPending || updateBanner.isPending) return;
    setFormVisible(false);
    setBannerForEdit(null);
  };

  const submitForm = async (payload: StoreBannerPayload): FormResult => {
    try {
      if (bannerForEdit) {
        await updateBanner.mutateAsync({ id: bannerForEdit.documentId, payload });
        showToast('Banner actualizado', 'success', payload.title);
      } else {
        await createBanner.mutateAsync(payload);
        showToast('Banner creado', 'success', payload.title);
      }

      setFormVisible(false);
      setBannerForEdit(null);
      return null;
    } catch (error) {
      return getBannerErrorMessage(error);
    }
  };

  const confirmRemove = async () => {
    if (!bannerForRemoval) return;

    try {
      await deleteBanner.mutateAsync(bannerForRemoval.documentId);
      showToast('Banner eliminado', 'success', bannerForRemoval.title);
      setBannerForRemoval(null);
    } catch (error) {
      showToast('No pudimos eliminar el banner', 'destructive', getBannerErrorMessage(error));
    }
  };

  const toggleActive = async (banner: StoreBanner) => {
    const nextActive = !banner.active;

    try {
      await updateBanner.mutateAsync({
        id: banner.documentId,
        payload: { active: nextActive },
      });
      showToast(
        nextActive ? 'Banner activado' : 'Banner pausado',
        'success',
        banner.title,
      );
    } catch (error) {
      showToast('No pudimos actualizar el banner', 'destructive', getBannerErrorMessage(error));
    }
  };

  const moveBanner = async (banner: StoreBanner, direction: -1 | 1) => {
    const currentIndex = banners.findIndex((item) => item.documentId === banner.documentId);
    const target = banners[currentIndex + direction];
    if (!target) return;

    try {
      await Promise.all([
        updateBanner.mutateAsync({ id: banner.documentId, payload: { order: target.order } }),
        updateBanner.mutateAsync({ id: target.documentId, payload: { order: banner.order } }),
      ]);
      showToast('Orden actualizado', 'success', 'La portada usara el nuevo orden.');
    } catch (error) {
      showToast('No pudimos reordenar los banners', 'destructive', getBannerErrorMessage(error));
    }
  };

  return {
    tenant,
    canManageBanners,
    banners,
    isLoading: bannersQuery.isLoading,
    isRefreshing: bannersQuery.isFetching,
    isError: Boolean(bannersQuery.error),
    isSaving: createBanner.isPending || updateBanner.isPending,
    isRemoving: deleteBanner.isPending,
    formVisible,
    bannerForEdit,
    bannerForRemoval,
    goToCreateStore: () => router.push('/(owner)/create-store'),
    refresh: () => void bannersQuery.refetch(),
    openCreate,
    openEdit,
    closeForm,
    submitForm,
    openRemoveDialog: setBannerForRemoval,
    closeRemoveDialog: () => setBannerForRemoval(null),
    confirmRemove,
    toggleActive,
    moveUp: (banner: StoreBanner) => void moveBanner(banner, -1),
    moveDown: (banner: StoreBanner) => void moveBanner(banner, 1),
  };
}

function getBannerErrorMessage(error: unknown) {
  const apiError = error as Partial<ApiError>;
  return apiError.message ?? 'No pudimos guardar el banner.';
}

export type AdminBannersViewModel = ReturnType<typeof useAdminBannersScreen>;
