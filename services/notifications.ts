import api from "./api";
import type { AppNotification } from "@/types";

export interface NotificationListResult {
  items: AppNotification[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const notificationService = {
  registerToken: async (token: string, platform: "ios" | "android") => {
    await api.post("/notifications/register-token", { token, platform });
  },

  getAll: async (): Promise<NotificationListResult> => {
    const res = await api.get<{ data: AppNotification[] | NotificationListResult }>(
      "/notifications",
    );
    const payload = res.data.data;
    if (Array.isArray(payload)) {
      return { items: payload, meta: { page: 1, pageSize: payload.length, total: payload.length, totalPages: 1 } };
    }
    return payload;
  },

  markAsRead: async (id: string) => {
    await api.put(`/notifications/${id}/read`);
  },
};
