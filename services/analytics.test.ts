import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { analyticsService } from './analytics';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('analyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN threshold WHEN loading low stock SHOULD call analytics endpoint with tenant header', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [] } });

    const result = await analyticsService.getLowStock('demo', 3);

    expect(mockedApi.get).toHaveBeenCalledWith('/analytics/low-stock', {
      params: { threshold: 3 },
      headers: { 'x-tenant-id': 'demo' },
    });
    expect(result).toEqual([]);
  });
});
