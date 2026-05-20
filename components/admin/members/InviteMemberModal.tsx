import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InviteEmailField } from '@/components/admin/members/InviteEmailField';
import { InviteRoleField } from '@/components/admin/members/InviteRoleField';
import { MemberFormError } from '@/components/admin/members/MemberFormError';
import { MemberModalActions } from '@/components/admin/members/MemberModalActions';
import { MemberModalFrame } from '@/components/admin/members/MemberModalFrame';
import { inviteMemberSchema, type InviteMemberFormData } from '@/lib/validators';

interface InviteMemberModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: InviteMemberFormData) => Promise<string | null>;
}

export function InviteMemberModal(props: InviteMemberModalProps) {
  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: '', role: 'manager' },
  });

  useEffect(() => {
    if (!props.visible) {
      form.reset({ email: '', role: 'manager' });
      form.clearErrors();
    }
  }, [form, props.visible]);

  const submit = async (data: InviteMemberFormData) => {
    form.clearErrors('root');
    const error = await props.onSubmit(data);
    if (error) form.setError('root', { message: error });
  };

  return (
    <MemberModalFrame
      visible={props.visible}
      title="Invitar miembro"
      description="La persona recibira un enlace para crear o conectar su cuenta."
      loading={props.loading}
      onClose={props.onClose}
    >
      <InviteEmailField
        control={form.control}
        error={form.formState.errors.email?.message}
        loading={props.loading}
      />
      <InviteRoleField
        control={form.control}
        error={form.formState.errors.role?.message}
        loading={props.loading}
      />
      <MemberFormError message={form.formState.errors.root?.message} />
      <MemberModalActions
        loading={props.loading}
        submitLabel="Enviar"
        onCancel={props.onClose}
        onSubmit={form.handleSubmit(submit)}
      />
    </MemberModalFrame>
  );
}
