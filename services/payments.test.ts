import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import { paymentService } from './payments';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('paymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN Yappy payment data WHEN creating payment SHOULD send view token with tenant header', async () => {
    mockedApi.post.mockResolvedValue({
      data: {
        success: true,
        data: { success: true, transactionId: 'TXN-1' },
      },
    });

    const payload = {
      orderId: 'ORD-001',
      viewToken: 'view-token',
      amount: 75,
      aliasYappy: '6789-1234',
    };

    const result = await paymentService.createYappyPayment('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/payments/yappy/create',
      payload,
      { headers: { 'x-tenant-id': 'demo-store' } },
    );
    expect(result.transactionId).toBe('TXN-1');
  });
});
