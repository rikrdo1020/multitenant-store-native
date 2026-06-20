import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { StoreHomeBannerSlide } from './StoreHomeBannerSlide';
import type { StoreBanner, Tenant } from '@/types';

interface StoreHomeHeroProps {
  banners: StoreBanner[];
  tenant?: Tenant;
  width: number;
  onBannerPress: (banner: StoreBanner) => void;
  onViewProducts: () => void;
}

export function StoreHomeHero({
  banners,
  tenant,
  width,
  onBannerPress,
  onViewProducts,
}: StoreHomeHeroProps) {
  const heroWidth = Math.min(width - 32, 1088);

  if (banners.length > 0) {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {banners.map((banner) => (
          <StoreHomeBannerSlide
            key={banner.documentId}
            banner={banner}
            width={heroWidth}
            onPress={onBannerPress}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="rounded-lg border border-border bg-card p-5 md:p-6">
      <View className="gap-3">
        <Text variant="h1">{tenant?.name ?? 'Tienda'}</Text>
        {tenant?.description && (
          <Text variant="body" className="max-w-3xl text-muted-foreground">
            {tenant.description}
          </Text>
        )}
        <Button className="mt-2 self-start" onPress={onViewProducts}>
          Ver productos
        </Button>
      </View>
    </View>
  );
}
