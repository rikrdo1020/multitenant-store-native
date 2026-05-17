import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { tagService } from './tags';
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

describe('tagService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN fetching tags SHOULD call /tags with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ documentId: 'tag_1', name: 'Oferta', slug: 'oferta' }],
      },
    });

    const result = await tagService.getTags('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/tags', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result[0].name).toBe('Oferta');
  });

  it('GIVEN create payload WHEN creating tag SHOULD POST and return tag', async () => {
    const payload = { name: 'Nuevo' };
    mockedApi.post.mockResolvedValue({
      data: { success: true, data: { documentId: 'tag_2', slug: 'nuevo', ...payload } },
    });

    const result = await tagService.createTag('demo-store', payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/tags', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.documentId).toBe('tag_2');
  });

  it('GIVEN update payload WHEN updating tag SHOULD PUT to /tags/:id', async () => {
    const payload = { name: 'Novedad' };
    mockedApi.put.mockResolvedValue({
      data: { success: true, data: { documentId: 'tag_2', slug: 'nuevo', name: 'Novedad' } },
    });

    const result = await tagService.updateTag('demo-store', 'tag_2', payload);

    expect(mockedApi.put).toHaveBeenCalledWith('/tags/tag_2', payload, {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(result.name).toBe('Novedad');
  });

  it('GIVEN an id WHEN deleting tag SHOULD call DELETE /tags/:id', async () => {
    mockedApi.delete.mockResolvedValue({});

    await tagService.deleteTag('demo-store', 'tag_2');

    expect(mockedApi.delete).toHaveBeenCalledWith('/tags/tag_2', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
  });

  it('GIVEN API error WHEN fetching tags SHOULD propagate the error', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network error'));

    await expect(tagService.getTags('demo-store')).rejects.toThrow('Network error');
  });
});
