import api from './api';
import { setSecureItem, removeSecureItem, getSecureItem } from '@/lib/storage';
import { useAuthStore } from '@/stores/use-auth-store';
import type { User, ApiResponse } from '@/types';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
  const { accessToken, refreshToken, user } = response.data.data;
  await saveTokens(accessToken, refreshToken);
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  return user;
}

export async function register(data: { name: string; email: string; password: string; phone: string }): Promise<User> {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
  const { accessToken, refreshToken, user } = response.data.data;
  await saveTokens(accessToken, refreshToken);
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  return user;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getSecureItem('mt:refresh-token');
  if (!refreshToken) throw new Error('No refresh token');

  const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
  const { accessToken } = response.data.data;
  await setSecureItem('mt:auth-token', accessToken);
  useAuthStore.getState().setAccessToken(accessToken);
  return accessToken;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore errors on logout
  }
  await clearTokens();
  useAuthStore.getState().clearAuth();
}

async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setSecureItem('mt:auth-token', accessToken);
  await setSecureItem('mt:refresh-token', refreshToken);
}

async function clearTokens(): Promise<void> {
  await removeSecureItem('mt:auth-token');
  await removeSecureItem('mt:refresh-token');
}
