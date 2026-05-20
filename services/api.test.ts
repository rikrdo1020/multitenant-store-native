import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import api from './api';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { Tenant } from '@/types';

const tenant: Tenant = {
  documentId: 'tenant-active',
  slug: 'active-store',
  name: 'Active Store',
};

describe('api request interceptor', () => {
  const adapter = jest.fn<AxiosAdapter>();

  beforeEach(() => {
    jest.clearAllMocks();
    useTenantStore.getState().setTenant(null);
    api.defaults.adapter = adapter;
    adapter.mockResolvedValue({
      data: { success: true, data: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });
  });

  it('GIVEN explicit tenant header WHEN active tenant differs SHOULD preserve explicit tenant', async () => {
    useTenantStore.getState().setTenant(tenant);

    await api.get('/customers/me', {
      headers: { 'x-tenant-id': 'route-store' },
    });

    expect(getHeader(adapter.mock.calls[0][0].headers, 'x-tenant-id')).toBe('route-store');
  });

  it('GIVEN no explicit tenant header WHEN active tenant exists SHOULD add active tenant', async () => {
    useTenantStore.getState().setTenant(tenant);

    await api.get('/customers/me');

    expect(getHeader(adapter.mock.calls[0][0].headers, 'x-tenant-id')).toBe('active-store');
  });
});

function getHeader(headers: unknown, name: string): unknown {
  if (headers && typeof headers === 'object' && 'get' in headers) {
    const get = (headers as { get: (key: string) => unknown }).get;
    return get.call(headers, name);
  }

  return (headers as Record<string, unknown>)[name];
}
