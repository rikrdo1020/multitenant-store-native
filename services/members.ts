import api from './api';
import type {
  ApiError,
  ApiResponse,
  MemberInvitation,
  TeamRole,
  TenantMember,
} from '@/types';

export const memberService = {
  getMembers: async (tenantSlug: string): Promise<TenantMember[]> => {
    const response = await api.get<ApiResponse<TenantMember[]>>('/members', {
      headers: { 'x-tenant-id': tenantSlug },
    });
    return response.data.data;
  },

  inviteMember: async (
    tenantSlug: string,
    payload: { email: string; role: TeamRole },
  ): Promise<MemberInvitation> => {
    const response = await api.post<ApiResponse<MemberInvitation>>(
      '/members/invite',
      payload,
      { headers: { 'x-tenant-id': tenantSlug } },
    );
    return response.data.data;
  },

  getPendingInvitations: async (tenantSlug: string): Promise<MemberInvitation[]> => {
    const response = await api.get<ApiResponse<MemberInvitation[]>>(
      '/members/invitations',
      { headers: { 'x-tenant-id': tenantSlug } },
    );
    return response.data.data;
  },

  updateMemberRole: async (
    tenantSlug: string,
    memberId: string,
    role: TeamRole,
  ): Promise<TenantMember> => {
    const response = await api.put<ApiResponse<TenantMember>>(
      `/members/${memberId}/role`,
      { role },
      { headers: { 'x-tenant-id': tenantSlug } },
    );
    return response.data.data;
  },

  removeMember: async (tenantSlug: string, memberId: string): Promise<void> => {
    await api.delete(`/members/${memberId}`, {
      headers: { 'x-tenant-id': tenantSlug },
    });
  },
};

export function getMemberErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as Partial<ApiError>;

  switch (apiError.code) {
    case 'MEMBER_EXISTS':
      return 'Esta persona ya pertenece a la tienda.';
    case 'MEMBER_INVITE_EMAIL_DELIVERY_FAILED':
      return 'No pudimos enviar la invitacion. Intenta mas tarde.';
    case 'INVITED_USER_INACTIVE':
      return 'Esta cuenta esta inactiva. Contacta al administrador de la plataforma.';
    case 'CANNOT_MODIFY_SUPERADMIN':
      return 'No se puede modificar el rol de un superadmin.';
    case 'CANNOT_REMOVE_SELF':
      return 'No puedes eliminar tu propia cuenta del equipo.';
    case 'MEMBER_NOT_FOUND':
      return 'No encontramos ese miembro en la tienda.';
    case 'FORBIDDEN':
      return 'No tienes permiso para gestionar miembros.';
    default:
      return fallback;
  }
}
