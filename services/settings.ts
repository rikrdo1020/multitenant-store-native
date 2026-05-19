import api from './api';
import type { TenantSettings, UpdateSettingsPayload, ApiResponse } from '@/types';

export const settingsService = {
  getSettings: async (): Promise<TenantSettings> => {
    const response = await api.get<ApiResponse<TenantSettings>>('/settings');
    return response.data.data;
  },

  updateSettings: async (data: UpdateSettingsPayload): Promise<TenantSettings> => {
    const response = await api.put<ApiResponse<TenantSettings>>('/settings', data);
    return response.data.data;
  },
};
