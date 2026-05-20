import type { MemberInvitation, TeamRole, TenantMember } from '@/types';

export const ROLE_OPTIONS: { value: TeamRole; label: string; description: string }[] = [
  {
    value: 'manager',
    label: 'Manager',
    description: 'Puede operar catalogo, pedidos y clientes.',
  },
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Puede gestionar tienda y miembros.',
  },
];

export function roleLabel(role: TenantMember['role'] | TeamRole) {
  if (role === 'superadmin') return 'Superadmin';
  if (role === 'admin') return 'Administrador';
  return 'Manager';
}

export function getMemberDisplayName(member: TenantMember) {
  return member.user.name?.trim() || 'Sin nombre';
}

export function invitationExpiryLabel(invitation: MemberInvitation) {
  const date = new Date(invitation.expiresAt);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha de expiracion no disponible';
  }

  return `Expira ${new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)}`;
}
