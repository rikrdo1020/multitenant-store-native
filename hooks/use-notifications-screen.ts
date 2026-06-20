import { useCallback } from "react";
import { useRouter } from "expo-router";
import { useNotifications, useMarkAsRead } from "@/hooks/api/use-notifications";
import type { AppNotification } from "@/types";

function getNotificationRoute(notification: AppNotification): string | null {
  const meta = notification.metadata as Record<string, string> | null;
  switch (notification.type) {
    case "order_created":
    case "order_status_changed":
      return meta?.orderId ? `/(admin)/orders/${meta.orderId}` : null;
    case "team_invitation":
      return null;
    default:
      return null;
  }
}

export function useNotificationsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useNotifications();
  const { mutate: markRead } = useMarkAsRead();

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = useCallback(
    (notification: AppNotification) => {
      if (!notification.read) {
        markRead(notification.documentId);
      }
      const route = getNotificationRoute(notification);
      if (route) {
        router.push(route as never);
      }
    },
    [markRead, router],
  );

  return { notifications, unreadCount, isLoading, refetch, handleOpen };
}
