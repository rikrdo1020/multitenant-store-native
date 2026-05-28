import { Text, TouchableOpacity, View } from 'react-native';
import type { AppNotification } from '@/types';

interface NotificationItemProps {
  item: AppNotification;
  onPress: (notification: AppNotification) => void;
}

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.75}
      className={`flex-row items-start gap-3 px-4 py-4 border-b border-border ${item.read ? 'bg-background' : 'bg-primary/5'}`}
    >
      <View className={`mt-1.5 w-2 h-2 rounded-full ${item.read ? 'bg-transparent' : 'bg-primary'}`} />
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            className={`text-sm flex-1 ${item.read ? 'text-foreground font-normal' : 'text-foreground font-semibold'}`}
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

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}
