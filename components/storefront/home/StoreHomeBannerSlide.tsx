import { Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { StoreBanner } from '@/types';

interface StoreHomeBannerSlideProps {
  banner: StoreBanner;
  width: number;
  onPress: (banner: StoreBanner) => void;
}

export function StoreHomeBannerSlide({
  banner,
  width,
  onPress,
}: StoreHomeBannerSlideProps) {
  return (
    <Pressable
      onPress={() => onPress(banner)}
      className="overflow-hidden rounded-lg border border-border bg-card"
      style={{ width }}
    >
      {banner.imageUrl && (
        <Image
          source={{ uri: banner.imageUrl }}
          className="h-44 w-full bg-muted md:h-64"
          resizeMode="cover"
        />
      )}
      <View className="gap-2 p-5 md:p-6">
        <Text variant="h1" numberOfLines={2}>{banner.title}</Text>
        {banner.subtitle && (
          <Text variant="body" className="text-muted-foreground" numberOfLines={2}>
            {banner.subtitle}
          </Text>
        )}
        {banner.ctaText && (
          <Text className="pt-2 font-semibold text-foreground">{banner.ctaText}</Text>
        )}
      </View>
    </Pressable>
  );
}
