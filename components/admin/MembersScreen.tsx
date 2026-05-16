import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type TextStyle,
  useWindowDimensions,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import {
  Mail,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { useInviteMember, useMembers } from '@/hooks/api/use-members';
import { inviteMemberSchema, type InviteMemberFormData } from '@/lib/validators';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { getMemberErrorMessage } from '@/services/members';
import { useAuthStore } from '@/stores/use-auth-store';
import { useTenantStore } from '@/stores/use-tenant-store';
import type { TeamRole, TenantMember } from '@/types';

const ROLE_OPTIONS: { value: TeamRole; label: string; description: string }[] = [
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

const webTextInputFocusStyle =
  Platform.OS === 'web'
    ? ({ outlineStyle: 'none' } as unknown as TextStyle)
    : undefined;

export function MembersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const { tenant } = useTenantStore();
  const { user } = useAuthStore();
  const canManageMembers = user?.role === 'admin' || user?.role === 'superadmin';
  const membersQuery = useMembers(undefined, canManageMembers);
  const isWide = width >= 768;

  const contentStyle = useMemo(
    () => (isWide ? { maxWidth: 1120, width: '100%' as const } : undefined),
    [isWide],
  );

  if (!tenant) {
    return (
      <ScreenWrapper>
        <CenteredPanel
          title="No hay tienda seleccionada"
          description="Necesitas seleccionar o crear una tienda para gestionar miembros."
          actionLabel="Crear tienda"
          onAction={() => router.push('/(owner)/create-store')}
        />
      </ScreenWrapper>
    );
  }

  if (!canManageMembers) {
    return (
      <ScreenWrapper>
        <CenteredPanel
          title="Acceso restringido"
          description="Tu rol actual no permite gestionar miembros de la tienda."
        />
      </ScreenWrapper>
    );
  }

  const members = membersQuery.data ?? [];

  return (
    <ScreenWrapper scroll>
      <View className="w-full self-center p-4 md:p-6" style={contentStyle}>
        <View className={cn('gap-4', isWide && 'flex-row items-center justify-between')}>
          <View className="min-w-0 flex-1">
            <Text variant="h1">Miembros</Text>
            <Text variant="small" className="mt-1">
              Gestiona quienes pueden operar {tenant.name}.
            </Text>
          </View>

          <Button
            onPress={() => setInviteModalVisible(true)}
            className="flex-row gap-2 rounded-sm"
            accessibilityLabel="Invitar miembro"
          >
            <View className="flex-row items-center gap-2">
              <UserPlus size={18} color="#ffffff" />
              <Text className="font-semibold text-primary-foreground">
                Invitar miembro
              </Text>
            </View>
          </Button>
        </View>

        <View className="mt-6 rounded-lg border border-border bg-card">
          <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
            <View className="flex-row items-center gap-2">
              <Users size={18} className="text-muted-foreground" />
              <Text className="font-semibold text-foreground">
                Equipo activo
              </Text>
            </View>
            <Pressable
              onPress={() => membersQuery.refetch()}
              disabled={membersQuery.isFetching}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Actualizar miembros"
            >
              {membersQuery.isFetching ? (
                <ActivityIndicator size="small" />
              ) : (
                <RefreshCw size={17} className="text-muted-foreground" />
              )}
            </Pressable>
          </View>

          {membersQuery.isLoading ? (
            <View className="items-center justify-center gap-3 py-14">
              <ActivityIndicator size="large" />
              <Text variant="small">Cargando miembros...</Text>
            </View>
          ) : membersQuery.error ? (
            <View className="items-center gap-4 px-5 py-12">
              <Text variant="h3" className="text-center text-destructive">
                Error al cargar
              </Text>
              <Text variant="small" className="text-center">
                No pudimos cargar el equipo. Intenta de nuevo.
              </Text>
              <Button variant="outline" onPress={() => membersQuery.refetch()}>
                Reintentar
              </Button>
            </View>
          ) : members.length === 0 ? (
            <View className="items-center gap-4 px-5 py-12">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserPlus size={22} className="text-muted-foreground" />
              </View>
              <View className="gap-1">
                <Text variant="h3" className="text-center">
                  Aun no hay miembros
                </Text>
                <Text variant="small" className="text-center">
                  Invita a la primera persona que ayudara con la tienda.
                </Text>
              </View>
              <Button onPress={() => setInviteModalVisible(true)}>
                Invitar miembro
              </Button>
            </View>
          ) : (
            <View>
              {members.map((member, index) => (
                <MemberRow
                  key={member.documentId}
                  member={member}
                  isLast={index === members.length - 1}
                  isWide={isWide}
                />
              ))}
            </View>
          )}
        </View>
      </View>

      <InviteMemberModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
      />
    </ScreenWrapper>
  );
}

function MemberRow({
  member,
  isLast,
  isWide,
}: {
  member: TenantMember;
  isLast: boolean;
  isWide: boolean;
}) {
  const displayName = member.user.name?.trim() || 'Sin nombre';
  const isActive = member.user.isActive ?? true;

  return (
    <View
      className={cn(
        'gap-3 px-4 py-4',
        !isLast && 'border-b border-border',
        isWide && 'flex-row items-center justify-between',
      )}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Text className="font-bold text-foreground">
            {displayName.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-semibold text-foreground" numberOfLines={1}>
            {displayName}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <Mail size={13} className="text-muted-foreground" />
            <Text variant="small" numberOfLines={1}>
              {member.user.email}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        <RoleBadge role={member.role} />
        <StatusBadge active={isActive} />
      </View>
    </View>
  );
}

function InviteMemberModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const inviteMember = useInviteMember();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: '', role: 'manager' },
  });

  const closeModal = () => {
    if (inviteMember.isPending) return;
    reset({ email: '', role: 'manager' });
    clearErrors();
    onClose();
  };

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      clearErrors('root');
      await inviteMember.mutateAsync({
        email: data.email.trim().toLowerCase(),
        role: data.role,
      });
      showToast('Invitacion enviada', 'success', data.email.trim().toLowerCase());
      closeModal();
    } catch (error) {
      setError('root', {
        message: getMemberErrorMessage(
          error,
          'No pudimos enviar la invitacion. Intenta de nuevo.',
        ),
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={closeModal}>
      <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar invitacion"
          style={StyleSheet.absoluteFill}
          onPress={closeModal}
        />

        <View className="w-full max-w-lg gap-5 rounded-lg border border-border bg-background p-5">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="h3">Invitar miembro</Text>
              <Text variant="small" className="leading-5">
                La persona recibira un enlace para crear o conectar su cuenta.
              </Text>
            </View>
            <Pressable
              onPress={closeModal}
              disabled={inviteMember.isPending}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal"
            >
              <X size={20} className="text-muted-foreground" />
            </Pressable>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo electronico"
                placeholder="persona@correo.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={webTextInputFocusStyle}
                error={errors.email?.message}
                editable={!inviteMember.isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Text variant="small" className="font-medium text-foreground">
                  Rol
                </Text>
                <View className="gap-2">
                  {ROLE_OPTIONS.map((option) => {
                    const selected = value === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        disabled={inviteMember.isPending}
                        className={cn(
                          'rounded-md border p-3',
                          selected ? 'border-primary bg-primary/10' : 'border-border bg-background',
                        )}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                      >
                        <View className="flex-row items-start gap-3">
                          <ShieldCheck
                            size={18}
                            className={selected ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <View className="min-w-0 flex-1 gap-1">
                            <Text className="font-semibold text-foreground">
                              {option.label}
                            </Text>
                            <Text variant="small" className="leading-5">
                              {option.description}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                {errors.role && (
                  <Text variant="xs" className="text-destructive">
                    {errors.role.message}
                  </Text>
                )}
              </View>
            )}
          />

          {errors.root && (
            <View className="border-l-2 border-destructive py-1 pl-4">
              <Text className="text-sm text-destructive">{errors.root.message}</Text>
            </View>
          )}

          <View className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={inviteMember.isPending}
              onPress={closeModal}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              loading={inviteMember.isPending}
              onPress={handleSubmit(onSubmit)}
            >
              Enviar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function CenteredPanel({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text variant="h2" className="text-center">
        {title}
      </Text>
      <Text variant="body" className="max-w-md text-center text-muted-foreground">
        {description}
      </Text>
      {actionLabel && onAction && <Button onPress={onAction}>{actionLabel}</Button>}
    </View>
  );
}

function RoleBadge({ role }: { role: TenantMember['role'] }) {
  return (
    <View className="rounded-full border border-border bg-background px-3 py-1">
      <Text className="text-xs font-semibold text-foreground">{roleLabel(role)}</Text>
    </View>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <View className={cn('rounded-full px-3 py-1', active ? 'bg-primary/10' : 'bg-muted')}>
      <Text className={cn('text-xs font-semibold', active ? 'text-primary' : 'text-muted-foreground')}>
        {active ? 'Activo' : 'Inactivo'}
      </Text>
    </View>
  );
}

function roleLabel(role: TenantMember['role']) {
  if (role === 'superadmin') return 'Superadmin';
  if (role === 'admin') return 'Administrador';
  return 'Manager';
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});
