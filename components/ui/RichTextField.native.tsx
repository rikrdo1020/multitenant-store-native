import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { RichTextEditorModal } from '@/components/ui/rich-text/RichTextEditorModal';
import { RichTextPreview } from '@/components/ui/rich-text/RichTextPreview';

interface RichTextFieldProps {
  label?: string;
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextField({
  label,
  value,
  onChange,
  placeholder = 'Toca para agregar descripcion...',
}: RichTextFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const hasContent = !!value && value !== '<p><br></p>';

  const openEditor = () => {
    setDraft(value || '');
    setVisible(true);
  };

  const saveContent = (html: string) => {
    onChange(html);
    setVisible(false);
  };

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text variant="small" className="mb-1 font-medium text-foreground">{label}</Text> : null}
      <RichTextPreview
        hasContent={hasContent}
        placeholder={placeholder}
        value={value}
        onPress={openEditor}
      />
      <RichTextEditorModal
        draft={draft}
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={saveContent}
      />
    </View>
  );
}
