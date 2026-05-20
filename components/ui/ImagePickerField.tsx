import { View, TouchableOpacity, Image, FlatList } from 'react-native';
import { Text } from './Text';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react-native';

interface ImagePickerFieldProps {
  label?: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  onPickImage: () => void;
  uploading?: boolean;
  error?: string;
}

export function ImagePickerField({
  label,
  images,
  onImagesChange,
  onPickImage,
  uploading,
  error,
}: ImagePickerFieldProps) {
  const removeImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onImagesChange(next);
  };

  return (
    <View className="mb-3">
      {label && (
        <Text variant="small" className="mb-1 font-medium text-foreground">
          {label}
        </Text>
      )}
      <FlatList
        data={images}
        horizontal
        keyExtractor={(_, i) => `${i}`}
        ListHeaderComponent={
          <TouchableOpacity
            onPress={onPickImage}
            disabled={uploading}
            className={cn(
              'mr-2 h-24 w-24 items-center justify-center rounded-md border-2 border-dashed border-border bg-muted',
              uploading && 'opacity-50'
            )}
          >
            <Plus size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        }
        renderItem={({ item, index }) => (
          <View className="relative mr-2">
            <Image
              source={{ uri: item }}
              className="h-24 w-24 rounded-md"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              className="absolute -right-1 -top-1 rounded-full bg-destructive p-1"
            >
              <X size={12} className="text-destructive-foreground" />
            </TouchableOpacity>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {error && (
        <Text variant="xs" className="mt-1 text-destructive">
          {error}
        </Text>
      )}
    </View>
  );
}
