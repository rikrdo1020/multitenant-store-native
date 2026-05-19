import { View } from 'react-native';
import { LogIn } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { AccountHeader } from './AccountHeader';

interface AccountAuthPromptProps {
  onLogin: () => void;
}

export function AccountAuthPrompt({ onLogin }: AccountAuthPromptProps) {
  return (
    <View className="mx-auto w-full max-w-5xl gap-5">
      <AccountHeader />
      <View className="gap-4 rounded-lg border border-border bg-card p-5">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
          <LogIn size={22} color="#171717" />
        </View>
        <View className="gap-1">
          <Text variant="h3">Inicia sesion para ver tu cuenta</Text>
          <Text variant="small">
            Usaremos tu correo para mostrar pedidos y direcciones de esta tienda.
          </Text>
        </View>
        <Button onPress={onLogin}>Iniciar sesion</Button>
      </View>
    </View>
  );
}
