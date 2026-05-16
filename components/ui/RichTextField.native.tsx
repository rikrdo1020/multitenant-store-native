import { useState, useRef, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from './Text';
import { X, Check } from 'lucide-react-native';

interface RichTextFieldProps {
  label?: string;
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const PREVIEW_HTML = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #111827;
    overflow: hidden;
  }
  p, ul, ol { margin: 0 0 8px 0; }
  ul, ol { padding-left: 20px; }
  b, strong { font-weight: 700; }
  i, em { font-style: italic; }
</style>
</head>
<body>
  ${content || '<p style="color:#9ca3af;font-style:italic;">Sin contenido</p>'}
</body>
</html>
`;

const EDITOR_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #fff;
    color: #111827;
  }
  #toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
  }
  .btn {
    padding: 8px 14px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    -webkit-tap-highlight-color: transparent;
  }
  .btn:active {
    background: #e5e7eb;
  }
  #editor {
    min-height: 300px;
    outline: none;
    line-height: 1.6;
    font-size: 16px;
    color: #111827;
  }
  #editor p { margin: 0 0 12px 0; }
  #editor ul, #editor ol { margin: 0 0 12px 0; padding-left: 24px; }
  #editor li { margin-bottom: 4px; }
  #editor b, #editor strong { font-weight: 700; }
  #editor i, #editor em { font-style: italic; }
</style>
</head>
<body>
  <div id="toolbar">
    <button class="btn" data-cmd="bold" type="button"><b>B</b></button>
    <button class="btn" data-cmd="italic" type="button"><i>I</i></button>
    <button class="btn" data-cmd="insertUnorderedList" type="button">• Lista</button>
    <button class="btn" data-cmd="insertOrderedList" type="button">1. Lista</button>
  </div>
  <div id="editor" contenteditable="true"></div>
  <script>
    const editor = document.getElementById('editor');
    const toolbar = document.getElementById('toolbar');

    toolbar.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      e.preventDefault();
      document.execCommand(btn.dataset.cmd, false, null);
      editor.focus();
    });

    function setInitialContent(html) {
      editor.innerHTML = html || '<p><br></p>';
    }

    function getContent() {
      var html = editor.innerHTML;
      if (html === '<p><br></p>' || html === '<div><br></div>' || html === '<br>') return '';
      return html;
    }

    function post(msg) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      } else {
        window.parent.postMessage(msg, '*');
      }
    }

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'setContent') {
        setInitialContent(e.data.html);
      }
      if (e.data && e.data.type === 'getContent') {
        post({ type: 'content', html: getContent() });
      }
    });

    post({ type: 'ready' });
  </script>
</body>
</html>
`;

export function RichTextField({
  label,
  value,
  onChange,
  placeholder = 'Toca para agregar descripción...',
}: RichTextFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const webviewRef = useRef<WebView>(null);
  const [webviewReady, setWebviewReady] = useState(false);

  const openEditor = () => {
    setDraft(value || '');
    setWebviewReady(false);
    setVisible(true);
  };

  const closeEditor = () => {
    setVisible(false);
    setWebviewReady(false);
  };

  const saveContent = () => {
    if (!webviewRef.current) return;
    webviewRef.current.injectJavaScript(
      `post({ type: 'content', html: getContent() }); true;`
    );
  };

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);

        if (msg.type === 'ready') {
          setWebviewReady(true);
          if (draft && webviewRef.current) {
            const escaped = JSON.stringify(draft);
            webviewRef.current.injectJavaScript(
              `setInitialContent(${escaped}); true;`
            );
          }
        }

        if (msg.type === 'content') {
          const cleanHtml = msg.html || '';
          onChange(cleanHtml);
          closeEditor();
        }
      } catch {
        // ignore malformed messages
      }
    },
    [draft, onChange]
  );

  const hasContent = !!value && value !== '<p><br></p>';

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="small" className="mb-1 font-medium text-foreground">
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={openEditor}
        activeOpacity={0.7}
        className="rounded-md border border-border bg-background"
      >
        <View className="p-3">
          {hasContent ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: PREVIEW_HTML(value) }}
              style={styles.previewWebview}
              scrollEnabled={false}
              pointerEvents="none"
            />
          ) : (
            <Text className="text-muted-foreground">{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditor}
      >
        <View className="flex-1 bg-background">
          <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <TouchableOpacity onPress={closeEditor} className="p-1">
              <X size={24} className="text-foreground" />
            </TouchableOpacity>
            <Text variant="h3" className="font-medium text-foreground">
              Editar descripción
            </Text>
            <TouchableOpacity onPress={saveContent} className="p-1">
              <Check size={24} className="text-primary" />
            </TouchableOpacity>
          </View>

          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: EDITOR_HTML }}
            onMessage={handleMessage}
            style={styles.editorWebview}
            keyboardDisplayRequiresUserAction={false}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  previewWebview: {
    height: 120,
  },
  editorWebview: {
    flex: 1,
  },
});
