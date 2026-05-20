import { Controller, type Control } from 'react-hook-form';
import { RolePicker } from '@/components/admin/members/RolePicker';
import type { InviteMemberFormData } from '@/lib/validators';

interface InviteRoleFieldProps {
  control: Control<InviteMemberFormData>;
  error?: string;
  loading: boolean;
}

export function InviteRoleField({ control, error, loading }: InviteRoleFieldProps) {
  return (
    <Controller
      control={control}
      name="role"
      render={({ field: { onChange, value } }) => (
        <RolePicker
          value={value}
          disabled={loading}
          error={error}
          onChange={onChange}
        />
      )}
    />
  );
}
