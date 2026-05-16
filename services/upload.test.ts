import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { uploadService } from './upload';
import api from './api';

jest.mock('./api');

const mockedApi = jest.mocked(api);

describe('uploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploadImage SHOULD POST formData and return upload result', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/demo/image.png',
          publicId: 'products/image',
          width: 800,
          height: 600,
          format: 'png',
          bytes: 12345,
        },
      },
    };
    mockedApi.post.mockResolvedValue(mockResponse);

    const result = await uploadService.uploadImage('file:///path/to/image.jpg', 'products');

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/upload/image',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { folder: 'products' },
      }
    );
    expect(result.url).toBe('https://res.cloudinary.com/demo/image.png');
  });

  it('uploadImage SHOULD work without folder param', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/demo/image.png',
          publicId: 'image',
          width: 800,
          height: 600,
          format: 'png',
          bytes: 12345,
        },
      },
    };
    mockedApi.post.mockResolvedValue(mockResponse);

    const result = await uploadService.uploadImage('file:///path/to/image.jpg');

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/upload/image',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: undefined,
      }
    );
    expect(result.publicId).toBe('image');
  });
});
