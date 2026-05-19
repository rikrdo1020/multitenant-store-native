import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { superadminService } from "./superadmin";
import api from "./api";

jest.mock("./api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

const mockMeta = { page: 1, pageSize: 20, totalPages: 1, total: 2 };

const mockTenant = {
  documentId: "t1",
  name: "Demo Store",
  slug: "demo-store",
  status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  owner: { documentId: "u1", email: "owner@demo.com", name: "Owner" },
  _count: { members: 3, products: 10, orders: 42 },
};

const mockUser = {
  documentId: "u1",
  email: "user@test.com",
  name: "Test User",
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  tenants: [],
};

describe("superadminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listTenants", () => {
    it("GIVEN no filters WHEN listing tenants SHOULD GET /superadmin/tenants with default pagination", async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [mockTenant], meta: mockMeta },
      });

      const result = await superadminService.listTenants();

      expect(mockedApi.get).toHaveBeenCalledWith("/superadmin/tenants", {
        params: { page: 1, pageSize: 20 },
        headers: { "x-tenant-id": undefined },
      });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(2);
    });

    it("GIVEN custom pagination WHEN listing tenants SHOULD pass page and pageSize", async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [], meta: { ...mockMeta, page: 2 } },
      });

      await superadminService.listTenants({ page: 2, pageSize: 10 });

      expect(mockedApi.get).toHaveBeenCalledWith("/superadmin/tenants", {
        params: { page: 2, pageSize: 10 },
        headers: { "x-tenant-id": undefined },
      });
    });

    it("GIVEN API error WHEN listing tenants SHOULD propagate error", async () => {
      mockedApi.get.mockRejectedValue(new Error("Unauthorized"));

      await expect(superadminService.listTenants()).rejects.toThrow("Unauthorized");
    });
  });

  describe("getTenant", () => {
    it("GIVEN tenant id WHEN fetching tenant SHOULD GET /superadmin/tenants/:id", async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { ...mockTenant, _count: { ...mockTenant._count, customers: 5 } } },
      });

      const result = await superadminService.getTenant("t1");

      expect(mockedApi.get).toHaveBeenCalledWith("/superadmin/tenants/t1", {
        headers: { "x-tenant-id": undefined },
      });
      expect(result.documentId).toBe("t1");
      expect(result.slug).toBe("demo-store");
    });
  });

  describe("setTenantStatus", () => {
    it("GIVEN tenant id and status WHEN updating status SHOULD PUT /superadmin/tenants/:id/status", async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { ...mockTenant, status: "suspended" } },
      });

      const result = await superadminService.setTenantStatus("t1", "suspended");

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/superadmin/tenants/t1/status",
        { status: "suspended" },
        { headers: { "x-tenant-id": undefined } },
      );
      expect(result.status).toBe("suspended");
    });

    it("GIVEN inactive status WHEN updating SHOULD allow setting inactive", async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { ...mockTenant, status: "inactive" } },
      });

      await superadminService.setTenantStatus("t1", "inactive");

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/superadmin/tenants/t1/status",
        { status: "inactive" },
        { headers: { "x-tenant-id": undefined } },
      );
    });
  });

  describe("listUsers", () => {
    it("GIVEN no filters WHEN listing users SHOULD GET /superadmin/users with defaults", async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [mockUser], meta: mockMeta },
      });

      const result = await superadminService.listUsers();

      expect(mockedApi.get).toHaveBeenCalledWith("/superadmin/users", {
        params: { page: 1, pageSize: 20 },
        headers: { "x-tenant-id": undefined },
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].email).toBe("user@test.com");
    });
  });

  describe("setUserActive", () => {
    it("GIVEN user id and isActive=false WHEN deactivating SHOULD PUT /superadmin/users/:id/active", async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { ...mockUser, isActive: false } },
      });

      const result = await superadminService.setUserActive("u1", false);

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/superadmin/users/u1/active",
        { isActive: false },
        { headers: { "x-tenant-id": undefined } },
      );
      expect(result.isActive).toBe(false);
    });

    it("GIVEN user id and isActive=true WHEN activating SHOULD send isActive true", async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { ...mockUser, isActive: true } },
      });

      await superadminService.setUserActive("u1", true);

      expect(mockedApi.put).toHaveBeenCalledWith(
        "/superadmin/users/u1/active",
        { isActive: true },
        { headers: { "x-tenant-id": undefined } },
      );
    });

    it("GIVEN API error WHEN setting user active SHOULD propagate error", async () => {
      mockedApi.put.mockRejectedValue(new Error("User not found"));

      await expect(superadminService.setUserActive("bad-id", false)).rejects.toThrow(
        "User not found",
      );
    });
  });
});
