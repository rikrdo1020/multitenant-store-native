import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { useAdminCustomer } from '@/hooks/api/use-admin-customer';
import { useUpdateCustomer } from '@/hooks/api/use-update-customer';
import { useDeleteCustomer } from '@/hooks/api/use-delete-customer';
import { formatPrice } from '@/lib/utils';
import { showToast } from '@/lib/toast';

const editCustomerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(7, 'Teléfono inválido'),
});

type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

export default function AdminCustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: customer, isLoading, error, refetch } = useAdminCustomer(id);
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCustomerFormData>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const openEditModal = () => {
    if (!customer) return;
    reset({ name: customer.name, email: customer.email, phone: customer.phone });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (updateCustomer.isPending) return;
    setShowEditModal(false);
  };

  const onSubmitEdit = async (data: EditCustomerFormData) => {
    if (!customer) return;
    try {
      await updateCustomer.mutateAsync({ id: customer.documentId, payload: data });
      showToast('Cliente actualizado', 'success');
      setShowEditModal(false);
    } catch {
      showToast('No se pudo actualizar el cliente', 'error');
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    try {
      await deleteCustomer.mutateAsync(customer.documentId);
      showToast('Cliente eliminado', 'success');
      router.back();
    } catch {
      showToast('No se pudo eliminar el cliente', 'error');
    }
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !customer) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center p-6">
          <Text variant="h2" className="mb-2 text-destructive">Error al cargar</Text>
          <Button onPress={() => refetch()}>Reintentar</Button>
        </View>
      </ScreenWrapper>
    );
  }

  const registrationDate = new Date(customer.createdAt).toLocaleDateString('es-PA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="rounded-full p-1">
            <ArrowLeft size={22} className="text-foreground" />
          </TouchableOpacity>
          <View className="min-w-0 flex-1">
            <Text variant="h1" numberOfLines={1}>{customer.name}</Text>
          </View>
          <TouchableOpacity
            onPress={openEditModal}
            className="rounded-full border border-border p-2"
            hitSlop={8}
          >
            <Pencil size={18} className="text-foreground" />
          </TouchableOpacity>
        </View>

        {/* Info personal */}
        <SectionTitle title="Información personal" />
        <View className="mx-4 mb-4 rounded-xl border border-border bg-card p-4 gap-2">
          <InfoRow label="Nombre" value={customer.name} />
          <InfoRow label="Email" value={customer.email} />
          {customer.phone ? <InfoRow label="Teléfono" value={customer.phone} /> : null}
          <InfoRow label="Registro" value={registrationDate} />
          <InfoRow
            label="Total órdenes"
            value={`${customer.totalOrders} ${customer.totalOrders === 1 ? 'orden' : 'órdenes'}`}
          />
        </View>

        {/* Historial de órdenes */}
        <SectionTitle title="Historial de órdenes" />
        {customer.orders && customer.orders.length > 0 ? (
          <View className="mx-4 mb-4 rounded-xl border border-border bg-card overflow-hidden">
            {customer.orders.map((order, idx) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString('es-PA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <View
                  key={order.documentId}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    idx !== customer.orders.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View className="gap-0.5">
                    <Text variant="body" className="font-semibold text-foreground">
                      #{order.orderId}
                    </Text>
                    <Text variant="xs" className="text-muted-foreground">{orderDate}</Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text variant="body" className="font-bold text-foreground">
                      {formatPrice(order.total)}
                    </Text>
                    <OrderStatusBadge status={order.orderStatus} />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="mx-4 mb-4 rounded-xl border border-border bg-card px-4 py-6">
            <Text variant="body" className="text-center text-muted-foreground">
              Sin órdenes registradas.
            </Text>
          </View>
        )}

        {/* Eliminar cliente */}
        <View className="mx-4 mt-2">
          <Button
            variant="destructive"
            onPress={() => setShowDeleteConfirm(true)}
            disabled={deleteCustomer.isPending}
          >
            <View className="flex-row items-center gap-2">
              <Trash2 size={16} color="#ffffff" />
              <Text className="font-semibold text-primary-foreground">Eliminar cliente</Text>
            </View>
          </Button>
        </View>
      </ScrollView>

      {/* Edit modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View className="flex-1 items-center justify-center px-4" style={styles.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar edición"
            style={StyleSheet.absoluteFill}
            onPress={closeEditModal}
          />

          <View className="w-full max-w-lg gap-5 rounded-lg border border-border bg-background p-5">
            <View className="flex-row items-center justify-between gap-3">
              <Text variant="h3">Editar cliente</Text>
              <Pressable
                onPress={closeEditModal}
                disabled={updateCustomer.isPending}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Cerrar modal"
              >
                <X size={20} className="text-muted-foreground" />
              </Pressable>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nombre"
                  placeholder="Nombre completo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  editable={!updateCustomer.isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  editable={!updateCustomer.isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Teléfono"
                  placeholder="6000-0000"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  editable={!updateCustomer.isPending}
                />
              )}
            />

            <View className="flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={updateCustomer.isPending}
                onPress={closeEditModal}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={updateCustomer.isPending}
                onPress={handleSubmit(onSubmitEdit)}
              >
                Guardar
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Eliminar cliente"
        description={`¿Eliminar a ${customer.name}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        destructive
        loading={deleteCustomer.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScreenWrapper>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text variant="small" className="mx-4 mb-1 font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text variant="small" className="text-muted-foreground">{label}</Text>
      <Text variant="small" className="flex-1 text-right font-medium text-foreground">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
});
