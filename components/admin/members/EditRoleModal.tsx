import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { MemberModalFrame } from '@/components/admin/members/MemberModalFrame';
import { RolePicker } from '@/components/admin/members/RolePicker';
import { getMemberDisplayName } from '@/lib/member-helpers';
import type { TeamRole, TenantMember } from '@/types';

interface EditRoleModalProps {
  member: TenantMember | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (role: TeamRole) => Promise<string | null>;
}

export function EditRoleModal({ member, loading, onClose, onSubmit }: EditRoleModalProps) {
  const [role, setRole] = useRoleState(member);
  const [error, setError] = useErrorState(member);

  const submit = async () => {
    const result = await onSubmit(role);
    setError(result);
  };

  return (
    <MemberModalFrame
      visible={Boolean(member)}
      title="Editar rol"
      description={member ? `Actualiza el acceso de ${getMemberDisplayName(member)}.` : ''}
      loading={loading}
      onClose={onClose}
    >
      <RolePicker value={role} disabled={loading} onChange={setRole} />
      {error && (
        <View className="border-l-2 border-destructive py-1 pl-4">
          <Text className="text-sm text-destructive">{error}</Text>
        </View>
      )}
      <View className="flex-row gap-3">
        <Button variant="outline" className="flex-1" disabled={loading} onPress={onClose}>
          Cancelar
        </Button>
        <Button className="flex-1" loading={loading} onPress={submit}>
          Guardar
        </Button>
      </View>
    </MemberModalFrame>
  );
}

function useRoleState(member: TenantMember | null) {
  const [role, setRole] = useState<TeamRole>(
    member?.role === 'admin' || member?.role === 'manager' ? member.role : 'manager',
  );

  useEffect(() => {
    if (member?.role === 'admin' || member?.role === 'manager') {
      setRole(member.role);
    }
  }, [member, setRole]);

  return [role, setRole] as const;
}

function useErrorState(member: TenantMember | null) {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setError(null), [member, setError]);
  return [error, setError] as const;
}
