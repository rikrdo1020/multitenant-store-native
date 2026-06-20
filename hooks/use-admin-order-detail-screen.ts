import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAdminOrder } from '@/hooks/api/use-admin-order';
import { useUpdateOrderStatus } from '@/hooks/api/use-update-order-status';
import type { OrderStatus } from '@/types';

export const ADMIN_ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Pagado', value: 'paid' },
  { label: 'Preparando', value: 'processing' },
  { label: 'Preparado', value: 'ready' },
  { label: 'Enviado', value: 'shipped' },
  { label: 'Entregado', value: 'delivered' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Fallido', value: 'failed' },
  { label: 'Rechazado', value: 'rejected' },
  { label: 'Expirado', value: 'expired' },
];

export function useAdminOrderDetailScreen(orderId?: string) {
  const router = useRouter();
  const orderQuery = useAdminOrder(orderId ?? '');
  const updateStatus = useUpdateOrderStatus();
  const order = orderQuery.data;

  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const openTrackingForm = () => {
    setTrackingNumber(order?.trackingNumber ?? '');
    setTrackingCarrier(order?.trackingCarrier ?? '');
    setTrackingUrl(order?.trackingUrl ?? '');
    setAdminNote('');
    setShowTrackingForm(true);
  };

  const handleStatusSelect = (status: OrderStatus) => {
    setShowStatusPicker(false);
    if (!orderId) return;

    if (status === 'shipped') {
      openTrackingForm();
      return;
    }

    updateStatus.mutate({ orderId, status });
  };

  const handleCancel = () => {
    setShowCancelConfirm(false);
    if (!orderId) return;
    updateStatus.mutate({ orderId, status: 'cancelled' });
  };

  const handleShipOrder = () => {
    if (!orderId || !trackingNumber.trim()) return;

    setShowTrackingForm(false);
    updateStatus.mutate({
      orderId,
      status: {
        status: 'shipped',
        trackingNumber: trackingNumber.trim(),
        ...(trackingCarrier.trim() ? { trackingCarrier: trackingCarrier.trim() } : {}),
        ...(trackingUrl.trim() ? { trackingUrl: trackingUrl.trim() } : {}),
        ...(adminNote.trim() ? { adminNote: adminNote.trim() } : {}),
      },
    });
  };

  return {
    order,
    isLoading: orderQuery.isLoading,
    error: orderQuery.error,
    refetch: orderQuery.refetch,
    isUpdating: updateStatus.isPending,
    updateError: updateStatus.error,
    canCancel: order?.orderStatus === 'pending' || order?.orderStatus === 'paid',
    showStatusPicker,
    setShowStatusPicker,
    showCancelConfirm,
    setShowCancelConfirm,
    showTrackingForm,
    setShowTrackingForm,
    trackingNumber,
    setTrackingNumber,
    trackingCarrier,
    setTrackingCarrier,
    trackingUrl,
    setTrackingUrl,
    adminNote,
    setAdminNote,
    goBack: () => router.back(),
    handleStatusSelect,
    handleCancel,
    handleShipOrder,
  };
}

export type AdminOrderDetailViewModel = ReturnType<typeof useAdminOrderDetailScreen>;
