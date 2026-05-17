import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { categoryService } from './categories';
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

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN fetching categories SHOULD call /categories with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ documentId: 'cat_1', name: 'Electrónica', slug: 'electronica' }],
      },
    });

    const result = await categoryService.getCategories('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/categories', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result[0].slug).toBe('electronica');
  });

  it('GIVEN create payload WHEN creating category SHOULD POST and return category', async () => {
    const payload = { name: 'Ropa', slug: 'ropa', description: 'Prendas de vestir' };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'cat_2', ...payload } },
    });

    const result = await categoryService.createCategory('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/categories', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('cat_2');
  });

  it('GIVEN update payload WHEN updating category SHOULD PUT to /categories/:id', async () => {
    const payload = { name: 'Ropa y Calzado' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { documentId: 'cat_2', slug: 'ropa', name: 'Ropa y Calzado' } },
    });

    const result = await categoryService.updateCategory('demo-store', 'cat_2', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/categories/cat_2', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.name).toBe('Ropa y Calzado');
  });

  it('GIVEN an id WHEN deleting category SHOULD call DELETE /categories/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await categoryService.deleteCategory('demo-store', 'cat_2');

    expect(mockedApi.delete).toHaveBeenCalledWith('/categories/cat_2', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching categories SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(categoryService.getCategories('demo-store')).rejects.toThrow('Network error');
  });
});
