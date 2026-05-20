import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '@/components/ui/Text';
import { PREVIEW_HTML } from '@/lib/rich-text-html';

interface RichTextPreviewProps {
  hasContent: boolean;
  placeholder: string;
  value?: string;
  onPress: () => void;
}

export function RichTextPreview({ hasContent, placeholder, value, onPress }: RichTextPreviewProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="rounded-md border border-border bg-background">
      <View className="p-3">
        {hasContent ? (
          <WebView
            originWhitelist={['*']}
            pointerEvents="none"
            scrollEnabled={false}
            source={{ html: PREVIEW_HTML(value ?? '') }}
            style={{ height: 120 }}
          />
        ) : (
          <Text className="text-muted-foreground">{placeholder}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
