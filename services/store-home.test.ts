import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { storeHomeService } from './store-home';
import api from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('storeHomeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN tenant slug WHEN loading store home SHOULD call GET /store/home with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          tenant: { documentId: 'tenant-1', slug: 'demo', name: 'Demo Store' },
          featuredProducts: [],
          categories: [],
          latestProducts: [],
          banners: [],
        },
      },
    });

    const result = await storeHomeService.getHome('demo');

    expect(mockedApi.get).toHaveBeenCalledWith('/store/home', {
      headers: { 'x-tenant-id': 'demo' },
    });
    expect(result.tenant.slug).toBe('demo');
  });
});
