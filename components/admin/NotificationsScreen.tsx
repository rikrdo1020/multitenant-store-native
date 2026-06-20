import { FlatList, RefreshControl, Text, View } from 'react-native';
import { NotificationItem } from '@/components/admin/NotificationItem';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import type { AppNotification } from '@/types';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  onOpen: (notification: AppNotification) => void;
}

export function NotificationsScreen({
  notifications,
  unreadCount,
  isLoading,
  onRefresh,
  onOpen,
}: NotificationsScreenProps) {
  return (
    <ScreenWrapper safeArea={false}>
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-foreground">Notificaciones</Text>
        {unreadCount > 0 && (
          <View className="bg-primary rounded-full px-2 py-0.5">
            <Text className="text-xs text-primary-foreground font-medium">
              {unreadCount} sin leer
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.documentId}
        renderItem={({ item }) => <NotificationItem item={item} onPress={onOpen} />}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-muted-foreground text-sm">No hay notificaciones</Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </ScreenWrapper>
  );
}
