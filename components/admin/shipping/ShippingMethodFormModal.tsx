import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShippingFormError } from '@/components/admin/shipping/ShippingFormError';
import { ShippingMethodFormFields } from '@/components/admin/shipping/ShippingMethodFormFields';
import { ShippingModalActions } from '@/components/admin/shipping/ShippingModalActions';
import { ShippingModalFrame } from '@/components/admin/shipping/ShippingModalFrame';
import {
  getShippingMethodFormValues,
  shippingMethodFormSchema,
  type ShippingMethodFormData,
} from '@/lib/shipping-method-form';
import type { ShippingMethod } from '@/types';

interface ShippingMethodFormModalProps {
  visible: boolean;
  method: ShippingMethod | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: ShippingMethodFormData) => Promise<string | null>;
}

export function ShippingMethodFormModal(props: ShippingMethodFormModalProps) {
  const form = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodFormSchema),
    defaultValues: getShippingMethodFormValues(props.method),
  });

  useEffect(() => {
    if (props.visible) {
      form.reset(getShippingMethodFormValues(props.method));
      form.clearErrors();
    }
  }, [form, props.method, props.visible]);

  const submit = async (data: ShippingMethodFormData) => {
    form.clearErrors('root');
    const error = await props.onSubmit(data);
    if (error) form.setError('root', { message: error });
  };

  return (
    <ShippingModalFrame
      visible={props.visible}
      title={props.method ? 'Editar metodo' : 'Nuevo metodo'}
      description="Define como el cliente recibira sus productos."
      loading={props.loading}
      onClose={props.onClose}
    >
      <ShippingMethodFormFields
        control={form.control}
        errors={form.formState.errors}
        loading={props.loading}
      />
      <ShippingFormError message={form.formState.errors.root?.message} />
      <ShippingModalActions
        loading={props.loading}
        submitLabel={props.method ? 'Guardar cambios' : 'Crear metodo'}
        onCancel={props.onClose}
        onSubmit={form.handleSubmit(submit)}
      />
    </ShippingModalFrame>
  );
}
