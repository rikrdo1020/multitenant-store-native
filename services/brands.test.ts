import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { brandService } from './brands';
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

describe('brandService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN fetching brands SHOULD call /brands with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ documentId: 'brand_1', name: 'Nike', slug: 'nike' }],
      },
    });

    const result = await brandService.getBrands('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/brands', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result[0].name).toBe('Nike');
  });

  it('GIVEN create payload WHEN creating brand SHOULD POST and return brand', async () => {
    const payload = { name: 'Adidas' };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'brand_2', slug: 'adidas', ...payload } },
    });

    const result = await brandService.createBrand('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/brands', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('brand_2');
  });

  it('GIVEN update payload WHEN updating brand SHOULD PUT to /brands/:id', async () => {
    const payload = { name: 'Adidas Originals' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { documentId: 'brand_2', slug: 'adidas', name: 'Adidas Originals' } },
    });

    const result = await brandService.updateBrand('demo-store', 'brand_2', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/brands/brand_2', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.name).toBe('Adidas Originals');
  });

  it('GIVEN an id WHEN deleting brand SHOULD call DELETE /brands/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await brandService.deleteBrand('demo-store', 'brand_2');

    expect(mockedApi.delete).toHaveBeenCalledWith('/brands/brand_2', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching brands SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(brandService.getBrands('demo-store')).rejects.toThrow('Network error');
  });
});
