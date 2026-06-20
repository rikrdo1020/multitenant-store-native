import { ActivityIndicator, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { BannerRow } from './BannerRow';
import type { StoreBanner } from '@/types';

interface BannersPanelProps {
  banners: StoreBanner[];
  isLoading: boolean;
  isError: boolean;
  isMutating: boolean;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (banner: StoreBanner) => void;
  onRemove: (banner: StoreBanner) => void;
  onToggleActive: (banner: StoreBanner) => void;
  onMoveUp: (banner: StoreBanner) => void;
  onMoveDown: (banner: StoreBanner) => void;
}

export function BannersPanel({
  banners,
  isLoading,
  isError,
  isMutating,
  onRefresh,
  onCreate,
  onEdit,
  onRemove,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: BannersPanelProps) {
  if (isLoading) return <ActivityIndicator className="my-8" />;

  if (isError) {
    return (
      <View className="items-center gap-4 rounded-lg border border-border bg-card p-6">
        <Text variant="h3">No pudimos cargar los banners</Text>
        <Button variant="outline" onPress={onRefresh}>Reintentar</Button>
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View className="items-center gap-4 rounded-lg border border-border bg-card p-6">
        <Text variant="h3">Aun no hay banners</Text>
        <Text variant="body" className="text-center text-muted-foreground">
          Crea el primer banner para destacar promociones o novedades.
        </Text>
        <Button onPress={onCreate}>Crear banner</Button>
      </View>
    );
  }

  return (
    <View className="overflow-hidden rounded-lg border border-border bg-card">
      <View className="p-4">
        <Text variant="h3">Banners de portada</Text>
      </View>
      {banners.map((banner, index) => (
        <BannerRow
          key={banner.documentId}
          banner={banner}
          isFirst={index === 0}
          isLast={index === banners.length - 1}
          disabled={isMutating}
          onEdit={onEdit}
          onRemove={onRemove}
          onToggleActive={onToggleActive}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </View>
  );
}
