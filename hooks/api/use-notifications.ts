import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notifications";
import { useAuthStore } from "@/stores/use-auth-store";

export const NOTIFICATIONS_KEY = ["notifications"] as const;

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: notificationService.getAll,
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useUnreadCount() {
  const { data } = useNotifications();
  return (data?.items ?? []).filter((n) => !n.read).length;
}
