import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import {
  getAuthErrorMessage,
  requestPasswordReset,
  resetPassword,
} from './auth';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('@/lib/storage', () => ({
  getSecureItem: jest.fn(),
  removeSecureItem: jest.fn(),
  setSecureItem: jest.fn(),
}));

jest.mock('@/stores/use-auth-store', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      clearAuth: jest.fn(),
      setAccessToken: jest.fn(),
      setAuth: jest.fn(),
    })),
  },
}));

const postMock = api.post as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

describe('auth recovery service flow', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('GIVEN an email WHEN requesting password reset SHOULD call forgot endpoint with the email payload', async () => {
    postMock.mockResolvedValueOnce({
      data: { data: { message: 'Password reset email sent.' } },
    });

    const message = await requestPasswordReset('owner@example.com');

    expect(postMock).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'owner@example.com',
    });
    expect(message).toBe('Password reset email sent.');
  });

  it('GIVEN token and password WHEN resetting password SHOULD call reset endpoint with the token payload', async () => {
    postMock.mockResolvedValueOnce({
      data: { data: { message: 'Password updated successfully.' } },
    });

    const message = await resetPassword('raw-token', 'newsecure123');

    expect(postMock).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'raw-token',
      password: 'newsecure123',
    });
    expect(message).toBe('Password updated successfully.');
  });

  it('GIVEN backend reset error codes WHEN mapping messages SHOULD return actionable user text', () => {
    expect(getAuthErrorMessage(
      { code: 'PASSWORD_RESET_EMAIL_NOT_FOUND' },
      'fallback',
    )).toBe('No encontramos una cuenta con ese correo.');
    expect(getAuthErrorMessage({ code: 'INVALID_RESET_TOKEN' }, 'fallback'))
      .toBe('El enlace no es valido. Solicita uno nuevo.');
    expect(getAuthErrorMessage({ code: 'EXPIRED_RESET_TOKEN' }, 'fallback'))
      .toBe('El enlace expiro. Solicita uno nuevo.');
    expect(getAuthErrorMessage({ code: 'PASSWORD_RESET_EMAIL_DELIVERY_FAILED' }, 'fallback'))
      .toBe('No pudimos enviar el correo de recuperacion. Intenta de nuevo mas tarde.');
  });

  it('GIVEN an unknown API error WHEN mapping messages SHOULD prefer backend message before fallback', () => {
    expect(getAuthErrorMessage(
      { code: 'UNKNOWN_ERROR', message: 'Servicio no disponible' },
      'fallback',
    )).toBe('Servicio no disponible');
    expect(getAuthErrorMessage({}, 'fallback')).toBe('fallback');
  });
});
