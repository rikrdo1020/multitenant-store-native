import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { productTypeService } from './product-types';
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

describe('productTypeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN fetching product types SHOULD call /product-types with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ documentId: 'pt_1', name: 'Bebida' }],
      },
    });

    const result = await productTypeService.getProductTypes('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/product-types', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result[0].name).toBe('Bebida');
  });

  it('GIVEN create payload WHEN creating product type SHOULD POST and return type', async () => {
    const payload = { name: 'Comida' };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'pt_2', ...payload } },
    });

    const result = await productTypeService.createProductType('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/product-types', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('pt_2');
  });

  it('GIVEN update payload WHEN updating product type SHOULD PUT to /product-types/:id', async () => {
    const payload = { name: 'Comida Rápida' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { documentId: 'pt_2', name: 'Comida Rápida' } },
    });

    const result = await productTypeService.updateProductType('demo-store', 'pt_2', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/product-types/pt_2', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.name).toBe('Comida Rápida');
  });

  it('GIVEN an id WHEN deleting product type SHOULD call DELETE /product-types/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await productTypeService.deleteProductType('demo-store', 'pt_2');

    expect(mockedApi.delete).toHaveBeenCalledWith('/product-types/pt_2', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching product types SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(productTypeService.getProductTypes('demo-store')).rejects.toThrow('Network error');
  });
});
