import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { notificationService } from "@/services/notifications";
import { useAuthStore } from "@/stores/use-auth-store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const registered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || registered.current) return;

    let cancelled = false;

    async function register() {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted" || cancelled) return;
      if (Platform.OS === "web") return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const platform = Platform.OS === "ios" ? "ios" : "android";

      try {
        await notificationService.registerToken(tokenData.data, platform);
        registered.current = true;
      } catch {
        // Non-fatal — push delivery will simply not work
      }
    }

    register();
    return () => { cancelled = true; };
  }, [isAuthenticated]);
}
