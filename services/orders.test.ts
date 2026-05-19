import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { orderService } from "./orders";
import api from "./api";

jest.mock("./api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);
const TENANT = "demo-store";

const mockOrder = {
  documentId: "ord_001",
  orderId: "ORD-0001",
  orderStatus: "pending" as const,
  items: [{ productId: "p1", name: "Producto A", quantity: 2, unitPrice: 10 }],
  customerData: { name: "Juan", email: "juan@test.com", phone: "6000-0000" },
  total: 20,
  createdAt: "2026-05-18T00:00:00.000Z",
};

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminOrders", () => {
    it("GIVEN tenant slug WHEN fetching admin orders SHOULD call GET /orders with tenant header", async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: [mockOrder],
          meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
        },
      });

      const result = await orderService.getAdminOrders(TENANT);

      expect(mockedApi.get).toHaveBeenCalledWith("/orders", {
        params: undefined,
        headers: { "x-tenant-id": TENANT },
      });
      expect(result.data[0].orderId).toBe("ORD-0001");
      expect(result.meta.total).toBe(1);
    });

    it("GIVEN status filter WHEN fetching admin orders SHOULD pass filter as params", async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: [],
          meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        },
      });

      await orderService.getAdminOrders(TENANT, { status: "pending", page: 1 });

      expect(mockedApi.get).toHaveBeenCalledWith("/orders", {
        params: { status: "pending", page: 1 },
        headers: { "x-tenant-id": TENANT },
      });
    });

    it("GIVEN API error WHEN fetching admin orders SHOULD propagate the error", async () => {
      mockedApi.get.mockRejectedValue(new Error("Network error"));

      await expect(orderService.getAdminOrders(TENANT)).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("getAdminOrder", () => {
    it("GIVEN order id WHEN fetching single order SHOULD call GET /orders/:id", async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: mockOrder },
      });

      const result = await orderService.getAdminOrder(TENANT, "ord_001");

      expect(mockedApi.get).toHaveBeenCalledWith("/orders/ord_001", {
        headers: { "x-tenant-id": TENANT },
      });
      expect(result.documentId).toBe("ord_001");
    });
  });

  describe("updateOrderStatus", () => {
    it("GIVEN order id and new status WHEN updating SHOULD call PUT /orders/:id with status", async () => {
      const updated = { ...mockOrder, orderStatus: "processing" as const };
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: updated },
      });

      const result = await orderService.updateOrderStatus(
        TENANT,
        "ord_001",
        "pending",
      );

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/orders/ord_001",
        { orderStatus: "processing" },
        { headers: { "x-tenant-id": TENANT } },
      );
      expect(result.orderStatus).toBe("processing");
    });

    it("GIVEN cancelled status WHEN updating SHOULD set order to cancelled", async () => {
      const cancelled = { ...mockOrder, orderStatus: "cancelled" as const };
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: cancelled },
      });

      const result = await orderService.updateOrderStatus(
        TENANT,
        "ord_001",
        "cancelled",
      );

      expect(result.orderStatus).toBe("cancelled");
    });
  });
});
