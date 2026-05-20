import { View } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface MembersHeaderProps {
  tenantName: string;
  isWide: boolean;
  onInvite: () => void;
}

export function MembersHeader({ tenantName, isWide, onInvite }: MembersHeaderProps) {
  return (
    <View className={cn('gap-4', isWide && 'flex-row items-center justify-between')}>
      <View className="min-w-0 flex-1">
        <Text variant="h1">Miembros</Text>
        <Text variant="small" className="mt-1">
          Gestiona quienes pueden operar {tenantName}.
        </Text>
      </View>

      <Button
        onPress={onInvite}
        className="flex-row gap-2 rounded-sm"
        accessibilityLabel="Invitar miembro"
      >
        <View className="flex-row items-center gap-2">
          <UserPlus size={18} color="#ffffff" />
          <Text className="font-semibold text-primary-foreground">
            Invitar miembro
          </Text>
        </View>
      </Button>
    </View>
  );
}
