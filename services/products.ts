import api from "./api";
import type {
  Product,
  ProductFilters,
  ApiResponse,
  PaginationMeta,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types";

export const productService = {
  getProducts: async (
    tenantSlug: string,
    filters: ProductFilters,
  ): Promise<{ data: Product[]; meta: PaginationMeta }> => {
    const { category, brand, ...rest } = filters;
    const params = {
      ...rest,
      ...(category ? { categoryId: category } : {}),
      ...(brand ? { brandId: brand } : {}),
    };
    const response = await api.get<ApiResponse<Product[]>>("/products", {
      params,
      headers: { "x-tenant-id": tenantSlug },
    });
    return { data: response.data.data, meta: response.data.meta! };
  },

  getProduct: async (tenantSlug: string, slug: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`, {
      headers: { "x-tenant-id": tenantSlug },
    });
    return response.data.data;
  },

  getAdminProducts: async (
    tenantSlug: string,
    filters?: ProductFilters,
  ): Promise<{ data: Product[]; meta: PaginationMeta }> => {
    const { category, brand, ...rest } = filters ?? {};
    const params = {
      ...rest,
      ...(category ? { categoryId: category } : {}),
      ...(brand ? { brandId: brand } : {}),
    };
    const response = await api.get<ApiResponse<Product[]>>("/products/admin/list", {
      params,
      headers: { "x-tenant-id": tenantSlug },
    });
    return { data: response.data.data, meta: response.data.meta! };
  },

  createProduct: async (
    tenantSlug: string,
    payload: CreateProductPayload,
  ): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>("/products", payload, {
      headers: { "x-tenant-id": tenantSlug },
    });
    return response.data.data;
  },

  updateProduct: async (
    tenantSlug: string,
    id: string,
    payload: UpdateProductPayload,
  ): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, payload, {
      headers: { "x-tenant-id": tenantSlug },
    });
    return response.data.data;
  },

  deleteProduct: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/products/${id}`, {
      headers: { "x-tenant-id": tenantSlug },
    });
  },
};
