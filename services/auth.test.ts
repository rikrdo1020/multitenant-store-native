import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import {
  getAuthErrorMessage,
  registerInvite,
  requestPasswordReset,
  resetPassword,
  verifyInvite,
} from './auth';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
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
const getMock = api.get as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

describe('auth recovery service flow', () => {
  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
  });

  it('GIVEN an email WHEN requesting password reset SHOULD call forgot endpoint with the email payload', async () => {
    postMock.mockResolvedValueOnce({
      data: { data: { message: 'Password reset email sent.' } },
    });

    const message = await requestPasswordReset('owner@example.com');

    expect(postMock).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'owner@example.com',
    });
    expect(message).toBe('Te enviamos un enlace de recuperacion.');
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
    expect(message).toBe('Contrasena actualizada correctamente.');
  });

  it('GIVEN an invite token WHEN verifying invite SHOULD encode the token in the verify endpoint', async () => {
    getMock.mockResolvedValueOnce({
      data: {
        data: {
          email: 'member@example.com',
          role: 'manager',
          isExistingUser: false,
          expiresAt: '2026-05-23T00:00:00.000Z',
          tenant: { documentId: 'tenant_1', slug: 'demo', name: 'Demo Store' },
        },
      },
    });

    const invite = await verifyInvite('raw token');

    expect(api.get).toHaveBeenCalledWith('/auth/verify-invite/raw%20token');
    expect(invite.email).toBe('member@example.com');
    expect(invite.tenant.slug).toBe('demo');
  });

  it('GIVEN invite registration data WHEN accepting invite SHOULD post token and account fields', async () => {
    postMock.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Invitation accepted.',
          existingUser: false,
          user: {
            documentId: 'user_1',
            email: 'member@example.com',
            name: 'Member',
            role: 'manager',
          },
          tenant: { documentId: 'tenant_1', slug: 'demo', name: 'Demo Store' },
        },
      },
    });

    const result = await registerInvite({
      token: 'raw-token',
      name: 'Member',
      password: 'newsecure123',
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register-invite', {
      token: 'raw-token',
      name: 'Member',
      password: 'newsecure123',
    });
    expect(result.existingUser).toBe(false);
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

  it('GIVEN backend invite error codes WHEN mapping messages SHOULD return actionable user text', () => {
    expect(getAuthErrorMessage({ code: 'INVALID_INVITE_TOKEN' }, 'fallback'))
      .toBe('La invitacion no es valida. Solicita una nueva.');
    expect(getAuthErrorMessage({ code: 'EXPIRED_INVITE_TOKEN' }, 'fallback'))
      .toBe('La invitacion expiro. Solicita una nueva.');
    expect(getAuthErrorMessage({ code: 'INVITE_REGISTRATION_DETAILS_REQUIRED' }, 'fallback'))
      .toBe('Completa tu nombre y contrasena para aceptar la invitacion.');
    expect(getAuthErrorMessage({ code: 'MEMBER_EXISTS' }, 'fallback'))
      .toBe('Esta cuenta ya pertenece a la tienda.');
  });

  it('GIVEN an unknown API error WHEN mapping messages SHOULD keep user-facing text in Spanish', () => {
    expect(getAuthErrorMessage(
      { code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' },
      'fallback',
    )).toBe('fallback');
    expect(getAuthErrorMessage({}, 'fallback')).toBe('fallback');
  });
});
