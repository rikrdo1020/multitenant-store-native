import { NotificationsScreen } from "@/components/admin/NotificationsScreen";
import { useNotificationsScreen } from "@/hooks/use-notifications-screen";

export default function NotificationsRoute() {
  const notifications = useNotificationsScreen();

  return (
    <NotificationsScreen
      notifications={notifications.notifications}
      unreadCount={notifications.unreadCount}
      isLoading={notifications.isLoading}
      onRefresh={notifications.refetch}
      onOpen={notifications.handleOpen}
    />
  );
}
