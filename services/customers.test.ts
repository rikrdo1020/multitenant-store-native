import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { customerService } from './customers';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

const mockCustomer = {
  id: '1',
  documentId: 'cust_1',
  name: 'Juan Pérez',
  email: 'juan@test.com',
  phone: '6000-0000',
  totalOrders: 3,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockMeta = { page: 1, pageSize: 20, totalPages: 1, total: 1 };

describe('customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN tenant slug WHEN fetching customers SHOULD call GET /customers with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: [mockCustomer], meta: mockMeta },
    });

    const result = await customerService.getCustomers('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/customers', {
      params: undefined,
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.data[0].documentId).toBe('cust_1');
    expect(result.meta.total).toBe(1);
  });

  it('GIVEN search filter WHEN fetching customers SHOULD pass params', async () => {
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: [], meta: { ...mockMeta, total: 0 } },
    });

    await customerService.getCustomers('demo-store', { search: 'Juan', page: 1 });

    expect(mockedApi.get).toHaveBeenCalledWith('/customers', {
      params: { search: 'Juan', page: 1 },
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN customer id WHEN fetching single customer SHOULD call GET /customers/:id', async () => {
    const detail = { ...mockCustomer, orders: [] };
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: detail },
    });

    const result = await customerService.getCustomer('demo-store', 'cust_1');

    expect(mockedApi.get).toHaveBeenCalledWith('/customers/cust_1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('cust_1');
    expect(result.orders).toEqual([]);
  });

  it('GIVEN update payload WHEN updating customer SHOULD PUT to /customers/:id', async () => {
    const payload = { name: 'Juan Updated', email: 'juan@test.com', phone: '6111-1111' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { ...mockCustomer, ...payload } },
    });

    const result = await customerService.updateCustomer('demo-store', 'cust_1', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/customers/cust_1', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.name).toBe('Juan Updated');
  });

  it('GIVEN customer id WHEN deleting customer SHOULD call DELETE /customers/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await customerService.deleteCustomer('demo-store', 'cust_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/customers/cust_1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching customers SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(customerService.getCustomers('demo-store')).rejects.toThrow('Network error');
  });

  it('GIVEN customer with orders WHEN fetching detail SHOULD return order history', async () => {
    const order = {
      documentId: 'ord_1',
      orderId: '001',
      orderStatus: 'paid' as const,
      total: 50,
      createdAt: '2026-03-01T00:00:00.000Z',
    };
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: { ...mockCustomer, orders: [order] } },
    });

    const result = await customerService.getCustomer('demo-store', 'cust_1');

    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].orderId).toBe('001');
    expect(result.orders[0].orderStatus).toBe('paid');
  });
});
