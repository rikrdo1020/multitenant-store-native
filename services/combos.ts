import api from './api';
import type { ComboDefinition, ApiResponse, CreateComboPayload, UpdateComboPayload } from '@/types';

export const comboService = {
  getCombos: async (tenantSlug: string): Promise<ComboDefinition[]> => {
    const response = await api.get<ApiResponse<ComboDefinition[]>>('/combos', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  createCombo: async (tenantSlug: string, payload: CreateComboPayload): Promise<ComboDefinition> => {
    const response = await api.post<ApiResponse<ComboDefinition>>('/combos', payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  updateCombo: async (
    tenantSlug: string,
    id: string,
    payload: UpdateComboPayload,
  ): Promise<ComboDefinition> => {
    const response = await api.put<ApiResponse<ComboDefinition>>(`/combos/${id}`, payload, {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  deleteCombo: async (tenantSlug: string, id: string): Promise<void> => {
    await api.delete(`/combos/${id}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};
