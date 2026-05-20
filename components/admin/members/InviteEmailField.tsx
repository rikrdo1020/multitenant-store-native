import { Platform, type TextStyle } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { InviteMemberFormData } from '@/lib/validators';

const webFocusStyle = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
  : undefined;

interface InviteEmailFieldProps {
  control: Control<InviteMemberFormData>;
  error?: string;
  loading: boolean;
}

export function InviteEmailField({ control, error, loading }: InviteEmailFieldProps) {
  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Correo electronico"
          placeholder="persona@correo.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          style={webFocusStyle}
          error={error}
          editable={!loading}
        />
      )}
    />
  );
}
