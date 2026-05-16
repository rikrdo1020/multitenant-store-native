import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { productService } from './products';
import api from './api';

jest.mock('./api');

const mockedApi = jest.mocked(api);

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProducts SHOULD return data and meta', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [{ documentId: '1', name: 'Test', slug: 'test', price: 10, stock: 5, images: [] }],
        meta: { page: 1, pageSize: 20, totalPages: 1, total: 1 },
      },
    };
    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await productService.getProducts('my-store', { search: 'test' });

    expect(mockedApi.get).toHaveBeenCalledWith('/products', {
      params: { search: 'test' },
      headers: { 'x-tenant-id': 'my-store' },
    });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('getProduct SHOULD return a single product', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { documentId: '1', name: 'Test', slug: 'test', price: 10, stock: 5, images: [] },
      },
    };
    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await productService.getProduct('my-store', 'test');

    expect(mockedApi.get).toHaveBeenCalledWith('/products/test', {
      headers: { 'x-tenant-id': 'my-store' },
    });
    expect(result.name).toBe('Test');
  });

  it('createProduct SHOULD POST payload and return product', async () => {
    const payload = { name: 'New', slug: 'new', price: 10, dku: 'DKU001' };
    const mockResponse = {
      data: {
        success: true,
        data: { documentId: '2', ...payload, stock: 0, images: [] },
      },
    };
    mockedApi.post.mockResolvedValue(mockResponse);

    const result = await productService.createProduct('my-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/products', payload, {
      headers: { 'x-tenant-id': 'my-store' },
    });
    expect(result.documentId).toBe('2');
  });

  it('updateProduct SHOULD PUT payload and return product', async () => {
    const payload = { price: 15 };
    const mockResponse = {
      data: {
        success: true,
        data: { documentId: '1', name: 'Test', slug: 'test', price: 15, stock: 5, images: [] },
      },
    };
    mockedApi.put.mockResolvedValue(mockResponse);

    const result = await productService.updateProduct('my-store', '1', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/products/1', payload, {
      headers: { 'x-tenant-id': 'my-store' },
    });
    expect(result.price).toBe(15);
  });

  it('deleteProduct SHOULD DELETE without returning data', async () => {
    mockedApi.delete.mockResolvedValue({});

    await productService.deleteProduct('my-store', '1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/products/1', {
      headers: { 'x-tenant-id': 'my-store' },
    });
  });
});
