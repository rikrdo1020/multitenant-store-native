import api from './api';
import type {
  ApiError,
  ApiResponse,
  ShippingCalculation,
  ShippingMethod,
  ShippingMethodPayload,
} from '@/types';

export const shippingService = {
  getShippingMethods: async (tenantSlug: string): Promise<ShippingMethod[]> => {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping', {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  getAdminShippingMethods: async (tenantSlug: string): Promise<ShippingMethod[]> => {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping/admin', {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  createShippingMethod: async (
    tenantSlug: string,
    payload: ShippingMethodPayload,
  ): Promise<ShippingMethod> => {
    const response = await api.post<ApiResponse<ShippingMethod>>('/shipping', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });

    return response.data.data;
  },

  updateShippingMethod: async (
    tenantSlug: string,
    methodId: string,
    payload: ShippingMethodPayload,
  ): Promise<ShippingMethod> => {
    const response = await api.put<ApiResponse<ShippingMethod>>(
      `/shipping/${methodId}`,
      payload,
      { headers: { 'x-tenant-id': tenantSlug } },
    );

    return response.data.data;
  },

  deleteShippingMethod: async (tenantSlug: string, methodId: string): Promise<void> => {
    await api.delete(`/shipping/${methodId}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },

  calculateShipping: async (
    tenantSlug: string,
    params: { methodId: string; locationId?: string | null },
  ): Promise<ShippingCalculation> => {
    const response = await api.get<ApiResponse<ShippingCalculation>>('/shipping/calculate', {
      headers: { 'x-tenant-id': tenantSlug },
      params: {
        methodId: params.methodId,
        ...(params.locationId ? { locationId: params.locationId } : {}),
      },
    });

    return response.data.data;
  },
};

export function getShippingErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as Partial<ApiError>;

  switch (apiError.code) {
    case 'SHIPPING_METHOD_NOT_FOUND':
      return 'No encontramos ese metodo de envio.';
    case 'SHIPPING_LOCATION_NOT_FOUND':
      return 'No encontramos esa zona o punto de entrega.';
    case 'FORBIDDEN':
      return 'No tienes permiso para gestionar envios.';
    default:
      return fallback;
  }
}
