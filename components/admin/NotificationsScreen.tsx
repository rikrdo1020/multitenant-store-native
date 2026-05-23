import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { ScreenWrapper } from "@/components/shared/ScreenWrapper";
import { useNotificationsScreen } from "@/hooks/use-notifications-screen";
import type { AppNotification } from "@/services/notifications";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function NotificationItem({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: (n: AppNotification) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.75}
      className={`flex-row items-start gap-3 px-4 py-4 border-b border-border ${item.read ? "bg-background" : "bg-primary/5"}`}
    >
      <View
        className={`mt-1.5 w-2 h-2 rounded-full ${item.read ? "bg-transparent" : "bg-primary"}`}
      />
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`text-sm flex-1 ${item.read ? "text-foreground font-normal" : "text-foreground font-semibold"}`}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-xs text-muted-foreground shrink-0">
            {relativeTime(item.createdAt)}
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground" numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, refetch, handleOpen } =
    useNotificationsScreen();

  return (
    <ScreenWrapper safeArea={false}>
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-foreground">
          Notificaciones
        </Text>
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
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleOpen} />
        )}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-muted-foreground text-sm">
              No hay notificaciones
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </ScreenWrapper>
  );
}
