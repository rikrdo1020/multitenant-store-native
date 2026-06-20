import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { orderService } from './orders';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('orderService.getRecentOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN tenant slug and limit WHEN loading recent orders SHOULD call GET /orders/recent', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ documentId: 'ord-1', orderNumber: 'ORD-1', total: 10 }],
      },
    });

    const result = await orderService.getRecentOrders('demo', 5);

    expect(mockedApi.get).toHaveBeenCalledWith('/orders/recent', {
      params: { limit: 5 },
      headers: { 'x-tenant-id': 'demo' },
    });
    expect(result[0].orderNumber).toBe('ORD-1');
  });
});
