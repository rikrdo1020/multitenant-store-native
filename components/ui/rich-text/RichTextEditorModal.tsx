import { useCallback, useRef } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Check, X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { EDITOR_HTML } from '@/lib/rich-text-html';

interface RichTextEditorModalProps {
  draft: string;
  visible: boolean;
  onClose: () => void;
  onSave: (html: string) => void;
}

export function RichTextEditorModal({ draft, visible, onClose, onSave }: RichTextEditorModalProps) {
  const webviewRef = useRef<WebView>(null);

  const saveContent = () => {
    webviewRef.current?.injectJavaScript("post({ type: 'content', html: getContent() }); true;");
  };

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type?: string; html?: string };

      if (message.type === 'ready' && draft && webviewRef.current) {
        webviewRef.current.injectJavaScript(`setInitialContent(${JSON.stringify(draft)}); true;`);
      }

      if (message.type === 'content') {
        onSave(message.html ?? '');
      }
    } catch {
      // Ignore malformed editor messages.
    }
  }, [draft, onSave]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text variant="h3" className="font-medium text-foreground">Editar descripcion</Text>
          <TouchableOpacity onPress={saveContent} className="p-1">
            <Check size={24} className="text-primary" />
          </TouchableOpacity>
        </View>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: EDITOR_HTML }}
          onMessage={handleMessage}
          style={{ flex: 1 }}
          keyboardDisplayRequiresUserAction={false}
        />
      </View>
    </Modal>
  );
}
