import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import api from './api';
import { getMemberErrorMessage, memberService } from './members';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApi = jest.mocked(api);

describe('memberService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN a tenant slug WHEN loading members SHOULD call members endpoint with tenant header', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            documentId: 'member_1',
            role: 'admin',
            user: {
              documentId: 'user_1',
              email: 'owner@example.com',
              name: 'Owner',
              isActive: true,
            },
          },
        ],
      },
    });

    const members = await memberService.getMembers('demo-store');

    expect(mockedApi.get).toHaveBeenCalledWith('/members', {
      headers: { 'x-tenant-id': 'demo-store' },
    });
    expect(members[0].user.email).toBe('owner@example.com');
  });

  it('GIVEN invite payload WHEN inviting member SHOULD post email and role with tenant header', async () => {
    mockedApi.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          documentId: 'invite_1',
          email: 'member@example.com',
          role: 'manager',
          tenantId: 'tenant_1',
          expiresAt: '2026-05-23T00:00:00.000Z',
        },
      },
    });

    const invitation = await memberService.inviteMember('demo-store', {
      email: 'member@example.com',
      role: 'manager',
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/members/invite',
      { email: 'member@example.com', role: 'manager' },
      { headers: { 'x-tenant-id': 'demo-store' } },
    );
    expect(invitation.documentId).toBe('invite_1');
  });

  it('GIVEN backend member errors WHEN mapping messages SHOULD keep admin feedback actionable', () => {
    expect(getMemberErrorMessage({ code: 'MEMBER_EXISTS' }, 'fallback'))
      .toBe('Esta persona ya pertenece a la tienda.');
    expect(getMemberErrorMessage({ code: 'MEMBER_INVITE_EMAIL_DELIVERY_FAILED' }, 'fallback'))
      .toBe('No pudimos enviar la invitacion. Intenta mas tarde.');
    expect(getMemberErrorMessage({ code: 'INVITED_USER_INACTIVE' }, 'fallback'))
      .toBe('Esta cuenta esta inactiva. Contacta al administrador de la plataforma.');
    expect(getMemberErrorMessage({ code: 'FORBIDDEN' }, 'fallback'))
      .toBe('No tienes permiso para gestionar miembros.');
    expect(getMemberErrorMessage({ code: 'UNKNOWN_ERROR' }, 'fallback'))
      .toBe('fallback');
  });
});
