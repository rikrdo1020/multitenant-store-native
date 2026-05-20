import { ActivityIndicator, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { MembersSectionProps } from '@/components/admin/members/MembersSection';

export function MembersSectionContent(props: MembersSectionProps) {
  if (props.isLoading) {
    return (
      <View className="items-center justify-center gap-3 py-14">
        <ActivityIndicator size="large" />
        <Text variant="small">Cargando...</Text>
      </View>
    );
  }

  if (props.isError) {
    return (
      <View className="items-center gap-4 px-5 py-12">
        <Text variant="h3" className="text-center text-destructive">
          Error al cargar
        </Text>
        <Text variant="small" className="text-center">
          No pudimos cargar esta informacion. Intenta de nuevo.
        </Text>
      </View>
    );
  }

  if (!props.isEmpty) return props.children;

  return (
    <View className="items-center gap-4 px-5 py-12">
      <Text variant="h3" className="text-center">
        {props.emptyTitle}
      </Text>
      <Text variant="small" className="text-center">
        {props.emptyDescription}
      </Text>
      {props.emptyActionLabel && props.onEmptyAction && (
        <Button onPress={props.onEmptyAction}>{props.emptyActionLabel}</Button>
      )}
    </View>
  );
}
