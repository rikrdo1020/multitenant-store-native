import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { MembersSectionContent } from '@/components/admin/members/MembersSectionContent';
import { Text } from '@/components/ui/Text';

export interface MembersSectionProps {
  title: string;
  icon: ReactNode;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isRefreshing: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRefresh: () => void;
  children: ReactNode;
}

export function MembersSection(props: MembersSectionProps) {
  return (
    <View className="rounded-lg border border-border bg-card">
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <View className="flex-row items-center gap-2">
          {props.icon}
          <Text className="font-semibold text-foreground">{props.title}</Text>
        </View>
        <Pressable
          onPress={props.onRefresh}
          disabled={props.isRefreshing}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Actualizar ${props.title}`}
        >
          {props.isRefreshing ? (
            <ActivityIndicator size="small" />
          ) : (
            <RefreshCw size={17} className="text-muted-foreground" />
          )}
        </Pressable>
      </View>
      <MembersSectionContent {...props} />
    </View>
  );
}
