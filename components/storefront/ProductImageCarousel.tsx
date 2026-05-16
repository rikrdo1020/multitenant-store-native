import { useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  useWindowDimensions,
} from 'react-native';
import { ImageIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const carouselWidth = width;

  if (images.length === 0) {
    return (
      <View className="h-96 items-center justify-center bg-secondary">
        <ImageIcon size={44} color="#737373" />
        <Text variant="small" className="mt-3">Sin imagen</Text>
      </View>
    );
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
    setActiveIndex(nextIndex);
  };

  return (
    <View className="bg-secondary">
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width: carouselWidth }} className="h-96 bg-secondary">
            <Image
              source={{ uri: item }}
              accessibilityLabel={productName}
              className="h-full w-full"
              resizeMode="contain"
            />
          </View>
        )}
      />

      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
          {images.map((image, index) => (
            <View
              key={`${image}-${index}-dot`}
              className={cn(
                'h-2 rounded-full',
                index === activeIndex ? 'w-6 bg-foreground' : 'w-2 bg-background',
              )}
            />
          ))}
        </View>
      )}
    </View>
  );
}
