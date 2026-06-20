import api from "./api";
import type {
  Order,
  ApiResponse,
  CreateOrderPayload,
  AdminOrderFilters,
  PaginationMeta,
  OrderStatus,
} from "@/types";

export interface OrderListResult {
  data: Order[];
  meta?: PaginationMeta;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  adminNote?: string;
}

export const orderService = {
  createOrder: async (
    tenantSlug: string,
    data: CreateOrderPayload,
  ): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>("/orders", data, {
      headers: { "x-tenant-id": tenantSlug },
    });

    return response.data.data;
  },

  getOrders: async (
    tenantSlug: string,
    params: OrderListParams = {},
  ): Promise<OrderListResult> => {
    const response = await api.get<ApiResponse<Order[]>>("/orders", {
      params,
      headers: { "x-tenant-id": tenantSlug },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getOrderById: async (tenantSlug: string, orderId: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`, {
      headers: { "x-tenant-id": tenantSlug },
    });

    return response.data.data;
  },

  getOrder: async (
    tenantSlug: string,
    orderId: string,
    viewToken: string,
  ): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(
      `/orders/track/${orderId}`,
      {
        params: { token: viewToken },
        headers: { "x-tenant-id": tenantSlug },
      },
    );

    return response.data.data;
  },

  getOrderByViewToken: async (
    tenantSlug: string,
    viewToken: string,
  ): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(
      `/orders/track/${viewToken}`,
      {
        headers: { "x-tenant-id": tenantSlug },
      },
    );

    return response.data.data;
  },

  trackOrderByEmail: async (
    tenantSlug: string,
    data: { orderId: string; email: string },
  ): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>("/orders/track", data, {
      headers: { "x-tenant-id": tenantSlug },
    });

    return response.data.data;
  },

  getAdminOrders: async (
    tenantSlug: string,
    filters?: AdminOrderFilters,
  ): Promise<{ data: Order[]; meta: PaginationMeta }> => {
    const response = await api.get<ApiResponse<Order[]>>("/orders", {
      params: filters,
      headers: { "x-tenant-id": tenantSlug },
    });
    return { data: response.data.data, meta: response.data.meta! };
  },

  getAdminOrder: async (
    tenantSlug: string,
    orderId: string,
  ): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`, {
      headers: { "x-tenant-id": tenantSlug },
    });
    return response.data.data;
  },

  updateOrderStatus: async (
    tenantSlug: string,
    orderId: string,
    statusOrPayload: OrderStatus | UpdateOrderStatusPayload,
  ): Promise<Order> => {
    const payload =
      typeof statusOrPayload === "string"
        ? { orderStatus: statusOrPayload }
        : {
            orderStatus: statusOrPayload.status,
            ...(statusOrPayload.trackingNumber ? { trackingNumber: statusOrPayload.trackingNumber } : {}),
            ...(statusOrPayload.trackingCarrier ? { trackingCarrier: statusOrPayload.trackingCarrier } : {}),
            ...(statusOrPayload.trackingUrl ? { trackingUrl: statusOrPayload.trackingUrl } : {}),
            ...(statusOrPayload.adminNote ? { adminNote: statusOrPayload.adminNote } : {}),
          };
    const response = await api.put<ApiResponse<Order>>(
      `/orders/${orderId}/status`,
      payload,
      { headers: { "x-tenant-id": tenantSlug } },
    );
    return response.data.data;
  },
};
