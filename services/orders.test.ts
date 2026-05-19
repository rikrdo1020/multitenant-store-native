import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { orderService } from './orders';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getOrders SHOULD request the authenticated tenant order list', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [],
        meta: { page: 1, pageSize: 50, totalPages: 0, total: 0 },
      },
    });

    const result = await orderService.getOrders('demo-store', { page: 1, pageSize: 50 });

    expect(mockedApi.get).toHaveBeenCalledWith('/orders', {
      params: { page: 1, pageSize: 50 },
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.data).toEqual([]);
    expect(result.meta?.pageSize).toBe(50);
  });

  it('getOrderById SHOULD request authenticated order detail by document id', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'order-1', orderId: 'ORD-1', items: [], total: 0 },
      },
    });

    const result = await orderService.getOrderById('demo-store', 'order-1');

    expect(mockedApi.get).toHaveBeenCalledWith('/orders/order-1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('order-1');
  });

  it('getOrder SHOULD keep the public tracking endpoint unchanged', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: { documentId: 'order-1', orderId: 'ORD-1', items: [], total: 0 },
      },
    });

    await orderService.getOrder('demo-store', 'ORD-1');

    expect(mockedApi.get).toHaveBeenCalledWith('/orders/track/ORD-1', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });
});
