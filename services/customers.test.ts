import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import { customerService } from './customers';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);
const TENANT = 'demo-store';

const mockCustomer = {
  id: '1',
  documentId: 'cust_1',
  name: 'Juan Perez',
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

  it('GIVEN tenant slug WHEN fetching current customer SHOULD call /customers/me with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'cus_1', name: 'Buyer', email: 'buyer@example.com', phone: '6000-0000' },
      },
    });

    const result = await customerService.getMe(TENANT);

    expect(mockedApi.get).toHaveBeenCalledWith('/customers/me', {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.email).toBe('buyer@example.com');
  });

  it('GIVEN profile payload WHEN updating current customer SHOULD PUT /customers/me', async () => {
    const payload = { name: 'Buyer Updated', phone: '6111-1111' };
    mockedApi.put.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'cus_1', email: 'buyer@example.com', ...payload },
      },
    });

    const result = await customerService.updateMe(TENANT, payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/customers/me', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.name).toBe('Buyer Updated');
  });

  it('GIVEN address payload WHEN creating address SHOULD POST current customer address endpoint', async () => {
    const payload = {
      name: 'Casa',
      address: 'Street 1',
      city: 'Panama',
      department: 'Panama',
      phone: '6000-0000',
      isDefault: true,
    };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'addr_1', ...payload } },
    });

    const result = await customerService.createAddress(TENANT, payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/customers/me/addresses', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.isDefault).toBe(true);
  });

  it('GIVEN address id WHEN deleting address SHOULD DELETE current customer address endpoint', async () => {
    mockedApi.delete.mockResolvedValue({});

    await customerService.deleteAddress(TENANT, 'addr_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/customers/me/addresses/addr_1', {
      headers: { 'x-tenant-id': TENANT },
    });
  });

  it('GIVEN tenant slug WHEN fetching customers SHOULD call GET /customers with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: [mockCustomer], meta: mockMeta },
    });

    const result = await customerService.getCustomers(TENANT);

    expect(mockedApi.get).toHaveBeenCalledWith('/customers', {
      params: undefined,
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.data[0].documentId).toBe('cust_1');
    expect(result.meta.total).toBe(1);
  });

  it('GIVEN search filter WHEN fetching customers SHOULD pass params', async () => {
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: [], meta: { ...mockMeta, total: 0 } },
    });

    await customerService.getCustomers(TENANT, { search: 'Juan', page: 1 });

    expect(mockedApi.get).toHaveBeenCalledWith('/customers', {
      params: { search: 'Juan', page: 1 },
      headers: { 'x-tenant-id': TENANT },
    });
  });

  it('GIVEN customer id WHEN fetching single customer SHOULD call GET /customers/:id', async () => {
    const detail = { ...mockCustomer, orders: [] };
    mockedApi.get.mockResolvedValue({
      data: { success: true, data: detail },
    });

    const result = await customerService.getCustomer(TENANT, 'cust_1');

    expect(mockedApi.get).toHaveBeenCalledWith('/customers/cust_1', {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.documentId).toBe('cust_1');
    expect(result.orders).toEqual([]);
  });

  it('GIVEN update payload WHEN updating customer SHOULD PUT to /customers/:id', async () => {
    const payload = { name: 'Juan Updated', email: 'juan@test.com', phone: '6111-1111' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { ...mockCustomer, ...payload } },
    });

    const result = await customerService.updateCustomer(TENANT, 'cust_1', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/customers/cust_1', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.name).toBe('Juan Updated');
  });

  it('GIVEN customer id WHEN deleting customer SHOULD call DELETE /customers/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await customerService.deleteCustomer(TENANT, 'cust_1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/customers/cust_1', {
      headers: { 'x-tenant-id': TENANT },
    });
  });

  it('GIVEN API error WHEN fetching customers SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(customerService.getCustomers(TENANT)).rejects.toThrow('Network error');
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

    const result = await customerService.getCustomer(TENANT, 'cust_1');

    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].orderId).toBe('001');
    expect(result.orders[0].orderStatus).toBe('paid');
  });
});
