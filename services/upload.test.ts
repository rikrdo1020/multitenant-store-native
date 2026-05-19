import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { uploadService } from './upload';
import { getSecureItem } from '@/lib/storage';
import { useTenantStore } from '@/stores/use-tenant-store';

jest.mock('@/lib/storage', () => ({
  getSecureItem: jest.fn(),
}));

jest.mock('@/stores/use-tenant-store', () => ({
  useTenantStore: {
    getState: jest.fn(),
  },
}));

const mockedGetSecureItem = jest.mocked(getSecureItem);
const mockedGetTenantState = jest.mocked(useTenantStore.getState);
const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('uploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
    mockedGetSecureItem.mockResolvedValue('token-123');
    mockedGetTenantState.mockReturnValue({ tenant: { slug: 'demo-store' } } as ReturnType<typeof useTenantStore.getState>);
    fetchMock.mockResolvedValueOnce({
      blob: jest.fn<() => Promise<Blob>>().mockResolvedValue(new Blob(['image'], { type: 'image/jpeg' })),
    } as unknown as Response);
  });

  it('GIVEN file uri and folder WHEN uploading image SHOULD POST formData and return upload result', async () => {
    const mockResponse = {
      success: true,
      data: {
        url: 'https://res.cloudinary.com/demo/image.png',
        publicId: 'products/image',
        width: 800,
        height: 600,
        format: 'png',
        bytes: 12345,
      },
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn<() => Promise<typeof mockResponse>>().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await uploadService.uploadImage('file:///path/to/image.jpg', 'products');

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'file:///path/to/image.jpg');
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/upload/image?folder=products'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer token-123',
          'x-tenant-id': 'demo-store',
        },
        body: expect.any(FormData),
      }),
    );
    expect(result.url).toBe('https://res.cloudinary.com/demo/image.png');
  });

  it('GIVEN file uri without folder WHEN uploading image SHOULD omit folder query param', async () => {
    const mockResponse = {
      success: true,
      data: {
        url: 'https://res.cloudinary.com/demo/image.png',
        publicId: 'image',
        width: 800,
        height: 600,
        format: 'png',
        bytes: 12345,
      },
    };
    mockedGetSecureItem.mockResolvedValue(null);
    mockedGetTenantState.mockReturnValue({ tenant: null } as ReturnType<typeof useTenantStore.getState>);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn<() => Promise<typeof mockResponse>>().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await uploadService.uploadImage('file:///path/to/image.jpg');

    expect(fetchMock.mock.calls[1][0]).not.toContain('folder=');
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: {},
        body: expect.any(FormData),
      }),
    );
    expect(result.publicId).toBe('image');
  });
});
