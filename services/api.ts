import axios from 'axios';
import { API_URL } from '@/lib/constants';
import { getSecureItem } from '@/lib/storage';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { ApiError } from '@/types';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getSecureItem('mt:auth-token');
  const tenant = useTenantStore.getState().tenant;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenant) {
    config.headers['x-tenant-id'] = tenant.slug;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getSecureItem('mt:refresh-token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = response.data.data;

        const { setAccessToken } = useAuthStore.getState();
        setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status >= 500) {
      // Server error toast will be handled by UI
    }

    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    return {
      code: data.code || 'UNKNOWN_ERROR',
      message: data.message || 'Error desconocido',
      statusCode: error.response.status,
      details: data.details,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Error de red. Verifica tu conexión.',
    statusCode: 0,
  };
}

export default api;
