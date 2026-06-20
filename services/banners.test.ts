import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { bannerService } from './banners';
import api from './api';

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
const TENANT = 'demo';

describe('bannerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN tenant slug WHEN listing banners SHOULD call GET /banners', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [] } });

    await bannerService.getBanners(TENANT);

    expect(mockedApi.get).toHaveBeenCalledWith('/banners', {
      headers: { 'x-tenant-id': TENANT },
    });
  });

  it('GIVEN banner payload WHEN creating SHOULD POST to /banners', async () => {
    const payload = { title: 'Oferta', active: true };
    mockedApi.post.mockResolvedValue({ data: { success: true, data: { documentId: 'b1', ...payload } } });

    const result = await bannerService.createBanner(TENANT, payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/banners', payload, {
      headers: { 'x-tenant-id': TENANT },
    });
    expect(result.documentId).toBe('b1');
  });

  it('GIVEN banner id WHEN updating SHOULD PUT to /banners/:id', async () => {
    mockedApi.put.mockResolvedValue({ data: { success: true, data: { documentId: 'b1', title: 'Nueva' } } });

    await bannerService.updateBanner(TENANT, 'b1', { title: 'Nueva' });

    expect(mockedApi.put).toHaveBeenCalledWith(
      '/banners/b1',
      { title: 'Nueva' },
      { headers: { 'x-tenant-id': TENANT } },
    );
  });

  it('GIVEN banner id WHEN deleting SHOULD DELETE /banners/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await bannerService.deleteBanner(TENANT, 'b1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/banners/b1', {
      headers: { 'x-tenant-id': TENANT },
    });
  });
});
