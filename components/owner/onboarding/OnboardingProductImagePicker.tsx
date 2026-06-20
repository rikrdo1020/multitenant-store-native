import { Image, TouchableOpacity, View } from 'react-native';
import { ImagePlus } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';

interface OnboardingProductImagePickerProps {
  imageUri: string | null;
  onPickImage: () => void;
}

export function OnboardingProductImagePicker({
  imageUri,
  onPickImage,
}: OnboardingProductImagePickerProps) {
  return (
    <View className="gap-2">
      <Text variant="small" className="font-medium text-foreground">
        Imagen
      </Text>
      <TouchableOpacity
        onPress={onPickImage}
        className="h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="h-36 w-36" resizeMode="cover" />
        ) : (
          <View className="items-center gap-2">
            <ImagePlus size={28} color="#9ca3af" />
            <Text variant="xs" className="text-muted-foreground">
              Subir imagen
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
