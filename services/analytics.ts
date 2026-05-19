import api from './api';
import type {
  ApiResponse,
  AnalyticsOverview,
  SalesPoint,
  TopProduct,
  CustomerMetrics,
  AnalyticsQuery,
  SalesQuery,
  TopProductsQuery,
} from '@/types';

export const analyticsService = {
  getOverview: async (tenantSlug: string, params?: AnalyticsQuery): Promise<AnalyticsOverview> => {
    const response = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview', {
      params,
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  getSales: async (tenantSlug: string, params?: SalesQuery): Promise<SalesPoint[]> => {
    const response = await api.get<ApiResponse<SalesPoint[]>>('/analytics/sales', {
      params,
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  getTopProducts: async (tenantSlug: string, params?: TopProductsQuery): Promise<TopProduct[]> => {
    const response = await api.get<ApiResponse<TopProduct[]>>('/analytics/top-products', {
      params,
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  getCustomers: async (tenantSlug: string, params?: AnalyticsQuery): Promise<CustomerMetrics> => {
    const response = await api.get<ApiResponse<CustomerMetrics>>('/analytics/customers', {
      params,
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },
};
